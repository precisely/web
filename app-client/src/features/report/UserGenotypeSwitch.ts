/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import {Genotype, UserData} from 'src/features/report/interfaces';

const findGenotype = (svn: string, genotypes: Genotype[]): boolean => {
  return genotypes.some(genotype => {
    return genotype.variantCall === svn;
  });
};

const getUserDataByGene = (gene: string, userData: UserData): Genotype[] => {
  // Using an array was necessary because gene is not a unique attribute in the model.
  return userData.genotypes.filter((genotype) => gene === genotype.gene);
};

// tslint:disable-next-line
export const UserGenotypeSwitch = ({__children, gene, userData}: any, render: any): any => {

  let userDataByGene: Genotype[] = getUserDataByGene(gene, userData);

  if (!__children) {
    return null;
  }

  let genotypeCase: React.ReactNode;

  __children.map((child: {rawName: string, attrs: {svn: string}}): JSX.Element | void => {
    if (child.rawName === 'GenotypeCase' && findGenotype(child.attrs.svn, userDataByGene)) {
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
