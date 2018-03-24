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
import {Report} from '../../features/report/models/Report';
import {Genotype} from '../../features/genotype/models/Genotype';

const unroll = require('unroll');
unroll.use(it);

describe('seedDynamo tests', () => {

  const dummyReport = {
    id: 'dummy-id',
    title: 'dummy-title',
    slug: 'dummy-slug',
    rawContent: 'dummy-rawContent',
    parsedContent: 'dummy-parsedContent',
    topLevel: false,
    genes: ['dummy-genes']
  };

  const dummyGenotype = {
    opaqueId: 'dummy-opaqueId',
    sampleId: 'dummy-sampleId',
    source: 'dummy-source',
    gene: 'dummy-gene',
    variantCall: 'dummy-variantCall',
    zygosity: 'dummy-zygosity',
    startBase: 'dummy-startBase',
    chromosomeName: 'dummy-chromosomeName',
    variantType: 'dummy-variantType',
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
      if (data.id === 'dummy-id' || data.opaqueId === 'dummy-opaqueId') {
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
    ['Genotype', seedGenotype, { ...dummyGenotype, opaqueId: 'invalid' }, 'log.error error when fail']
  ]);

});
