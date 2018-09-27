import * as React from 'react';
import * as CryptoJS from 'crypto-js';

import * as AuthUtils from 'src/utils/auth';
import { getEnvVar } from 'src/utils/env';


enum UploadState { NoFile, Checksumming, Ready, Uploading, Success, Failure }


interface FileUploadComponentState {
  uploadState: UploadState;
  hash: string;
  reason: string;
  file: any;
}


export class FileUpload extends React.Component<{
  onFinish?: (complete: boolean) => void
}, FileUploadComponentState> {

  constructor(props: any) {
    super(props);
    this.state = {
      file: null,
      hash: '',
      uploadState: UploadState.NoFile,
      reason: ''
    };
  }

  upload = async (event: any) => {
    event.preventDefault();
    await this.setState({uploadState: UploadState.Uploading});
    // request an upload location
    const fetchOptionsLocation: RequestInit = {
      method: 'GET',
      headers: {...AuthUtils.makeAuthorizationHeader()}
    };
    const locationResp = await fetch(
      `${getEnvVar('REACT_APP_BIOINFORMATICS_UPLOAD_SIGNED_URL_ENDPOINT')}?key=${this.state.hash}`,
  fetchOptionsLocation);
    let location = await locationResp.text();
    // XXX: Nasty workaround to unquote the quoted string returned from the Lambda...
    const quoteChar = '"';
    if (location[0] === quoteChar && location[location.length - 1] === quoteChar) {
      location = location.slice(1, location.length - 1);
    }
    // upload
    const formData = new FormData();
    const f = this.state.file;
    formData.append('file', f);
    const fetchOptionsUpload: RequestInit = {
      method: 'PUT',
      body: formData
    };
    const uploadResult = await fetch(location, fetchOptionsUpload);
    if (200 === uploadResult.status) {
      this.setState({uploadState: UploadState.Success});
      this.callFinishCallback(true);
    } else {
      const resultBody = await uploadResult.text();
      // TODO: Unfortunately, the result body is a full HTML document, and
      // extracting its relevant bits seems like a bad idea. It would be nice
      // to get a better error.
      console.log('error:', resultBody);
      this.setState({uploadState: UploadState.Failure, reason: 'AWS mystery'});
      this.callFinishCallback(false);
    }
  }

  callFinishCallback(result: boolean) {
    if (this.props.onFinish) {
      this.props.onFinish(result);
    }
  }

  prepareFileForUpload = async (event: any) => {
    event.preventDefault();
    event.persist();
    // checksum the file
    await this.setState({file: null, hash: '', uploadState: UploadState.Checksumming});
    const f = event.target.files[0];
    this.setState({file: f});
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const binary = event.target.result;
      const hash = CryptoJS.SHA256(binary).toString();
      this.setState({hash, uploadState: UploadState.Ready});
    };
    reader.readAsBinaryString(f);
  }

  renderUploadStatus = () => {
    let status;
    switch (this.state.uploadState) {
      case UploadState.Success:
        status = 'upload complete';
        break;
      case UploadState.Ready:
        status = `ready to upload, file hash: ${this.state.hash}`;
        break;
      case UploadState.Checksumming:
        status = 'checksumming file, please wait';
        break;
      case UploadState.NoFile:
        status = 'select a file';
        break;
      case UploadState.Uploading:
        status = 'uploading file, please wait';
        break;
      case UploadState.Failure:
        status = `error: ${this.state.reason}`;
        break;
    }
    return (
      <div>
        {status}
      </div>
    );
  }

  render(): JSX.Element {
    const disabled = this.state.uploadState !== UploadState.Ready;
    return (
      <form onSubmit={this.upload}>
        <div>
          uploading for user ID {AuthUtils.getUserId()}
        </div>
        <input type="file" onChange={this.prepareFileForUpload} />
        {this.renderUploadStatus()}
        <button type="submit" disabled={disabled}>Upload</button>
      </form>
    );
  }

}
