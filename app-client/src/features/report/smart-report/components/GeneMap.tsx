import * as React from 'react';


export const GeneMap: React.StatelessComponent<{
  start: number,
  end: number
}> = ({start, end, children}) => {
  return (
    <div>
      <p>GeneMap showing variants from {start} to {end} goes here</p>
      {children}
    </div>
  );
};

export const Variant: React.StatelessComponent<{
  pos: number,
  refBases: string,
  altBases: string
}> = ({pos, refBases, altBases, children}) => {
  return (
    <div>
      <p>Variant at {pos} showing {refBases} to {altBases} change</p>
      {children}
    </div>
  );
};
