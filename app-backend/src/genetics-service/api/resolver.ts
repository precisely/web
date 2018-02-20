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
    lastEvaluatedKey?: string;
    createdAt?: string; // Should be the ISO date string
    updatedAt?: string; // Should be the ISO date string
}

interface IListObject {
    Items: IGeneticsAttributes[];
    LastEvaluatedKey: {
        data_type_user_id: string;
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
        const {dataTypeUserId, gene, quality, source, variant} = args;

        try {
            geneticsInstance = await Genetics.getAsync(dataTypeUserId);
            if (geneticsInstance) {
                throw new Error('Record already exists.');
            }

            geneticsInstance = await Genetics.createAsync(
                    {gene, quality, source, variant, data_type_user_id: dataTypeUserId}, {overwrite: false});
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
            geneticsInstance = await Genetics.getAsync(args.dataTypeUserId);
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

    async get(args: {dataTypeUserId: string}): Promise<IGeneticsAttributes> {
        let geneticsInstance: {attrs: IGeneticsAttributes};

        try {
            geneticsInstance = await Genetics.getAsync(args.dataTypeUserId);
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
        const {limit = 15, lastEvaluatedKey, createdAt, updatedAt} = args;
        let result: IListObject;
        try {
            let scan: Scan & {execAsync?: () => IListObject} = Genetics.scan().limit(limit);

            if (lastEvaluatedKey) {
                scan = scan.startKey(lastEvaluatedKey);
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
    getGeneticsData: (root: any, args: {dataTypeUserId: string}) => geneticsResolver.get(args),
};

/* istanbul ignore next */
export const mutations = {
    createGenetics: (root: any, args: ICreateOrUpdateAttributes) => geneticsResolver.create(args),
    updateGenetics: (root: any, args: ICreateOrUpdateAttributes) => geneticsResolver.update(args),
};