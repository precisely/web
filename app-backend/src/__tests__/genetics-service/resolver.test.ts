/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../genetics-service/models/Genetics');

import {IGeneticsAttributes, Genetics} from '../../genetics-service/models/Genetics';
import {geneticsResolver, queries, mutations} from '../../genetics-service/api/resolver';

const unroll = require('unroll');
unroll.use(it);

describe('Genetics resolver tests.', (): void => {
    let dummyData: IGeneticsAttributes = {
        gene: 'XXXXY',
        variant: 'demo2',
        source: 'helix2',
        data_type_user_id: 'PQR03',
    };

    /**
     * TODO Figure out a better approach for mocking this method.
     * Tried the following, but nothing seems to be working:
     * - jest's reset or clean mock methods.
     * - aws-sdk-mock
     * - dynalite
     */
    Genetics.getAsync = jest.fn()
            .mockImplementationOnce((): Promise<any> => {
                return new Promise((resolve): any => {
                    return resolve({data_type_user_id: 'PQR03'});
                });
            })
            .mockImplementationOnce((): Promise<any> => {
                return new Promise((resolve): any => {
                    return resolve(null);
                });
            })
            .mockImplementationOnce((): Promise<any> => {
                return new Promise((resolve): any => {
                    return resolve({data_type_user_id: 'PQR03'});
                });
            })
            .mockImplementationOnce((): Promise<any> => {
                return new Promise((resolve): any => {
                    return resolve(null);
                });
            })
            .mockImplementationOnce((): Promise<any> => {
                return new Promise((resolve): any => {
                    return resolve({attrs: dummyData});
                });
            })
            .mockImplementationOnce((): Promise<any> => {
                return new Promise((resolve): any => {
                    return resolve(null);
                });
    });

    Genetics.createAsync = jest.fn()
            .mockImplementation((data: IGeneticsAttributes): Promise<any> => {
                return new Promise((resolve, reject): any => {
                    return resolve({attrs: data});
                });
            });

    Genetics.updateAsync = jest.fn()
            .mockImplementation((data: IGeneticsAttributes): Promise<any> => {
                return new Promise((resolve, reject): any => {
                    return resolve({attrs: data});
                });
            });

    const errorExecAsync: jest.Mock<void> = jest.fn((): Promise<void> => {
        return new Promise((): void => {
            throw new Error('An error occured.');
        });
    });

    const successExecAsync: jest.Mock<void> = jest.fn(() => {
        return {
            execAsync: jest.fn(() => {
                return new Promise((resolve) => {
                    resolve({Items: [dummyData]});
                });
            })
        };
    });

    Genetics.scan = jest.fn(() => {
        return {
            limit: jest.fn((limit: number) => {
                return {
                    execAsync: errorExecAsync,
                    startKey: successExecAsync,
                    where: jest.fn(() => {
                        return {
                            gte: successExecAsync,
                        };
                    }),
                };
            }),
        };
    });

    describe('Create tests', (): void => {
        it('should throw an error when the record already exists.', async (): Promise<void> => {
            let response = await geneticsResolver.create(dummyData);
            expect(response).toEqual('Record already exists.');
        });

        it('should create a new record when there is no error', async (): Promise<void> => {
            let response = await geneticsResolver.create(dummyData);
            expect(response).toEqual(dummyData);
        });
    });

    describe('Update tests', (): void => {
        it('should update the record when there is no error.', async (): Promise<void> => {
            let response = await geneticsResolver.update(dummyData);
            expect(response).toEqual(dummyData);
        });

        it('should throw an error when the data_type_user_id is invalid.', async (): Promise<void> => {
            let response = await geneticsResolver.update(dummyData);
            expect(response).toEqual('No such record found');
        });
    });

    describe('Get tests', (): void => {
        it('should fetch the record when there is no error.', async (): Promise<void> => {
            let response = await geneticsResolver.get({data_type_user_id: 'PQR03'});
            expect(response).toEqual(dummyData);
        });

        it('should throw an error when the data_type_user_id is invalid.', async (): Promise<void> => {
            let response = await geneticsResolver.get({data_type_user_id: 'PQR03'});
            expect(response).toEqual('No such record found');
        });
    });

    describe('List test', (): void => {
        it('should return an error message if an error occurs.', async (): Promise<void> => {
            let response = await geneticsResolver.list();
            expect(response).toEqual('An error occured.');
        });

        unroll('It should respond with the genetics data list when #paramName is present.', async (
                done: () => void,
                args: {paramName: string, paramValue: string}
        ): Promise<void> => {
            let response = await geneticsResolver.list({[args.paramName]: args.paramValue});
            expect(response).toEqual({Items: [dummyData]});
            done();
        }, [ // tslint:disable-next-line
            ['paramName', 'paramValue'],
            ['lastEvaluatedKey', 'PQR01'],
            ['updatedAt', '2017-12-01T18:30:00.000Z'],
            ['createdAt', '2018-12-01T18:30:00.000Z'],
        ]);
    });

    describe('Tests for the queries.', (): void => {
        unroll('It should call the #resolverName when #queryName is called.', (
                done: () => void,
                args: {queryName: string, resolverName: string, params: any}
        ): void => {
            geneticsResolver[args.resolverName] = jest.fn();
            queries[args.queryName]({}, args.params);
            expect(geneticsResolver[args.resolverName]).toBeCalledWith(args.params);
            done();
        }, [ // tslint:disable-next-line
            ['queryName', 'resolverName', 'params'],
            ['geneticsList', 'list', {limit: 10}],
            ['getGeneticsData', 'get', {data_type_user_id: 'PQR'}],
        ]);
    });

    describe('Tests for the mutations.', (): void => {
        unroll('It should call the #resolverName when #mutationName is called.', (
                done: () => void,
                args: {mutationName: string, resolverName: string, params: any}
        ): void => {
            geneticsResolver[args.resolverName] = jest.fn();
            mutations[args.mutationName]({}, args.params);
            expect(geneticsResolver[args.resolverName]).toBeCalledWith(args.params);
            done();
        }, [ // tslint:disable-next-line
            ['mutationName', 'resolverName', 'params'],
            ['createGenetics', 'create', dummyData],
            ['updateGenetics', 'update', dummyData],
        ]);
    });
});
