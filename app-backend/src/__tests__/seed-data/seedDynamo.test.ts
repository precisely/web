/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('fs');

import * as fs from 'fs';
import {seedReport, dynamodbDocClient, seedGenotype} from '../../seed-data/scripts/seedDynamo';

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

  console.log = jest.fn();

  dynamodbDocClient = jest.fn()
    .mockImplementation(() => {
      return {
        put: jest.fn()
          .mockImplementation((data, callback) => {
            if (data.Item.id === 'dummy-id' || data.Item.opaque_id === 'dummy-opaque_id') {
              callback(null);
            } else {
              callback(new Error('failed'));
            }
          })
      };
    });

  beforeEach(() => {
    console.log.mockClear();
  });

  describe('seedReport test', () => {
    it('should not call console.log when pass', () => {
      mockReadFileSync(dummyReport);
      seedReport();
      expect(console.log).not.toBeCalled();
    });

    it('should log error when fail', () => {
      mockReadFileSync({ ...dummyReport, id: 'invalid' });
      seedReport();
      expect(console.log).toBeCalledWith('Unable to add Report', 'invalid', '. Error JSON:', '{}');
    });
  });

  describe('seedGenotype test', () => {
    it('should not call console.log when pass', () => {
      mockReadFileSync(dummyGenotype);
      seedGenotype();
      expect(console.log).not.toBeCalled();
    });

    it('should log error when fail', () => {
      mockReadFileSync({ ...dummyGenotype, opaque_id: 'invalid' });
      seedGenotype();
      expect(console.log).toBeCalledWith('Unable to add Genotype', 'invalid', '. Error JSON:', '{}');
    });
  });

});
