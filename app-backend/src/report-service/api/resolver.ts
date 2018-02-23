/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Scan} from 'dynogels';
import {Report, IReportAttributes} from '../models/Report';
import {userDataMapResolver} from '../../user-data-map/api/resolver';
import {Genetics} from '../../genetics-service/models/Genetics';

export interface ICreateOrUpdateAttributes {
    title: string;
    slug: string;
    content: string;
    genes: string[];
}

interface IListFilters {
    limit?: number;
    lastEvaluatedKeys?: {
        slug: string;
        title: string;
    };
    createdAt?: string; // Should be the ISO date string
    updatedAt?: string; // Should be the ISO date string
}

interface IListObject {
    Items: IReportAttributes[];
    LastEvaluatedKey: {
        slug: string;
        title: string;
    };
}

export const reportResolver = {
    async create(args: ICreateOrUpdateAttributes): Promise<IReportAttributes> {
        let reportInstance: {attrs: IReportAttributes};
        const {slug, title, genes, content} = args;

        try {
            reportInstance = await Report.createAsync({slug, title, genes, raw_content: content});
        } catch (error) {
            console.log('reportResolver-create: ', error.message);
            return error;
        }
        
        return reportInstance.attrs;
    },

    async list(args: IListFilters = {}): Promise<IListObject> {
        const {limit = 15, lastEvaluatedKeys, createdAt, updatedAt} = args;
        let result: IListObject;
        try {
            let scan: Scan & {execAsync?: () => IListObject} = Report.scan().limit(limit);

            if (lastEvaluatedKeys && lastEvaluatedKeys.slug && lastEvaluatedKeys.title) {
                scan = scan.startKey(lastEvaluatedKeys.slug && lastEvaluatedKeys.title);
            }

            if (createdAt) {
                scan = scan.where('createdAt').gte(createdAt);
            }

            if (updatedAt) {
                scan = scan.where('updatedAt').gte(updatedAt);
            }

            result = await scan.execAsync();
        } catch (error) {
            console.log('reportResolver-list:', error.message);
            return error;
        }

        return result;
    },

    async get(args: {slug: string, id: string, userId: string}): Promise<IReportAttributes> {
        let reportInstance: {attrs: IReportAttributes};

        try {
            reportInstance = await Report.getAsync(args.slug, args.id);
            if (!reportInstance) {
                throw new Error('No such record found');
            }
            let userInstance = await userDataMapResolver.getByUserId({userId: args.userId});
            let result = await Genetics.query(userInstance.opaque_id).execAsync();
            
            reportInstance.attrs[`genetics`] = result;
        } catch (error) {
            console.log('reportResolver-get:', error.message);
            return error;
        }
        
        return reportInstance.attrs;
    },
};

// tslint:disable:no-any

/* istanbul ignore next */
export const queries = {
    listReports: (root: any, args: IListFilters) => reportResolver.list(args),
    getReport: (root: any, args: {slug: string, id: string, userId: string}) => reportResolver.get(args),
};

/* istanbul ignore next */
export const mutations = {
    saveReport: (root: any, args: ICreateOrUpdateAttributes) => reportResolver.create(args),
};
