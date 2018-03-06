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

AWS.config.update({region: process.env.REGION});

export interface GenotypeAttributes {
    opaque_id?: string;
    sample_id?: string;
    source?: string;
    gene?: string;
    variant_call?: string;
    zygosity?: string;
    start_base?: string;
    chromosome_name?: string;
    variant_type?: string;
    quality?: string;
    created_at?: string;
    updated_at?: string;
}

/* istanbul ignore next */
export const Genotype = dynogels.define(addEnvironmentToTableName('precisely-genotype', '01'), {
    hashKey : 'opaque_id',
    rangeKey: 'gene',

    timestamps : true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    schema : {
        opaque_id: Joi.string(),
        sample_id: Joi.string(),
        source: Joi.string(),
        gene: Joi.string(),
        variant_call: Joi.string(),
        zygosity: Joi.string(),
        start_base: Joi.string(),
        chromosome_name: Joi.string(),
        variant_type: Joi.string(),
        quality: Joi.string(),
    },

    indexes: [{
        hashKey: 'gene',
        rangeKey: 'opaque_id',
        name: 'GenotypeGlobalIndex',
        type: 'global',
    }],
});
