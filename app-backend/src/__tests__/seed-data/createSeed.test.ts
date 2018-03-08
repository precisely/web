/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {saveJSONfile} from '../../seed-data/scripts/createSeed';
const jsonfile = require('jsonfile');

describe('createSeed test', () => {

  console.log = jest.fn();
  jsonfile.writeFile = jest.fn()
    .mockImplementation((
      filename: string,
      data: object[],
      options: object,
      callback: (error: Error) => void,
    ) => {
      if (filename.includes('invalid')) {
        callback(new Error('createSeed mock error'));
      } else {
        callback(null);
      }
    });

  it('should pass for valid file', () => {
    saveJSONfile('valid', []);
    expect(jsonfile.writeFile).toBeCalled();
    expect(console.log).toBeCalledWith('valid', 'created successfully.');
  });

  it('should throw error for invalid file', () => {
    saveJSONfile('invalid', []);
    expect(jsonfile.writeFile).toBeCalled();
    expect(console.log).toBeCalledWith('Error:', 'createSeed mock error');
  });
});
