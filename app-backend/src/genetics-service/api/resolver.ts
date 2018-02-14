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

export const geneticsResolver = {
    async create(args: IGeneticsAttributes): Promise<IGeneticsAttributes> {
        let geneticsInstance: {attrs: IGeneticsAttributes};

        try {
            geneticsInstance = await Genetics.getAsync(args.data_type_user_id);
            if (geneticsInstance) {
                throw new Error('Record already exists.');
            }

            geneticsInstance = await Genetics.createAsync({...args}, {overwrite: false});
        } catch (error) {
            console.log('geneticsResolver-create: ', error.message);
            return error.message;
        }

        return geneticsInstance.attrs;
    },

    async update(args: IGeneticsAttributes): Promise<IGeneticsAttributes> {
        let geneticsInstance: {attrs: IGeneticsAttributes};
        try {
            geneticsInstance = await Genetics.getAsync(args.data_type_user_id);
            if (!geneticsInstance) {
                throw new Error('No such record found');
            }

            geneticsInstance = await Genetics.updateAsync({...args});
        } catch (error) {
            console.log('geneticsResolver-update:', error.message);
            return error.message;
        }

        return geneticsInstance.attrs;
    },

    async get(args: {data_type_user_id: string}): Promise<IGeneticsAttributes> {
        let geneticsInstance: {attrs: IGeneticsAttributes};

        try {
            geneticsInstance = await Genetics.getAsync(args.data_type_user_id);
            if (!geneticsInstance) {
                throw new Error('No such record found');
            }
        } catch (error) {
            console.log('geneticsResolver-get:', error.message);
            return error.message;
        }

        return geneticsInstance.attrs;
    },

    async list(args: IListFilters = {}) {
        const {limit = 15, lastEvaluatedKey, createdAt, updatedAt} = args;
        let result;
        try {
            let scan: Scan & {execAsync?: () => void} = Genetics.scan().limit(limit);

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
            return error.message;
        }

        return result;
    }
};

export const queries = {
    geneticsList: (root: any, args: IListFilters) => geneticsResolver.list(args),
    getGeneticsData: (root: any, args: {data_type_user_id: string}) => geneticsResolver.get(args),
};

export const mutations = {
    createGenetics: (root: any, args: IGeneticsAttributes) => geneticsResolver.create(args),
    updateGenetics: (root: any, args: IGeneticsAttributes) => geneticsResolver.update(args),
};