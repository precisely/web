/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../report-service/models/Report');

import {ReportAttributes, Report} from '../../report-service/models/Report';
import {reportResolver, CreateOrUpdateAttributes} from '../../report-service/api/resolver';
import {userDataMapResolver} from '../../user-data-map/api/resolver';
import {genotypeResolver} from '../../genotype-service/api/resolver';

const unroll = require('unroll');
unroll.use(it);

type ExecSuccess = {Items: ReportAttributes[]};

describe('Report resolver tests.', () => {

    const authorizer = jest.fn();

    const commonData: {title: string, slug: string, genes: string[]} = {
        title: 'demo-title',
        slug: 'demo-slug',
        genes: ['demo', 'genes']
    };

    const dummyRequestData: CreateOrUpdateAttributes = {...commonData, rawContent: 'demo-content'};
    const dummyResponseData: ReportAttributes = {...commonData, raw_content: 'demo-content'};

    Report.createAsync = jest.fn()
            .mockImplementation((data: ReportAttributes): {attrs: ReportAttributes} => ({attrs: data}))
            .mockImplementationOnce(() => {throw new Error('createAsync mock error'); });

    const mockedExecAsync: jest.Mock<ExecSuccess> = jest.fn((): {execAsync: jest.Mock<ExecSuccess>} => {
        return {
            execAsync: jest.fn((): ExecSuccess => ({Items: [dummyResponseData]}))
        };
    });

    const mockedLimit = jest.fn((limit: number) => ({
        execAsync: jest.fn((): ExecSuccess => ({Items: [dummyResponseData]})),
        startKey: mockedExecAsync,
    }));

    genotypeResolver.list = jest.fn();
    
    Report.query = jest.fn(() => {
        return {
            limit: mockedLimit,
            usingIndex: jest.fn(() => ({limit: mockedLimit}))
        };
    })
    .mockImplementationOnce(() => {throw new Error('query mock error'); });

    userDataMapResolver.get = jest.fn()
            .mockImplementation((data: ReportAttributes): {attrs: ReportAttributes} => ({attrs: data}))
            .mockImplementationOnce(() => {throw new Error('userDataMapResolver mock error'); });

    describe('Create tests', () => {
        it('should throw an error when the record already exists.', async () => {
            let response = await reportResolver.create(dummyRequestData, authorizer);
            expect(response[`message`]).toEqual('createAsync mock error');
        });

        it('should create a new record when there is no error', async () => {
            let response = await reportResolver.create(dummyRequestData, authorizer);
            expect(response).toEqual(dummyResponseData);
        });
    });

    describe('List test', () => {

        it('should fail if an error occurs', async () => {
            let response = await reportResolver.list({}, authorizer);
            expect(response[`message`]).toEqual('query mock error');
        });
    
        unroll('it should respond with the report data list when #params are present.', async (
                done: () => void,
                args: {params: {[key: string]: string | number}}
        ) => {
            let response = await reportResolver.list(args.params, authorizer);
            expect(response).toEqual({Items: [dummyResponseData]});
            done();
        }, [ // tslint:disable-next-line
            ['params'],
            [{slug: 'test', limit: 10}],
            [{slug: 'QWERTY2', lastEvaluatedKeys: {slug: 'test', id: 'test'}}],
        ]);
    });

    describe('Get tests', () => {
        it('should throw an error when the if user is not found.', async () => {
            let response = await reportResolver.get({}, authorizer);
            expect(response[`message`]).toEqual('userDataMapResolver mock error');
        });

        it('should return an error message if required parameters are not present.', async () => {
            let response = await reportResolver.get({}, authorizer);
            expect(response[`message`]).toEqual('Required parameters not present.');
        });

        unroll('it should respond with the report data list when #params are present.', async (
                done: () => void,
                args: {params: {[key: string]: string | number}}
        ) => {
            let response = await reportResolver.get(args.params, authorizer);
            response[`userData`]({});
            expect(genotypeResolver.list).toBeCalled();
            expect(response[`Items`]).toEqual([dummyResponseData]);
            expect(typeof response[`userData`]).toEqual('function');
            done();
        }, [ // tslint:disable-next-line
            ['params'],
            [{id: 'test'}],
            [{slug: 'test'}],
            [{slug: 'test', lastEvaluatedKeys: {slug: 'test', id: 'test'}}],
        ]);
    });

});
