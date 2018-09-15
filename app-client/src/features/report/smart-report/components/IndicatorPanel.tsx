import * as React from 'react';

export const IndicatorPanel: React.StatelessComponent = ({normal, abnormal, children}: any) => {
  return (
    <div>
      <h6>this is the legend</h6>
      <p>{normal ? `green text: ${normal}` : ''}</p>
      <p>{abnormal ? `red text: ${abnormal}` : ''}</p>
      <h6>these are icons representing the genes</h6>
      {...children}
    </div>
  );
};

export const Indicator: React.StatelessComponent = ({icon, name, state, link}: any) => {
  const iconURL = `src/assets/indicators/${icon.toLowerCase() || 'gene'}`;
  const color = {abnormal: 'red', normal: 'green'}[state] || 'grey';

  return (
    <div style={{backgroundColor: color}}>
      <a href={link}>{name}<img src={iconURL}/></a>
    </div>
  );
};

