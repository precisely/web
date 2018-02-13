/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Genetics, IGeneticsAttributes} from '../models/Genetics';

const geneticsResolver = {
    async create(args: {gene: string, source: string, variant: string, quality: string, data_type_user_id: string}) {
        const {gene, source, variant, quality, data_type_user_id} = args;
        let geneticsInstance: {attrs: IGeneticsAttributes};

        try {
            geneticsInstance = await Genetics.getAsync(data_type_user_id);
            if (geneticsInstance) {
                throw new Error('Record already exists.');
            }

            geneticsInstance = await Genetics.createAsync(
                    {gene, source, variant, quality, data_type_user_id},
                    {overwrite: false}
            );
        } catch (error) {
            console.log('geneticsResolver-create: ', error.toString());

            return error;
        }

        return geneticsInstance.attrs;
    },
};

export const mutations = {
    createGenetics: (
            root: any,
            args: {gene: string, source: string, variant: string, quality: string, data_type_user_id: string}
    ) => geneticsResolver.create(args),
};