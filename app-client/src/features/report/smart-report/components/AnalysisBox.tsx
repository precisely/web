import * as React from 'react';

export const AnalysisBox: React.StatelessComponent = ({children}: any) => {
  return <div>{children}</div>;
};

export const Analysis: React.StatelessComponent = ({name, children}: any) => {
  return (<div><h1>{name}</h1>{children}</div>);
};

