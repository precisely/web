/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Query} from 'dynogels';
import {Genetics, GeneticsAttributes} from '../models/Genetics';
import {hasAuthorizedRoles} from '../../utils';
import {AuthorizerAttributes} from '../../interfaces';

const toSnakeCase = require('lodash.snakecase');

interface ListFilters {
    limit?: number;
    lastEvaluatedKeys?: {
        opaqueId: string;
        gene: string;
    };
    opaqueId?: string;
    gene?: string;
}

interface ListObject {
    Items: GeneticsAttributes[];
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

export const geneticsResolver = {
    async create(args: CreateOrUpdateAttributes): Promise<GeneticsAttributes> {
        let geneticsInstance: {attrs: GeneticsAttributes};
        const dataForCreating: GeneticsAttributes = {};

        for (const key in args) {
            if (args[key]) {
                dataForCreating[toSnakeCase(key)] = args[key];
            }
        }

        try {
            geneticsInstance = await Genetics.getAsync(args.opaqueId, args.gene);
            if (geneticsInstance) {
                throw new Error('Record already exists.');
            }
            geneticsInstance = await Genetics.createAsync({...dataForCreating}, {overwrite: false});
        } catch (error) {
            console.log('geneticsResolver-create: ', error.message);
            return error;
        }

        return geneticsInstance.attrs;
    },

    async update(args: CreateOrUpdateAttributes): Promise<GeneticsAttributes> {
        let geneticsInstance: {attrs: GeneticsAttributes};
        const dataToUpdate: GeneticsAttributes = {};

        for (const key in args) {
            if (args[key]) {
                dataToUpdate[toSnakeCase(key)] = args[key];
            }
        }

        try {
            geneticsInstance = await Genetics.getAsync(args.opaqueId, args.gene);
            if (!geneticsInstance) {
                throw new Error('No such record found');
            }

            geneticsInstance = await Genetics.updateAsync({...dataToUpdate});
        } catch (error) {
            console.log('geneticsResolver-update:', error.message);
            return error;
        }

        return geneticsInstance.attrs;
    },

    async get(args: {opaqueId: string, gene: string}, authorizer: AuthorizerAttributes): Promise<GeneticsAttributes> {
        let geneticsInstance: {attrs: GeneticsAttributes};

        try {
            hasAuthorizedRoles(authorizer, ['ADMIN']);
            geneticsInstance = await Genetics.getAsync(args.opaqueId, args.gene);
            if (!geneticsInstance) {
                throw new Error('No such record found');
            }
        } catch (error) {
            console.log('geneticsResolver-get:', error.message);
            return error;
        }
        console.log('>>\n\n', geneticsInstance);
        return geneticsInstance.attrs;
    },

    async list(args: ListFilters = {}, authorizer: AuthorizerAttributes): Promise<ListObject> {
        const {limit = 15, lastEvaluatedKeys, opaqueId, gene} = args;
        let result: ListObject;

        try {
            hasAuthorizedRoles(authorizer, ['ADMIN']);
            let query: Query & {execAsync?: () => ListObject};

            if (opaqueId) {
                query = Genetics.query(opaqueId).limit(limit);
            } else if (gene) {
                query = Genetics.query(gene).usingIndex('GeneticsGlobalIndex').limit(limit);
            } else {
                throw new Error('Required parameters not present.');
            }

            if (lastEvaluatedKeys && lastEvaluatedKeys.opaqueId && lastEvaluatedKeys.gene) {
                query = query.startKey(lastEvaluatedKeys.opaqueId, lastEvaluatedKeys.gene);
            }

            result = await query.execAsync();
        } catch (error) {
            console.log('geneticsResolver-list:', error.message);
            return error;
        }

        return result;
    },
};

// tslint:disable:no-any

/* istanbul ignore next */
export const queries = {
    geneticsList: (root: any, args: ListFilters) => geneticsResolver.list(args, root.authorizer),
    getGeneticsData: (root: any, args: {opaqueId: string, gene: string}) => geneticsResolver.get(args, root.authorizer),
};

/* istanbul ignore next */
export const mutations = {
    createGenetics: (root: any, args: CreateOrUpdateAttributes) => geneticsResolver.create(args),
    updateGenetics: (root: any, args: CreateOrUpdateAttributes) => geneticsResolver.update(args),
};
