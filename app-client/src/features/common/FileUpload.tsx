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
        status = 'Upload complete.';
        break;
      case UploadState.Ready:
        status = 'Ready to upload.';
        break;
      case UploadState.Checksumming:
        status = 'Checksumming file, please wait...';
        break;
      case UploadState.NoFile:
        status = 'Please select a file.';
        break;
      case UploadState.Uploading:
        status = 'Uploading file, please wait...';
        break;
      case UploadState.Failure:
        status = `Error: ${this.state.reason}`;
        break;
    }
    if (this.state.file) {
      return (
        <div style={uploadStatusStyle}>
          {status}
          <br />
          {this.state.file.name}
        </div>
      );
    } else {
      return (
        <div style={uploadStatusStyle}>
          {status}
        </div>
      );
    }
  }

  renderHeader(): JSX.Element {
    return (
      <RW.ModalHeader style={headerStyle}>
        <Radium.Style scopeSelector="#file-upload-modal .modal-title" rules={headerTitleStyle} />
        <div style={headerLine1Style}>
          It’s easy to upload your 23andMe data
        </div>
        <div style={headerLine2Style}>
          Log in to 23andMe and download your DNA file then upload it here.
        </div>
      </RW.ModalHeader>
    );
  }

  renderBody(): JSX.Element {
    const disabled = this.state.uploadState !== UploadState.Ready;
    return (
      <RW.ModalBody style={bodyStyle}>
        <table style={bodyTableStyle}>
          <tbody>
            <tr style={line1Style}>
              <td style={col1Style}>Step 1.</td>
              <td style={col2Style}>
                Go to <a href="https://www.23andme.com/you/download">www.23andme.com/you/download</a> and download your 23andMe data to your computer
              </td>
            </tr>
            <tr style={line2Style}>
              <td style={col1Style}>Step 2.</td>
              <td style={col2Style}>Upload your data using the form below</td>
            </tr>
          </tbody>
        </table>
        <form onSubmit={this.upload} style={uploadFormStyle}>
          <div style={uploadFormBoxStyle}>
            <label htmlFor="file-upload-input" style={uploadFormButtonStyle}>
              Browse
            </label>
            <input id="file-upload-input" type="file" onChange={this.prepareFileForUpload} style={uploadFormInputStyle} />
            {this.renderUploadStatus()}
          </div>
          <button type="submit" disabled={disabled} style={uploadFormButtonStyle}>Submit</button>
        </form>
        {this.renderDebuggingInfo()}
      </RW.ModalBody>
    );
  }

  renderFooter(): JSX.Element {
    return (
      <RW.ModalFooter style={footerStyle}>
        <div style={footerCancelStyle}>
          <button onClick={this.callCancel} style={cancelButtonStyle}>Cancel</button>
        </div>
        <div style={footerPrivacyNoteStyle}>
          Your privacy and security is our priority. <RW.Link to="/privacy-policy">View our Privacy Policy</RW.Link>
        </div>
      </RW.ModalFooter>
    );
  }

  renderDebuggingInfo(): JSX.Element {
    return (
      <div style={debuggingInfoStyle}>
        <div>
          uploading for user ID {AuthUtils.getUserId()}
        </div>
        <div>
          file hash: {this.state.hash}
        </div>
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <RW.Modal id="file-upload-modal" isOpen={this.props.isOpen} size="lg" fade={true} centered={true} style={modalStyle}>
        <Radium.Style scopeSelector="#file-upload-modal.modal-lg" rules={modalLgStyle} />
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </RW.Modal>
    );
  }

}


const modalStyle: React.CSSProperties = {
  fontWeight: 300
};

const modalLgStyle: React.CSSProperties = {
  maxWidth: '656px'
};

const headerStyle: React.CSSProperties = {
  borderBottom: 'none'
};

const headerTitleStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '28px',
  textAlign: 'center'
};

const headerLine1Style: React.CSSProperties = {
  fontSize: '30px'
};

const headerLine2Style: React.CSSProperties = {
  marginBottom: '-4px',
  fontSize: '16px'
};

const bodyStyle: React.CSSProperties = {
  fontSize: '16px'
};

const bodyTableStyle: React.CSSProperties = {
  width: '440px',
  marginTop: '20px',
  marginLeft: 'auto',
  marginRight: 'auto'
};

const line1Style: React.CSSProperties = {
};

const line2Style: React.CSSProperties = {
  lineHeight: '46px'
};

const col1Style: React.CSSProperties = {
  width: '60px',
  verticalAlign: 'top'
};

const col2Style: React.CSSProperties = {
};

const uploadFormStyle: React.CSSProperties = {
  width: '420px',
  height: '50px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
  marginLeft: 'auto',
  marginRight: 'auto'
};

const uploadFormBoxStyle: React.CSSProperties = {
  width: '320px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${Styles.colors.blue}`
};

const uploadFormButtonStyle: Styles.ExtendedCSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  color: Styles.colors.white,
  backgroundColor: Styles.colors.blue,
  width: '78px',
  height: '34px',
  marginTop: '0px',
  marginRight: '0px',
  marginBottom: '0px',
  marginLeft: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: '8px',
  ':disabled': {
    backgroundColor: Styles.colors.disabledBlue
  }
};

const uploadFormInputStyle: React.CSSProperties = {
  display: 'none'
};

const footerStyle: React.CSSProperties = {
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
  fontSize: '16px',
  borderTop: 'none'
};

const footerCancelStyle: React.CSSProperties = {
  marginBottom: '20px'
};

const footerPrivacyNoteStyle: React.CSSProperties = {
  marginTop: '20px'
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: 'inherit',
  color: Styles.colors.blue,
  border: 'none',
  padding: '0 !important',
  cursor: 'pointer'
};

const uploadStatusStyle: React.CSSProperties = {
  height: '40px',
  fontSize: '12px',
  width: '220px',
  marginLeft: '10px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  textAlign: 'right',
  verticalAlign: 'middle',
  display: 'flex',
  flexDirection: 'row-reverse',
  alignContent: 'center',
  alignItems: 'center'
};

const debuggingInfoStyle: React.CSSProperties = {
  display: 'none'
};
