/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../genotype-service/models/Genotype');

import {GenotypeAttributes, Genotype} from '../../genotype-service/models/Genotype';
import {resolver as genotypeResolver, CreateOrUpdateAttributes} from 'src/api/genotype';

const unroll = require('unroll');
unroll.use(it);

type ExecSuccess = {Items: GenotypeAttributes[]};

describe('Genotype resolver tests.', () => {
  hasAuthorizedRoles = jest.fn().mockReturnValue(true);

  const commonData: {gene: string, source: string, quality: string} = {
    gene: 'QWERTY2',
    source: 'helix',
    quality: undefined,
  };

  const dummyRequestData: CreateOrUpdateAttributes = {...commonData, opaqueId: 'PQR03'};
  const dummyResponseData: GenotypeAttributes = {...commonData, opaqueId: 'PQR03'};

  Genotype.getAsync = jest.fn()
      .mockImplementationOnce(() => ({get: () => ({opaqueId: 'PQR03'})}))
      .mockImplementationOnce(() => null)
      .mockImplementationOnce(() => ({get: () => ({opaqueId: 'PQR03'})}))
      .mockImplementationOnce(() => null)
      .mockImplementationOnce(() => ({get: () => dummyResponseData}))
      .mockImplementationOnce(() => null);

  Genotype.createAsync = Genotype.updateAsync = jest.fn()
      .mockImplementation((data: GenotypeAttributes) => ({
        get: (): GenotypeAttributes => data
      }));

  const execAsync = jest.fn()
    .mockImplementation(() => ({Items: [{get: () => ({...commonData, opaqueId: 'PQR03'})}]}))
    .mockImplementationOnce(() => {throw new Error('genotypeResolver-list: mock error'); });

  Genotype.query = jest.fn(() => ({
      filter: jest.fn(() => ({
        in: jest.fn(() => ({
          execAsync
        }))
      })),
  }));

  describe('Create tests', () => {
    it('should throw an error when the record already exists.', async () => {
      let response = await genotypeResolver.create(dummyRequestData);
      expect(response[`message`]).toEqual('Record already exists.');
    });

    it('should create a new record when there is no error', async () => {
      let response = await genotypeResolver.create(dummyRequestData);
      expect(response).toEqual(dummyResponseData);
    });
  });

  describe('Update tests', () => {
    it('should update the record when there is no error.', async () => {
      let response = await genotypeResolver.update(dummyRequestData);
      expect(response).toEqual(dummyResponseData);
    });

    it('should throw an error when the opaqueId is invalid.', async () => {
      let response = await genotypeResolver
          .update({opaqueId: 'abcd', gene: 'XXXXX', source: 'helix'});
      expect(response[`message`]).toEqual('No such record found');
    });
  });

  describe('Get tests', () => {
    it('should fetch the record when there is no error.', async () => {
      let response = await genotypeResolver.get({opaqueId: 'PQR03', gene: 'QWERTY2'});
      expect(response).toEqual(dummyResponseData);
    });

    it('should throw an error when the opaqueId is invalid.', async () => {
      let response = await genotypeResolver.get({opaqueId: 'abcd', gene: 'XXXX'});
      expect(response[`message`]).toEqual('No such record found');
    });
  });

  describe('List test', () => {
    it('should return an error message on error.', async () => {
      let response = await genotypeResolver.list({opaqueId: 'demo', genes: []});
      expect(response[`message`]).toEqual('genotypeResolver-list: mock error');
    });

    it('should return result when successful', async () => {
      let response = await genotypeResolver.list({opaqueId: 'PQR03', genes: []});
      expect(response).toEqual([dummyResponseData]);
    });
  });
});
