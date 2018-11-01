import * as React from 'react';
import * as Styles from 'src/constants/styles';
import Radium from 'radium';


export interface CTAOverlayProps {
  heading: string;
  subheading: string;
  action?: React.ReactElement<any>;
}


export const CTAOverlay: React.StatelessComponent<CTAOverlayProps> = ({
  heading,
  subheading,
  action
}) => {
  return (
    <div id="bottom-overlay" style={bottomOverlayStyle}>
      <Radium.Style scopeSelector="#bottom-overlay button" rules={Styles.actionButtonStyle} />
      <h1 style={headingStyle}>{heading}</h1>
      <h6 style={subheadingStyle}>{subheading}</h6>
      <div style={actionStyle}>
        {action}
      </div>
    </div>
  );
};


const bottomOverlayStyle: React.CSSProperties = {
  color: 'white',
  backgroundColor: Styles.colors.preciselyPurpleAlpha,
  position: 'fixed',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  bottom: '0',
  margin: '0',
  textAlign: 'center',
  width: '100%',
  height: '264px'
};

const headingStyle: React.CSSProperties = {
  position: 'absolute',
  top: '28px',
  textAlign: 'center',
  width: '100%',
  fontSize: '40px',
  fontWeight: 500
};

const subheadingStyle: React.CSSProperties = {
  position: 'absolute',
  textAlign: 'center',
  width: '100%',
  padding: '0px',
  margin: '0px',
  marginTop: '-5px',
  fontSize: '20px',
  fontWeight: 300
};

const actionStyle: React.CSSProperties = {
  position: 'absolute',
  textAlign: 'center',
  width: '100%',
  bottom: '46px'
};
