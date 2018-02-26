/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as Joi from 'joi';
import {AWS} from 'dynogels';
import {addEnvironmentToTableName} from '../../utils';

const dynogels = require('dynogels-promisified');

AWS.config.update({region: 'us-east-1'});

export interface IGeneticsAttributes {
    gene?: string;
    source?: string;
    variant?: string;
    quality?: string;
    data_type_user_id: string;
}

/* istanbul ignore next */
export const Genetics = dynogels.define(addEnvironmentToTableName('precisely-genetics', '01'), {
    hashKey : 'data_type_user_id',
    rangeKey: 'gene',

    timestamps : true,

    schema : {
        gene: Joi.string(),
        source: Joi.string(),
        variant: Joi.string(),
        quality: Joi.string().optional(),
        data_type_user_id: Joi.string()
    },

    indexes: [{
        hashKey: 'gene',
        rangeKey: 'data_type_user_id',
        name: 'GeneticsGlobalIndex',
        type: 'global',
    }],
});

/* istanbul ignore next */
dynogels.createTables((error: string): void => {
    if (error) {
        console.log('Error while creating the tables.', error);
    }
});
