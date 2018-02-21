/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Report, IReportAttributes} from '../models/Report';

interface ICreateOrUpdateAttributes {
    title: string;
    slug: string;
    content: string;
    genes: string[];
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
};

// tslint:disable:no-any

/* istanbul ignore next */
export const queries = {
};

/* istanbul ignore next */
export const mutations = {
    saveReport: (root: any, args: ICreateOrUpdateAttributes) => reportResolver.create(args),
};