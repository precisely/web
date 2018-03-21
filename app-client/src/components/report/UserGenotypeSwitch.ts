/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import {Genotype} from 'src/containers/report/interfaces';

const findGenotype = (svn: string, genotypes: Genotype[]): boolean => {
  console.log('genotypes', genotypes);
  return genotypes.some(genotype => {
    return genotype.variantCall === svn;
  });
};

// tslint:disable-next-line
export const UserGenotypeSwitch = ({__children, gene, userData}: any, render: any): any => {

    if (!__children) {
      return null;
    }

    let genotypeCase: React.ReactNode;

    __children.map((child: {rawName: string, attrs: {svn: string}}): JSX.Element | void => {
      if (child.rawName === 'GenotypeCase' && findGenotype(child.attrs.svn, userData.genotypes)) {
        genotypeCase = child;
        return;
      }
    });

    if (!genotypeCase) {
      genotypeCase = __children[__children.length - 1];
    }

    render('<div>');
    render(genotypeCase);
    render('</div>');
};
