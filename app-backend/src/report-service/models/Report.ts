/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import {AWS} from 'dynogels';

const dynogels = require('dynogels-promisified');

AWS.config.update({region: 'us-east-1'});

export interface IReportAttributes {
    id?: string;
    title: string;
    slug: string;
    raw_content: string;
    parsed_content: string;
    top_level: boolean;
    genes: string;
}

/* istanbul ignore next */
export const Report = dynogels.define('dev-01-dynamo-report', {
    hashKey: 'slug',
    rangeKey: 'title',

    timestamps : true,

    schema : {
        id: dynogels.types.uuid(),
        title: Joi.string(),
        slug: Joi.string().required(),
        raw_content: Joi.string(),
        parsed_content: Joi.string(),
        top_level: Joi.boolean(),
        genes: Joi.array().items(Joi.string()),
    }
});

/* istanbul ignore next */
dynogels.createTables((error: string): void => {
    if (error) {
        console.log('Error while creating the tables.', error);
    }
});