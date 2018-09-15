import * as React from 'react';

export const IndicatorPanel: React.StatelessComponent = ({normal, defective, children}: any) => {
  return (
    <div>
      <h6>this is the legend</h6>
      <p>{normal ? `green text: ${normal}` : ''}</p>
      <p>{defective ? `red text: ${defective}` : ''}</p>
      <h6>these are icons representing the genes</h6>
      {...children}
    </div>
  );
};

const BUTTON = {
  dna: {
    normal: {
      rest: require('src/assets/indicator/dna/normal/rest.png'),
      hover: require('src/assets/indicator/dna/normal/hover.png'),
      down: require('src/assets/indicator/dna/normal/down.png'),
      disabled: require('src/assets/indicator/dna/normal/disabled.png')
    },
    unknown: {
      rest: require('src/assets/indicator/dna/unknown/rest.png'),
      hover: require('src/assets/indicator/dna/unknown/hover.png'),
      down: require('src/assets/indicator/dna/unknown/down.png'),
      disabled: require('src/assets/indicator/dna/unknown/disabled.png')
    },
    defective: {
      rest: require('src/assets/indicator/dna/defective/rest.png'),
      hover: require('src/assets/indicator/dna/defective/hover.png'),
      down: require('src/assets/indicator/dna/defective/down.png'),
      disabled: require('src/assets/indicator/dna/defective/disabled.png')
    }
  }
};

export const Indicator: React.StatelessComponent = ({icon, name, state, link}: any) => {
  const iconImage = BUTTON[icon][state]['rest'];
  // FIXME: need to incorporate hover, down, disabled states
  return (
    <div>
      <a href={link}>{name}<img src={iconImage}/></a>
    </div>
  );
};
