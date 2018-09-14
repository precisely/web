import * as React from 'react';

export const IndicatorPanel: React.StatelessComponent = ({normal, abnormal, children}: any) => {
  return (
    <div>
      <h4>this is the legend</h4>
      <p>{normal ? `green text: ${normal}` : ''}</p>
      <p>{abnormal ? `red text: ${abnormal}` : ''}</p>
      {...children}
    </div>
  );
};

export const Indicator: React.StatelessComponent = ({icon, state}: any) => {
  const iconURL = `src/assets/indicators/${icon.toLowerCase() || 'gene'}`;
  const color = {abnormal: 'red', normal: 'green'}[state] || 'grey';

  return (
    <div>
      color should be {color}
      <img src={iconURL} alt={icon || 'missing image'}/>
    </div>
  );
};

