import * as React from 'react';

export const GeneMap: React.StatelessComponent = ({start, end, children}: any) => {
  return (
  <div>
    <p>GeneMap showing variants from {start} to {end} goes here</p>
    {children}
  </div>);
};

export const Variant: React.StatelessComponent = ({pos, ref, alt, children}: any) => {
  return (
  <div>
    <p>Variant at {pos} showing {ref} => {alt} change</p>
    {children}
  </div>);
};

