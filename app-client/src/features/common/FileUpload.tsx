import * as React from 'react';
import * as CryptoJS from 'crypto-js';
import Radium from 'radium';

import * as RW from 'src/features/common/RadiumWrappers';
import * as Styles from 'src/constants/styles';
import * as AuthUtils from 'src/utils/auth';
import { getEnvVar } from 'src/utils/env';


enum UploadState { NoFile, Checksumming, Ready, Uploading, Success, Failure }


interface FileUploadComponentState {
  uploadState: UploadState;
  hash: string;
  reason: string;
  file: any;
}


@Radium
export class FileUpload extends React.Component<{
  isOpen: boolean,
  onCancel: () => void,
  onFinish: (complete: boolean) => void
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
    // XXX: The upload MUST put the file in the body directly, without using
    // FormData because FormData is incompatible with S3 uploads:
    // https://github.com/aws/aws-sdk-js/issues/547#issuecomment-86873980
    const fetchOptionsUpload: RequestInit = {
      method: 'PUT',
      body: this.state.file
    };
    const uploadResult = await fetch(location, fetchOptionsUpload);
    if (200 === uploadResult.status) {
      this.setState({uploadState: UploadState.Success});
      this.callFinish(true);
    } else {
      const resultBody = await uploadResult.text();
      // TODO: Unfortunately, the result body is a full HTML document, and
      // extracting its relevant bits seems like a bad idea. It would be nice
      // to get a better error.
      console.log('error:', resultBody);
      this.setState({uploadState: UploadState.Failure, reason: 'AWS mystery'});
      this.callFinish(false);
    }
  }

  callFinish = (result: boolean) => {
    this.props.onFinish(result);
  }

  callCancel = () => {
    this.props.onCancel();
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
      const arrayBuffer = event.target.result;
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
      const hash = CryptoJS.SHA256(wordArray).toString();
      this.setState({hash, uploadState: UploadState.Ready});
    };
    reader.readAsArrayBuffer(f);
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

  renderHeader(): JSX.Element {
    return (
      <RW.ModalHeader style={headerStyle}>
        It’s easy to upload your 23andMe data
      </RW.ModalHeader>
    );
  }

  renderBody(): JSX.Element {
    const disabled = this.state.uploadState !== UploadState.Ready;
    return (
      <RW.ModalBody style={bodyStyle}>
        <form onSubmit={this.upload}>
          <div>
            uploading for user ID {AuthUtils.getUserId()}
          </div>
          <input type="file" onChange={this.prepareFileForUpload} />
          {this.renderUploadStatus()}
          <button type="submit" disabled={disabled}>Upload</button>
        </form>
      </RW.ModalBody>
    );
  }

  renderFooter(): JSX.Element {
    return (
      <RW.ModalFooter style={footerStyle}>
        <div>
          <button onClick={this.callCancel} style={cancelStyle}>Cancel</button>
        </div>
        <div>
          Your privacy and security is our priority.
          &nbsp;
          <RW.Link to="/privacy-policy">View our Privacy Policy</RW.Link>
        </div>
      </RW.ModalFooter>
    );
  }

  render(): JSX.Element {
    return (
      <RW.Modal isOpen={this.props.isOpen} fade={true} centered={true} style={modalStyle}>
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </RW.Modal>
    );
  }

}


const modalStyle: React.CSSProperties = {
};

const headerStyle: React.CSSProperties = {
};

const bodyStyle: React.CSSProperties = {
};

const footerStyle: React.CSSProperties = {
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center'
};

const cancelStyle: React.CSSProperties = {
  fontSize: '16px',
  backgroundColor: 'inherit',
  color: Styles.colors.blue,
  border: 'none',
  padding: '0 !important',
  cursor: 'pointer'
};
