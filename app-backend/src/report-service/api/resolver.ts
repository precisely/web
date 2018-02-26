/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Query} from 'dynogels';
import {Report, IReportAttributes} from '../models/Report';
import {userDataMapResolver} from '../../user-data-map/api/resolver';
import {geneticsResolver} from '../../genetics-service/api/resolver';

export interface ICreateOrUpdateAttributes {
    title: string;
    slug: string;
    content: string;
    genes: string[];
}

interface IListFilters {
    limit?: number;
    geneticsLimit?: number;
    lastEvaluatedKeys?: {
        id: string;
        slug: string;
    };
    geneticsLastEvaluatedKeys?: {
        opaqueId: string;
        gene: string;
    };
    id?: string;
    slug?: string;
}

interface IListObject {
    Items: IReportAttributes[];
    LastEvaluatedKey: {
        slug: string;
        id: string;
    };
    LastEvaluatedReportKey: {
        slug: string;
        id: string;
    };
    LastEvaluatedGeneticsKey: {
        opaque_id: string;
        gene: string;
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
        const {limit = 15, lastEvaluatedKeys, slug, id} = args;
        let result: IListObject;
        try {
            let query: Query & {execAsync?: () => IListObject};

            if (id) {
                query = Report.query(id).limit(limit);
            } else if (slug) {
                query = Report.query(slug).usingIndex('ReportGlobalIndex').limit(limit);
            } else {
                throw new Error('Required parameters not present.');
            }

            if (lastEvaluatedKeys) {
                query = query.startKey(lastEvaluatedKeys.id, lastEvaluatedKeys.slug);
            }

            result = await query.execAsync();
        } catch (error) {
            console.log('reportResolver-list:', error.message);
            return error;
        }

        return result;
    },

    async get(args: IListFilters & {userId: string}): Promise<IListObject> {
        const {slug, id, limit, geneticsLimit, lastEvaluatedKeys, geneticsLastEvaluatedKeys, userId} = args;
        let reportInstance: IListObject;
        
        try {
            reportInstance = await reportResolver.list({slug, id, limit, lastEvaluatedKeys});

            let userInstance = await userDataMapResolver.getByUserId({userId});
            let result = await geneticsResolver.list({
                opaqueId: userInstance.opaque_id, 
                limit: geneticsLimit, 
                lastEvaluatedKeys: geneticsLastEvaluatedKeys
            });
            reportInstance[`genetics`] = result;
            reportInstance.LastEvaluatedGeneticsKey = result.LastEvaluatedKey;
        } catch (error) {
            console.log('reportResolver-get:', error.message);
            return error;
        }
        
        return reportInstance;
    },
};

// tslint:disable:no-any

/* istanbul ignore next */
export const queries = {
    reports: (root: any, args: IListFilters) => reportResolver.list(args),
    report: (root: any, args: IListFilters & {userId: string}) => reportResolver.get(args),
};

/* istanbul ignore next */
export const mutations = {
    // TODO: will be fixed with https://github.com/precisely/web/issues/90
    saveReport: (root: any, args: ICreateOrUpdateAttributes) => reportResolver.create(args),
};
