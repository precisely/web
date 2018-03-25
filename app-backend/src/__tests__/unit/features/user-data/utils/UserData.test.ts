/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as GenotypeService from '../../../../../features/genotype/services/Genotype';
import * as UserDataMapService from '../../../../../features/user-data/services/UserDataMap';
import {UserData} from '../../../../../features/user-data/utils/UserData';

const unroll = require('unroll');
unroll.use(it);

describe('UserData tests.', function() {

  GenotypeService.getGenotypes = jest.fn();

  UserDataMapService.getOpaqueId = jest.fn()
    .mockImplementation(function() { return 'demo-id'; })
    .mockImplementationOnce(function() { throw new Error('No such user record found'); });

  let userData = new UserData('demo-id', ['demo', 'gene']);

  it('should be an instance', function() {
    expect(userData).toBeInstanceOf(UserData);
    expect(userData.getGenotypes).toBeInstanceOf(Function);
  });

  unroll('it should return #action if #condition', async function(
      done: () => void,
      args: {action: string; condition: string}
  ) {
    try {
      await userData.getGenotypes();
      expect(UserDataMapService.getOpaqueId).toBeCalledWith('demo-id', 'precisely:genetics');
      expect(GenotypeService.getGenotypes).toBeCalledWith('demo-id', ['demo', 'gene']);
    } catch (error) {
      expect(error.message).toBe('No such user record found');
    }
    done();
  }, [
    ['action', 'condition'],
    ['error', 'no user Found'],
    ['genotype list', 'successful']
  ]);

});
