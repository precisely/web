import * as React from 'react';
import { FileUpload } from 'src/features/common/FileUpload';
import { IndicatorProps } from './Indicator';
const curiousCTA = require('src/assets/cta/curious.png');
const processingCTA = require('src/assets/cta/processing.png');
const normalDot = require('src/assets/indicator/legend/normal.png');
const defectiveDot = require('src/assets/indicator/legend/defective.png');
const enhancedDot = require('src/assets/indicator/legend/enhanced.png');
const unknownDot = require('src/assets/indicator/legend/unknown.png');

type IndicatorPanelState = { showUpload: boolean, userSampleStatus: string };
const CenteredDivStyle: React.CSSProperties = {position: 'absolute', top: '50%%', margin: 'auto', width: '100%'};

export class IndicatorPanel extends React.Component<
{ normal: string, defective: string, enhanced: string, unknown: string, userSampleStatus: string},
IndicatorPanelState
> {
  public readonly state: IndicatorPanelState = {
    showUpload: false, userSampleStatus: 'unsatisfied'
  };
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.setState({userSampleStatus: this.props.userSampleStatus});
  }

  render() {
    return (
      <div style={{position: 'relative', minHeight: '200px', minWidth: '100%', textAlign: 'center'}}>
        {this.state.userSampleStatus === 'ready' ? this.renderPanelWithUserResults() : this.renderPanelWithCTA()}
      </div>
    );
  }

  renderPanelWithCTA() {
    const disabledChildren = React.Children.map(
      this.props.children, (child: React.ReactElement<IndicatorProps>) => React.cloneElement<IndicatorProps>(child, {
        state: 'unknown', disabled: true
      })
    );
    // tslint:disable jsx-wrap-multiline
    return (
      <>
        {this.renderLegend()}
        <div style={{position: 'absolute'}}>
          {...disabledChildren}
        </div>
        {this.renderCTA()}
        {this.conditionallyRenderFileUpload()}
      </>
    );
    // tslint:enable jsx-wrap-multiline
  }

  renderPanelWithUserResults() {
    // tslint:disable jsx-wrap-multiline
    return (
      <>
        {this.renderLegend()}
        <div style={{position: 'absolute'}}>
          {this.props.children}
        </div>
      </>
    );
    // tslint:enable jsx-wrap-multiline
  }

  conditionallyRenderFileUpload() {
    const fileUploadCallback = (complete: boolean) => {
      console.log('fileUploadCallback called: %s', complete);
      if (complete) {
        this.setState({userSampleStatus: 'processing', showUpload: false });
      }
    };

    if (this.state.showUpload) {
      return (
        <div style={{...CenteredDivStyle, backgroundColor: 'white', height: '100%'}}>
          <FileUpload onFinish={fileUploadCallback}/>
        </div>
      );
    } else {
      return null;
    }
  }

  renderLegend() {
    return (
      <>
      <img src={normalDot}/><span>{this.props.normal}</span>
      <img src={defectiveDot}/><span>{this.props.defective}</span>
      {this.props.enhanced ? <><img src={enhancedDot}/><span>{this.props.enhanced}</span></> : null}
      {this.props.unknown ? <><img src={unknownDot}/><span>{this.props.unknown}</span></> : null}
      </>
    );
  }

  renderCTA() {
    if (this.state.userSampleStatus === 'processing') {
      return <div style={CenteredDivStyle}><img src={processingCTA}/></div>;
    } else {
      const clickHandler = () => this.setState({showUpload: true});
      return <div style={CenteredDivStyle}><img src={curiousCTA} onClick={clickHandler}/></div>;
    }
  }
}
