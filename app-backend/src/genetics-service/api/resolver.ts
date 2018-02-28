/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Query} from 'dynogels';
import {Genetics, IGeneticsAttributes} from '../models/Genetics';

const toSnakeCase = require('lodash.snakecase');

interface IListFilters {
    limit?: number;
    lastEvaluatedKeys?: {
        opaqueId: string;
        gene: string;
    };
    opaqueId?: string;
    gene?: string;
}

interface IListObject {
    Items: IGeneticsAttributes[];
    LastEvaluatedKey: {
        opaque_id: string;
        gene: string;
    };
}

export interface ICreateOrUpdateAttributes {
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
    async create(args: ICreateOrUpdateAttributes): Promise<IGeneticsAttributes> {
        let geneticsInstance: {attrs: IGeneticsAttributes};
        const dataForCreating: IGeneticsAttributes = {};

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

    async update(args: ICreateOrUpdateAttributes): Promise<IGeneticsAttributes> {
        let geneticsInstance: {attrs: IGeneticsAttributes};
        const dataToUpdate: IGeneticsAttributes = {};

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

    async get(args: {opaqueId: string, gene: string}): Promise<IGeneticsAttributes> {
        let geneticsInstance: {attrs: IGeneticsAttributes};

        try {
            geneticsInstance = await Genetics.getAsync(args.opaqueId, args.gene);
            if (!geneticsInstance) {
                throw new Error('No such record found');
            }
        } catch (error) {
            console.log('geneticsResolver-get:', error.message);
            return error;
        }

        return geneticsInstance.attrs;
    },

    async list(args: IListFilters = {}): Promise<IListObject> {
        const {limit = 15, lastEvaluatedKeys, opaqueId, gene} = args;
        let result: IListObject;

        try {
            let query: Query & {execAsync?: () => IListObject};

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
    geneticsList: (root: any, args: IListFilters) => geneticsResolver.list(args),
    getGeneticsData: (root: any, args: {opaqueId: string, gene: string}) => geneticsResolver.get(args),
};

/* istanbul ignore next */
export const mutations = {
    createGenetics: (root: any, args: ICreateOrUpdateAttributes) => geneticsResolver.create(args),
    updateGenetics: (root: any, args: ICreateOrUpdateAttributes) => geneticsResolver.update(args),
};
