/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Query} from 'dynogels';
import {Genotype, GenotypeAttributes} from '../models/Genotype';
import {hasAuthorizedRoles} from '../../utils';
import {AuthorizerAttributes} from '../../interfaces';
import {log} from '../../logger';
import {execAsync} from '../../utils';

export interface ListGenotypeFilters {
  opaqueId: string;
  genes: string[];
}

export interface ListGenotypeObject {
  items: {attrs: GenotypeAttributes}[];
}

export interface CreateOrUpdateAttributes {
  opaqueId?: string;
  sampleId?: string;
  source?: string;
  gene?: string;
  variantCall?: string;
  zygosity?: string;
  startBase?: string;
  chromosomeName?: string;
  variantType?: string;
  quality?: string;
}

export const genotypeResolver = {
  async create(args: CreateOrUpdateAttributes): Promise<GenotypeAttributes> {
    let genotypeInstance: {attrs: GenotypeAttributes};

    try {
      genotypeInstance = await Genotype.getAsync(args.opaqueId, args.gene);
      if (genotypeInstance) {
        throw new Error('Record already exists.');
      }
      genotypeInstance = await Genotype.createAsync(args, {overwrite: false});
    } catch (error) {
      log.error(`genotypeResolver-create: ${error.message}`);
      return error;
    }

    return genotypeInstance.attrs;
  },

  async update(args: CreateOrUpdateAttributes): Promise<GenotypeAttributes> {
    let genotypeInstance: {attrs: GenotypeAttributes};

    try {
      genotypeInstance = await Genotype.getAsync(args.opaqueId, args.gene);
      if (!genotypeInstance) {
        throw new Error('No such record found');
      }

      genotypeInstance = await Genotype.updateAsync(args);
    } catch (error) {
      log.error(`genotypeResolver-update: ${error.message}`);
      return error;
    }

    return genotypeInstance.attrs;
  },

  async get(args: {opaqueId: string, gene: string}, authorizer: AuthorizerAttributes): Promise<GenotypeAttributes> {
    let genotypeInstance: {attrs: GenotypeAttributes};

    try {
      hasAuthorizedRoles(authorizer, ['ADMIN']);
      genotypeInstance = await Genotype.getAsync(args.opaqueId, args.gene);
      if (!genotypeInstance) {
        throw new Error('No such record found');
      }
    } catch (error) {
      log.error(`genotypeResolver-get: ${error.message}`);
      return error;
    }
    
    return genotypeInstance.attrs;
  },

  async list(args: ListGenotypeFilters): Promise<GenotypeAttributes[]> {
    const {opaqueId, genes} = args;
    const result: GenotypeAttributes[] = [];
    let genotypeList: ListGenotypeObject;
    
    try {
      let query: Query & {execAsync?: () => ListGenotypeObject};
      query = Genotype.query(opaqueId).filter('geneFilter').in(genes);
      genotypeList = await execAsync(query);
    } catch (error) {
      log.error(`genotypeResolver-list: ${error.message}`);
      return error;
    }

    genotypeList.items.forEach((report: {attrs: GenotypeAttributes}) => {
      result.push(report.attrs);
    });

    return result;
  },
};

// tslint:disable:no-any

/* istanbul ignore next */
export const queries = {
};

/* istanbul ignore next */
export const mutations = {
};
