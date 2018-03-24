/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Query, ExecResult, Item} from 'dynogels-promisified';
import {Genotype, GenotypeAttributes} from 'src/genotype-service/models/Genotype';
import {hasAuthorizedRoles} from 'src/utils';
import {AuthorizerAttributes} from 'src/interfaces';
import {log} from 'src/logger';

export interface ListGenotypeFilters {
  opaqueId: string;
  genes: string[];
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
    let genotypeInstance: Item<GenotypeAttributes>;

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

    return genotypeInstance.get();
  },

  async update(args: CreateOrUpdateAttributes): Promise<GenotypeAttributes> {
    let genotypeInstance: Item<GenotypeAttributes>;

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

    return genotypeInstance.get();
  },

  async get(args: {opaqueId: string, gene: string}, authorizer: AuthorizerAttributes): Promise<GenotypeAttributes> {
    let genotypeInstance: Item<GenotypeAttributes>;

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

    return genotypeInstance.get();
  },

  async list(args: ListGenotypeFilters): Promise<GenotypeAttributes[]> {
    const {opaqueId, genes} = args;
    const result: GenotypeAttributes[] = [];
    let genotypeList: ExecResult<GenotypeAttributes>;

    try {
      let query: Query<GenotypeAttributes>;
      query = Genotype.query(opaqueId).filter('geneFilter').in(genes);
      genotypeList = await query.execAsync();
    } catch (error) {
      log.error(`genotypeResolver-list: ${error.message}`);
      return error;
    }

    genotypeList.Items.forEach((genotype: Item<GenotypeAttributes>) => {
      result.push(genotype.get());
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
