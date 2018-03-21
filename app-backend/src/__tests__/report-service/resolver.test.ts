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
import {genotypeResolver} from '../../genotype-service/api/resolver';
import {execAsync} from '../../utils';

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
  const dummyResponseData: ReportAttributes = {...commonData, rawContent: 'demo-content'};

  Report.createAsync = jest.fn()
      .mockImplementation((data: ReportAttributes): {attrs: ReportAttributes} => ({attrs: data}))
      .mockImplementationOnce(() => {throw new Error('createAsync mock error'); });

  Report.getAsync = jest.fn()
      .mockImplementation((report, slug): {attrs: ReportAttributes} => (slug && {attrs: dummyResponseData}))
      .mockImplementationOnce(() => {throw new Error('getAsync mock error'); });

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

    execAsync = jest.fn()
      .mockImplementation(() => {
        return new Promise((resolve, reject) => {
          resolve({items: [{attrs: {...commonData, rawContent: 'demo-content'}}]});
        });
      });

    it('should fail if an error occurs', async () => {
      let response = await reportResolver.list({});
      expect(response[`message`]).toEqual('query mock error');
    });

    unroll('it should respond with the report data list when #params are present.', async (
        done: () => void,
        args: {params: {[key: string]: string | number}}
    ) => {
      let response = await reportResolver.list(args.params);
      expect(response).toEqual([dummyResponseData]);
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
      expect(response[`message`]).toEqual('getAsync mock error');
    });

    it('should return an error message if required parameters are not present.', async () => {
      let response = await reportResolver.get({}, authorizer);
      expect(response[`message`]).toEqual('No such record found');
    });

    it('should return data successfully when no error occurs', async () => {
      let response = await reportResolver.get({slug: 'test'}, {claims: {sub: 'demo-id'}});
      let userData = response.userData({vendorDataType: 'demo'});

      expect(userData.genotypes).toBeInstanceOf(Promise);
      expect(response[`userData`]).toBeInstanceOf(Function);
      expect(response).toHaveProperty('title', 'demo-title');
      expect(response).toHaveProperty('slug', 'demo-slug');
      expect(response).toHaveProperty('genes', [ 'demo', 'genes' ]);
    });
  });

});
