/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('fs');
jest.unmock('aws-sdk');
jest.unmock('dynogels-promisified');

import {seedReport, seedGenotype} from '../../../seed-data/scripts/seedDynamo';
import {log} from '../../../logger';
import {Report} from '../../../features/report/models/Report';
import {Genotype} from '../../../features/genotype/models/Genotype';
import {mockReportData, mockGenotypeData} from '../../constants/seedData';

const fs = require('fs');
const unroll = require('unroll');
unroll.use(it);

describe('seedDynamo tests', function() {

  log.error = jest.fn();

  // TODO: Remove logic from mocks
  Report.create = Genotype.create = jest.fn()
    .mockImplementation((data, callback) => {
      if (data.id === 'dummy-id' || data.opaqueId === 'dummy-opaqueId') {
        callback(null);
      } else {
        callback(new Error('failed'));
      }
    });

  beforeEach(function() {
    log.error.mockClear();
  });

  unroll('it should #expectedResult for #case file', async function(
      done: () => void,
      args: {case: string, mockReadData: object, functionName: () => void, expectedResult: string}
  ) {
    fs.setMockReadFileSync.mockImplementationOnce(() => JSON.stringify([args.mockReadData]));
    args.functionName();
    if (args.expectedResult === 'not call log.error when pass') {
      expect(log.error).not.toBeCalled();
    } else {
      expect(log.error).toBeCalledWith(`Unable to add ${args.case} invalid. Error JSON: {}`);
    }
    done();
  }, [ // tslint:disable-next-line
    ['case', 'functionName', 'mockReadData', 'expectedResult'],
    ['Report', seedReport, mockReportData, 'not call log.error when pass'],
    ['Report', seedReport, { ...mockReportData, id: 'invalid' }, 'log.error error when fail'],
    ['Genotype', seedGenotype, mockGenotypeData, 'not call log.error when pass'],
    ['Genotype', seedGenotype, { ...mockGenotypeData, opaqueId: 'invalid' }, 'log.error error when fail']
  ]);

});
