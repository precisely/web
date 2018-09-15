import * as React from 'react';
import * as CryptoJS from 'crypto-js';

import { getEnvVar } from 'src/utils/env';


enum UploadState { NoFile, Checksumming, Ready, Uploading, Success, Failure }


interface FileUploadComponentState {
  uploadState: UploadState;
  hash: string;
  reason: string;
  file: any;
}


export class FileUpload extends React.Component<any, FileUploadComponentState> {

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
    const locationResp = await fetch(`${getEnvVar('REACT_APP_BIOINFORMATICS_UPLOAD_TOKEN_ENDPOINT')}?key=${this.state.hash}`);
    let location = await locationResp.text();
    // XXX: Nasty workaround to unquote the quoted string returned from the Lambda...
    location = location.substring(0, location.length - 1).substring(1);
    // upload
    const formData = new FormData();
    const f = this.state.file;
    formData.append('file', f);
    const options: RequestInit = {
      method: 'PUT',
      body: formData
    };
    const uploadResult = await fetch(location, options);
    if (200 === uploadResult.status) {
      this.setState({uploadState: UploadState.Success});
    } else {
      this.setState({uploadState: UploadState.Failure, reason: 'TODO'});
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
        <input type="file" onChange={this.prepareFileForUpload} />
        {this.renderUploadStatus()}
        <button type="submit" disabled={disabled}>Upload</button>
      </form>
    );
  }

}
