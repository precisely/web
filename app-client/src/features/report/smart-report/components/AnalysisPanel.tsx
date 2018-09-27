import * as React from 'react';
import { AnalysisColors } from 'src/constants/styleGuide';

export const AnalysisPanel: React.StatelessComponent<any> = ({titlePrefix, children}: any) => {
  // TODO: handle userSampleStatus
  const childrenWithTitlePrefix = React.Children.map(children, (child: any) => {
    if (React.isValidElement(child)) {
      return React.cloneElement<any>(child, { titlePrefix });
    } else {
      return child;
    }
  });
  return <>{childrenWithTitlePrefix}</>;
};

export const Analysis: React.StatelessComponent = ({titlePrefix, title, type, children}: any) => {
  const color = AnalysisColors[type];
  const style = {color, borderColor: color, borderWidth: '0.5px', padding: '20px', borderStyle: 'solid' };
  const fullTitle = titlePrefix ? [titlePrefix, title].join(' ') : title;
  return (
    <div className="highlight" style={style}>
      <h1 style={{textAlign: 'center'}}>{fullTitle}</h1>
      {...children}
    </div>
  );
};

