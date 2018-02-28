/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Query} from 'dynogels';
import {Report, ReportAttributes} from '../models/Report';
import {userDataMapResolver} from '../../user-data-map/api/resolver';
import {UserDataMapAttributes} from '../../user-data-map/models/UserDataMap';
import {geneticsResolver, ListGeneticsFilters} from '../../genetics-service/api/resolver';

export interface CreateOrUpdateAttributes {
    title: string;
    slug: string;
    content: string;
    genes: string[];
}

export interface ListReportFilters {
    limit?: number;
    lastEvaluatedKeys?: {
        id: string;
        slug: string;
    };
    id?: string;
    slug?: string;
    userId?: string;
    vendorDataType?: string;
}

export interface ListReportObject {
    Items: ReportAttributes[];
    LastEvaluatedKey: {
        slug: string;
        id: string;
    };
}

export const reportResolver = {
    async create(args: CreateOrUpdateAttributes): Promise<ReportAttributes> {
        let reportInstance: {attrs: ReportAttributes};
        const {slug, title, genes, content} = args;

        try {
            reportInstance = await Report.createAsync({slug, title, genes, raw_content: content});
        } catch (error) {
            console.log('reportResolver-create: ', error.message);
            return error;
        }
        
        return reportInstance.attrs;
    },

    async list(args: ListReportFilters): Promise<ListReportObject> {
        const {limit = 15, lastEvaluatedKeys, slug} = args;
        let result: ListReportObject;
        try {
            let query: Query & {execAsync?: () => ListReportObject};

            query = Report.query(slug).usingIndex('ReportGlobalIndex').limit(limit);

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

    async get(args: ListReportFilters): Promise<{}> {
            
        const {slug, id, userId, vendorDataType, limit, lastEvaluatedKeys} = args;
        let reportInstance: ListReportObject;
        let userInstance: UserDataMapAttributes;

        try {
            userInstance = await userDataMapResolver.get({user_id: userId, vendor_data_type: vendorDataType});
            let query: Query & {execAsync?: () => ListReportObject};

            if (id) {
                query = Report.query(id).limit(limit);
            } else if (slug) {
                query = Report.query(slug).usingIndex('ReportGlobalIndex').limit(limit);
            } else {
                throw new Error('Required parameters not present.');
            }

            if (lastEvaluatedKeys) {
                query = query.startKey(lastEvaluatedKeys.slug, lastEvaluatedKeys.id);
            }

            reportInstance = await query.execAsync();
        } catch (error) {
            console.log('reportResolver-get:', error.message);
            return error;
        }
        
        return {
            ...reportInstance,
            userData: (geneticArgs: ListGeneticsFilters) => geneticsResolver.list({
                opaqueId: userInstance.opaque_id,
                ...geneticArgs
            }),
        };
    },
};

// tslint:disable:no-any

/* istanbul ignore next */
export const queries = {
    reports: (root: any, args: ListReportFilters) => reportResolver.list(args),
    report: (root: any, args: ListReportFilters) => reportResolver.get(args),
};

/* istanbul ignore next */
export const mutations = {
    // TODO: will be fixed with https://github.com/precisely/web/issues/90
    saveReport: (root: any, args: CreateOrUpdateAttributes) => reportResolver.create(args),
};
