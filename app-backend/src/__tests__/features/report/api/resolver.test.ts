/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('src/features/report/models/Report');

import {ReportAttributes, Report} from '../../../../features/report/models/Report';
import {reportResolver, CreateArgs} from '../../../../features/report/api/resolver';

const unroll = require('unroll');
unroll.use(it);

describe('Report resolver tests.', function() {

  const authorizer = jest.fn();

  const commonData: {title: string, slug: string, genes: string[]} = {
    title: 'demo-title',
    slug: 'demo-slug',
    genes: ['demo', 'genes']
  };

  const dummyRequestData: CreateArgs = {...commonData, rawContent: 'demo-content'};
  const dummyResponseData: ReportAttributes = {...commonData, rawContent: 'demo-content'};

  Report.createAsync = jest.fn()
      .mockImplementation(function(data: ReportAttributes) {
        return {get: (): ReportAttributes => data};
      })
      .mockImplementationOnce(function() {throw new Error('createAsync mock error'); });

  Report.getAsync = jest.fn()
      .mockImplementation((report, slug) => (slug && {get: (): ReportAttributes => dummyResponseData}))
      .mockImplementationOnce(function() {throw new Error('getAsync mock error'); });

  genotypeResolver.list = jest.fn();

  Report.query = jest.fn()
    .mockImplementationOnce(function() {throw new Error('query mock error'); })
    .mockImplementation(function() {
      return {
        execAsync: jest.fn(function() {
          return {Items: [{get: function() {return {...commonData, rawContent: 'demo-content'}; }}]};
        })
      };
    });

  describe('Create tests', function() {
    it('should throw an error when the record already exists.', async function() {
      let response = await reportResolver.create(dummyRequestData, authorizer);
      expect(response[`message`]).toEqual('createAsync mock error');
    });

    it('should create a new record when there is no error', async function() {
      let response = await reportResolver.create(dummyRequestData, authorizer);
      expect(response).toEqual(dummyResponseData);
    });
  });

  describe('List test', function() {

    it('should fail if an error occurs', async function() {
      let response = await reportResolver.list({});
      expect(response[`message`]).toEqual('query mock error');
    });

    unroll('it should respond with the report data list when #params are present.', async function(
        done: () => void,
        args: {params: {[key: string]: string | number}}
    ) {
      let response = await reportResolver.list(args.params);
      expect(response).toEqual([dummyResponseData]);
      done();
    }, [ // tslint:disable-next-line
      ['params'],
      [{slug: 'test'}],
      [{slug: 'QWERTY2'}],
    ]);
  });

  describe('Get tests', function() {
    it('should throw an error when the if user is not found.', async function() {
      let response = await reportResolver.get({}, authorizer);
      expect(response[`message`]).toEqual('getAsync mock error');
    });

    it('should return an error message if required parameters are not present.', async function() {
      let response = await reportResolver.get({}, authorizer);
      expect(response[`message`]).toEqual('No such record found');
    });

    it('should return data successfully when no error occurs', async function() {
      let response = await reportResolver.get({slug: 'test'}, {claims: {sub: 'demo-id'}});
      let userData = response.userData();

      expect(userData.genotypes).toBeInstanceOf(Promise);
      expect(response[`userData`]).toBeInstanceOf(Function);
      expect(response).toHaveProperty('title', 'demo-title');
      expect(response).toHaveProperty('slug', 'demo-slug');
      expect(response).toHaveProperty('genes', [ 'demo', 'genes' ]);
    });
  });

});
