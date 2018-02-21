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

describe('Genetics resolver tests.', (): void => {
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

    Genetics.createAsync = Genetics.updateAsync = jest.fn()
            .mockImplementation((data: IGeneticsAttributes): {attrs: IGeneticsAttributes} => ({attrs: data}));

    const errorExecAsync: jest.Mock<Promise<void>> = jest.fn((): void => { throw new Error('An error occured.'); });

    const successExecAsync: jest.Mock<ExecSuccess> = jest.fn((): {execAsync: jest.Mock<ExecSuccess>} => {
        return {
            execAsync: jest.fn((): ExecSuccess => ({Items: [dummyResponseData]}))
        };
    });

    Genetics.scan = jest.fn(() => {
        return {
            limit: jest.fn((limit: number) => {
                return {
                    execAsync: errorExecAsync,
                    startKey: successExecAsync,
                    where: jest.fn(() => ({gte: successExecAsync})),
                };
            }),
        };
    });

    describe('Create tests', (): void => {
        it('should throw an error when the record already exists.', async (): Promise<void> => {
            let response = await geneticsResolver.create(dummyRequestData);
            expect(response[`message`]).toEqual('Record already exists.');
        });

        it('should create a new record when there is no error', async (): Promise<void> => {
            let response = await geneticsResolver.create(dummyRequestData);
            expect(response).toEqual(dummyResponseData);
        });
    });

    describe('Update tests', (): void => {
        it('should update the record when there is no error.', async (): Promise<void> => {
            let response = await geneticsResolver.update(dummyRequestData);
            expect(response).toEqual(dummyResponseData);
        });

        it('should throw an error when the data_type_user_id is invalid.', async (): Promise<void> => {
            let response = await geneticsResolver
                    .update({dataTypeUserId: 'abcd', gene: 'XXXXX', source: 'helix', variant: 'qwerty'});
            expect(response[`message`]).toEqual('No such record found');
        });
    });

    describe('Get tests', (): void => {
        it('should fetch the record when there is no error.', async (): Promise<void> => {
            let response = await geneticsResolver.get({dataTypeUserId: 'PQR03', gene: 'XXXX'});
            expect(response).toEqual(dummyResponseData);
        });

        it('should throw an error when the data_type_user_id is invalid.', async (): Promise<void> => {
            let response = await geneticsResolver.get({dataTypeUserId: 'abcd', gene: 'XXXX'});
            expect(response[`message`]).toEqual('No such record found');
        });
    });

    describe('List test', (): void => {
        it('should return an error message if an error occurs.', async (): Promise<void> => {
            let response = await geneticsResolver.list();
            expect(response[`message`]).toEqual('An error occured.');
        });

        unroll('It should respond with the genetics data list when #paramName is present.', async (
                done: () => void,
                args: {paramName: string, paramValue: string}
        ): Promise<void> => {
            let response = await geneticsResolver.list({[args.paramName]: args.paramValue});
            expect(response).toEqual({Items: [dummyResponseData]});
            done();
        }, [ // tslint:disable-next-line
            ['paramName', 'paramValue'],
            ['lastEvaluatedKeys', {dataTypeUserId: 'PQR01', gene: 'XXXXY'}],
            ['updatedAt', '2017-12-01T18:30:00.000Z'],
            ['createdAt', '2018-12-01T18:30:00.000Z'],
        ]);
    });
});
