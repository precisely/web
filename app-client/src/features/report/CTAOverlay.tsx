import * as React from 'react';
import { colors } from 'src/constants/styles';

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
  const bottomOverlayStyle: React.CSSProperties = {
    color: 'white',
    position: 'fixed',
    bottom: '0',
    margin: '0',
    textAlign: 'center',
    width: '100%',
    padding: '30px 0px'
  };
  return  (
    <div style={{...bottomOverlayStyle, backgroundColor: colors.preciselyPurple}}>
      <h1>{heading}</h1>
      <h6>{subheading}</h6>
      {action}
    </div>
  );
};
