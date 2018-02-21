/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Scan} from 'dynogels';
import {Genetics, IGeneticsAttributes} from '../models/Genetics';

interface IListFilters {
    limit?: number;
    lastEvaluatedKeys?: {
        dataTypeUserId: string;
        gene: string;
    };
    createdAt?: string; // Should be the ISO date string
    updatedAt?: string; // Should be the ISO date string
}

interface IListObject {
    Items: IGeneticsAttributes[];
    LastEvaluatedKey: {
        data_type_user_id: string;
        gene: string;
    };
}

export interface ICreateOrUpdateAttributes {
    gene: string;
    source: string;
    variant: string;
    quality?: string;
    dataTypeUserId: string;
}

export const geneticsResolver = {
    async create(args: ICreateOrUpdateAttributes): Promise<IGeneticsAttributes> {
        let geneticsInstance: {attrs: IGeneticsAttributes};
        const dataForCreating: IGeneticsAttributes = {data_type_user_id: args.dataTypeUserId};

        for (const key in args) {
            if (key !== 'dataTypeUserId' && args[key]) {
                dataForCreating[key] = args[key];
            }
        }

        try {
            geneticsInstance = await Genetics.getAsync(args.dataTypeUserId, args.gene);
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
        const dataToUpdate: IGeneticsAttributes = {data_type_user_id: args.dataTypeUserId};

        for (const key in args) {
            if (key !== 'dataTypeUserId' && args[key]) {
                dataToUpdate[key] = args[key];
            }
        }

        try {
            geneticsInstance = await Genetics.getAsync(args.dataTypeUserId, args.gene);
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

    async get(args: {dataTypeUserId: string, gene: string}): Promise<IGeneticsAttributes> {
        let geneticsInstance: {attrs: IGeneticsAttributes};

        try {
            geneticsInstance = await Genetics.getAsync(args.dataTypeUserId, args.gene);
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
        const {limit = 15, lastEvaluatedKeys, createdAt, updatedAt} = args;
        let result: IListObject;
        try {
            let scan: Scan & {execAsync?: () => IListObject} = Genetics.scan().limit(limit);

            if (lastEvaluatedKeys && lastEvaluatedKeys.dataTypeUserId && lastEvaluatedKeys.gene) {
                scan = scan.startKey(lastEvaluatedKeys.dataTypeUserId, lastEvaluatedKeys.gene);
            }

            if (createdAt) {
                scan = scan.where('createdAt').gte(createdAt);
            }

            if (updatedAt) {
                scan = scan.where('updatedAt').gte(updatedAt);
            }

            result = await scan.execAsync();
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
    getGeneticsData: (root: any, args: {dataTypeUserId: string, gene: string}) => geneticsResolver.get(args),
};

/* istanbul ignore next */
export const mutations = {
    createGenetics: (root: any, args: ICreateOrUpdateAttributes) => geneticsResolver.create(args),
    updateGenetics: (root: any, args: ICreateOrUpdateAttributes) => geneticsResolver.update(args),
};
