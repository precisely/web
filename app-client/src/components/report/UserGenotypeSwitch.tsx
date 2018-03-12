/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import {UserData} from 'src/containers/report/interfaces';
import {getUserDataByGene, hasMatchingSvnForGene} from 'src/containers/report/utils';

// tslint:disable-next-line
export const UserGenotypeSwitch = ({__children, gene, userData}: any, render: any): any => {

    let userDataByGene: UserData[] = getUserDataByGene(gene, userData);    

    if (!__children) {
      return null;
    }

    let genotypeCase: React.ReactNode;

    __children.map((child: {attrs: {svn: string}}): JSX.Element | void => {
      if (hasMatchingSvnForGene(child.attrs.svn, userDataByGene)) {
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
