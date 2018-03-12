/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {saveJSONfile} from '../../seed-data/scripts/createSeed';

const jsonfile = require('jsonfile');
const unroll = require('unroll');
unroll.use(it);

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

  unroll('it should #expectedResult for #filetype file', async (
      done: () => void,
      args: {expectedResult: string, filetype: string, params: string[]}
  ) => {
    saveJSONfile(args.filetype, []);
    expect(jsonfile.writeFile).toBeCalled();
    expect(console.log).toBeCalledWith(...args.params);
    done();
  }, [ // tslint:disable-next-line
    ['expectedResult', 'filetype', 'params'],
    ['pass', 'valid', ['valid', 'created successfully.']],
    ['throw error', 'invalid', ['Error:', 'createSeed mock error']]
  ]);

});
