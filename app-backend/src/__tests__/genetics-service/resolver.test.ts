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
    const commonData: {gene: string, source: string, quality: string} = {
        gene: 'QWERTY2',
        source: 'helix',
        quality: 'demo',
    };

    const dummyRequestData: ICreateOrUpdateAttributes = {...commonData, opaqueId: 'PQR03'};
    const dummyResponseData: IGeneticsAttributes = {...commonData, opaque_id: 'PQR03'};

    Genetics.getAsync = jest.fn()
            .mockImplementationOnce(() => ({opaque_id: 'PQR03'}))
            .mockImplementationOnce(() => null)
            .mockImplementationOnce(() => ({opaque_id: 'PQR03'}))
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

        it('should throw an error when the opaque_id is invalid.', async () => {
            let response = await geneticsResolver
                    .update({opaqueId: 'abcd', gene: 'XXXXX', source: 'helix'});
            expect(response[`message`]).toEqual('No such record found');
        });
    });

    describe('Get tests', () => {
        it('should fetch the record when there is no error.', async () => {
            let response = await geneticsResolver.get({opaqueId: 'PQR03', gene: 'QWERTY2'});
            expect(response).toEqual(dummyResponseData);
        });

        it('should throw an error when the opaque_id is invalid.', async () => {
            let response = await geneticsResolver.get({opaqueId: 'abcd', gene: 'XXXX'});
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
            [{opaqueId: 'PQR03'}],
            [{gene: 'QWERTY2'}],
            [{gene: 'QWERTY2', lastEvaluatedKeys: {opaqueId: 'PQR03', gene: 'QWERTY2'}}],
            [{gene: 'QWERTY2', lastEvaluatedKeys: {opaqueId: 'PQR03', gene: 'QWERTY2'}, limit: 10}],
        ]);
    });
});
