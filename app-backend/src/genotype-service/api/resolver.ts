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

const toSnakeCase = require('lodash.snakecase');

export interface ListGenotypeFilters {
  limit?: number;
  lastEvaluatedKeys?: {
    opaqueId: string;
    gene: string;
  };
  opaqueId?: string;
  gene?: string;
}

export interface ListGenotypeObject {
  Items: GenotypeAttributes[];
  LastEvaluatedKey: {
    opaque_id: string;
    gene: string;
  };
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
    const dataForCreating: GenotypeAttributes = {};

    for (const key in args) {
      if (args[key]) {
        dataForCreating[toSnakeCase(key)] = args[key];
      }
    }

    try {
      genotypeInstance = await Genotype.getAsync(args.opaqueId, args.gene);
      if (genotypeInstance) {
        throw new Error('Record already exists.');
      }
      genotypeInstance = await Genotype.createAsync({...dataForCreating}, {overwrite: false});
    } catch (error) {
      log.error(`genotypeResolver-create: ${error.message}`);
      return error;
    }

    return genotypeInstance.attrs;
  },

  async update(args: CreateOrUpdateAttributes): Promise<GenotypeAttributes> {
    let genotypeInstance: {attrs: GenotypeAttributes};
    const dataToUpdate: GenotypeAttributes = {};

    for (const key in args) {
      if (args[key]) {
        dataToUpdate[toSnakeCase(key)] = args[key];
      }
    }

    try {
      genotypeInstance = await Genotype.getAsync(args.opaqueId, args.gene);
      if (!genotypeInstance) {
        throw new Error('No such record found');
      }

      genotypeInstance = await Genotype.updateAsync({...dataToUpdate});
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

  async list(args: ListGenotypeFilters = {}, authorizer: AuthorizerAttributes): Promise<ListGenotypeObject> {
    const {limit = 15, lastEvaluatedKeys, opaqueId, gene} = args;
    let result: ListGenotypeObject;
    
    try {
      let query: Query & {execAsync?: () => ListGenotypeObject};

      if (opaqueId) {
        query = Genotype.query(opaqueId).limit(limit);
      } else if (gene) {
        query = Genotype.query(gene).usingIndex('GenotypeGlobalIndex').limit(limit);
      } else {
        throw new Error('Required parameters not present.');
      }

      if (lastEvaluatedKeys && lastEvaluatedKeys.opaqueId && lastEvaluatedKeys.gene) {
        query = query.startKey(lastEvaluatedKeys.opaqueId, lastEvaluatedKeys.gene);
      }

      result = await execAsync(query);
    } catch (error) {
      log.error(`genotypeResolver-list: ${error.message}`);
      return error;
    }

    return result;
  },
};

// tslint:disable:no-any

/* istanbul ignore next */
export const queries = {
  genotypeList: (root: any, args: ListGenotypeFilters) => genotypeResolver.list(args, root.authorizer),
  getGenotypeData: (root: any, args: {opaqueId: string, gene: string}) => genotypeResolver.get(args, root.authorizer),
};

/* istanbul ignore next */
export const mutations = {
  createGenotype: (root: any, args: CreateOrUpdateAttributes) => genotypeResolver.create(args),
  updateGenotype: (root: any, args: CreateOrUpdateAttributes) => genotypeResolver.update(args),
};
