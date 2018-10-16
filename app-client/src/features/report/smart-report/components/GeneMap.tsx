/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
 * @Author: Aneil Mallavarapu
 * @Date: 2018-10-16 09:48:32
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-10-16 09:49:33
 */

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

