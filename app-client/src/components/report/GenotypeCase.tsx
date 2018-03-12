/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';

export interface GenotypeCaseProps {
  children: React.ReactNode;
  svn?: string;
}

// tslint:disable-next-line
export const GenotypeCase = ({__children}: any, render: any) => {
  render('<div>');
  render(__children);
  render('</div>');
};
