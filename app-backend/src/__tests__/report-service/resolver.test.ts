/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../report-service/models/Report');

import {IReportAttributes, Report} from '../../report-service/models/Report';
import {reportResolver, ICreateOrUpdateAttributes} from '../../report-service/api/resolver';

const unroll = require('unroll');
unroll.use(it);

describe('Report resolver tests.', (): void => {

    const commonData: {title: string, slug: string, genes: string[]} = {
        title: 'demo-title',
        slug: 'demo-slug',
        genes: ['demo', 'genes']
    };

    const dummyRequestData: ICreateOrUpdateAttributes = {...commonData, content: 'demo-content'};
    const dummyResponseData: IReportAttributes = {...commonData, raw_content: 'demo-content'};

    Report.createAsync = jest.fn()
            .mockImplementation((data: IReportAttributes): {attrs: IReportAttributes} => ({attrs: data}))
            .mockImplementationOnce(() => {throw new Error('createAsync mock error'); });

    describe('Create tests', (): void => {
        it('should throw an error when the record already exists.', async (): Promise<void> => {
            let response = await reportResolver.create(dummyRequestData);
            expect(response[`message`]).toEqual('createAsync mock error');
        });

        it('should create a new record when there is no error', async (): Promise<void> => {
            let response = await reportResolver.create(dummyRequestData);
            expect(response).toEqual(dummyResponseData);
        });
    });
});
