/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../genetics-service/models/Genetics');

import {IGeneticsAttributes, Genetics} from '../../genetics-service/models/Genetics';
import {geneticsResolver, ICreateOrUpdateAttributes} from '../../genetics-service/api/resolver';

const unroll = require('unroll');
unroll.use(it);

type ExecSuccess = {Items: IGeneticsAttributes[]};

describe('Genetics resolver tests.', () => {
    const commonData: {gene: string, variant: string, source: string} = {
        gene: 'XXXXY',
        variant: 'demo2',
        source: 'helix2',
    };

    const dummyRequestData: ICreateOrUpdateAttributes = {...commonData, dataTypeUserId: 'PQR03'};
    const dummyResponseData: IGeneticsAttributes = {...commonData, data_type_user_id: 'PQR03'};

    Genetics.getAsync = jest.fn()
            .mockImplementationOnce(() => ({data_type_user_id: 'PQR03'}))
            .mockImplementationOnce(() => null)
            .mockImplementationOnce(() => ({data_type_user_id: 'PQR03'}))
            .mockImplementationOnce(() => null)
            .mockImplementationOnce((): {attrs: IGeneticsAttributes} => ({attrs: dummyResponseData}))
            .mockImplementationOnce(() => null);

    const mockedExecAsync: jest.Mock<ExecSuccess> = jest.fn((): {execAsync: jest.Mock<ExecSuccess>} => {
        return {
            execAsync: jest.fn((): ExecSuccess => ({Items: [dummyResponseData]}))
        };
    });

    Genetics.createAsync = Genetics.updateAsync = jest.fn()
            .mockImplementation((data: IGeneticsAttributes): {attrs: IGeneticsAttributes} => ({attrs: data}));

    const mockedLimit = jest.fn((limit: number) => ({
        execAsync: jest.fn((): ExecSuccess => ({Items: [dummyResponseData]})),
        startKey: mockedExecAsync,
    }));

    Genetics.query = jest.fn(() => {
        return {
            limit: mockedLimit,
            usingIndex: jest.fn(() => ({limit: mockedLimit}))
        };
    });

    describe('Create tests', () => {
        it('should throw an error when the record already exists.', async () => {
            let response = await geneticsResolver.create(dummyRequestData);
            expect(response[`message`]).toEqual('Record already exists.');
        });

        it('should create a new record when there is no error', async () => {
            let response = await geneticsResolver.create(dummyRequestData);
            expect(response).toEqual(dummyResponseData);
        });
    });

    describe('Update tests', () => {
        it('should update the record when there is no error.', async () => {
            let response = await geneticsResolver.update(dummyRequestData);
            expect(response).toEqual(dummyResponseData);
        });

        it('should throw an error when the data_type_user_id is invalid.', async () => {
            let response = await geneticsResolver
                    .update({dataTypeUserId: 'abcd', gene: 'XXXXX', source: 'helix', variant: 'qwerty'});
            expect(response[`message`]).toEqual('No such record found');
        });
    });

    describe('Get tests', () => {
        it('should fetch the record when there is no error.', async () => {
            let response = await geneticsResolver.get({dataTypeUserId: 'PQR03', gene: 'XXXX'});
            expect(response).toEqual(dummyResponseData);
        });

        it('should throw an error when the data_type_user_id is invalid.', async () => {
            let response = await geneticsResolver.get({dataTypeUserId: 'abcd', gene: 'XXXX'});
            expect(response[`message`]).toEqual('No such record found');
        });
    });

    describe('List test', () => {
        it('should return an error message if required parameters are not present.', async () => {
            let response = await geneticsResolver.list();
            expect(response[`message`]).toEqual('Required parameters not present.');
        });

        unroll('It should respond with the genetics data list when #params are present.', async (
                done: () => void,
                args: {params: {[key: string]: string | number}}
        ) => {
            let response = await geneticsResolver.list(args.params);
            expect(response).toEqual({Items: [dummyResponseData]});
            done();
        }, [ // tslint:disable-next-line
            ['params'],
            [{dataTypeUserId: 'ABC'}],
            [{gene: 'QWERTY'}],
            [{gene: 'QWERTY', lastEvaluatedKeys: {dataTypeUserId: 'XYZ', gene: 'QWERTY2'}}],
            [{gene: 'QWERTY', lastEvaluatedKeys: {dataTypeUserId: 'XYZ', gene: 'QWERTY2'}, limit: 10}],
        ]);
    });
});
