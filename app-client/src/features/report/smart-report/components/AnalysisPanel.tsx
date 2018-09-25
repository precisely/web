import * as React from 'react';

export const AnalysisPanel: React.StatelessComponent = ({children}: any) => {
  // TODO: handle userSampleStatus
  return children;
};

export const Analysis: React.StatelessComponent = ({name, children}: any) => {
  return <div><h1>{name}</h1>{...children}</div>;
};

