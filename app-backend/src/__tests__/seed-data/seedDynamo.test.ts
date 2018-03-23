/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('fs');

import * as fs from 'fs';
import {seedReport, seedGenotype} from '../../seed-data/scripts/seedDynamo';
import {log} from '../../logger';
import {Report} from '../../report-service/models/Report';
import {Genotype} from '../../genotype-service/models/Genotype';

const unroll = require('unroll');
unroll.use(it);

describe('seedDynamo tests', () => {

  const dummyReport = {
    id: 'dummy-id',
    title: 'dummy-title',
    slug: 'dummy-slug',
    raw_content: 'dummy-raw_content',
    parsed_content: 'dummy-parsed_content',
    top_level: false,
    genes: ['dummy-genes']
  };

  const dummyGenotype = {
    opaque_id: 'dummy-opaque_id',
    sample_id: 'dummy-sample_id',
    source: 'dummy-source',
    gene: 'dummy-gene',
    variant_call: 'dummy-variant_call',
    zygosity: 'dummy-zygosity',
    start_base: 'dummy-start_base',
    chromosome_name: 'dummy-chromosome_name',
    variant_type: 'dummy-variant_type',
    quality: 'dummy-quality'
  };

  const mockReadFileSync = (data) => {
    fs.readFileSync = jest.fn()
      .mockImplementation(() => {
        return JSON.stringify([data]);
      });
  };

  log.error = jest.fn();

  Report.create = Genotype.create = jest.fn()
    .mockImplementation((data, callback) => {
      if (data.id === 'dummy-id' || data.opaque_id === 'dummy-opaque_id') {
        callback(null);
      } else {
        callback(new Error('failed'));
      }
    });

  beforeEach(() => {
    log.error.mockClear();
  });

  unroll('it should #expectedResult for #case file', async (
      done: () => void,
      args: {case: string, mockReadData: object, functionName: () => void, expectedResult: string}
  ) => {
    mockReadFileSync(args.mockReadData);
    args.functionName();
    if (args.expectedResult === 'not call log.error when pass') {
      expect(log.error).not.toBeCalled();
    } else {
      expect(log.error).toBeCalledWith(`Unable to add ${args.case} invalid. Error JSON: {}`);
    }
    done();
  }, [ // tslint:disable-next-line
    ['case', 'functionName', 'mockReadData', 'expectedResult'],
    ['Report', seedReport, dummyReport, 'not call log.error when pass'],
    ['Report', seedReport, { ...dummyReport, id: 'invalid' }, 'log.error error when fail'],
    ['Genotype', seedGenotype, dummyGenotype, 'not call log.error when pass'],
    ['Genotype', seedGenotype, { ...dummyGenotype, opaque_id: 'invalid' }, 'log.error error when fail']
  ]);

});
