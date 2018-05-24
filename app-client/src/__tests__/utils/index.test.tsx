/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {toast} from 'react-toastify';
import {utils} from 'src/utils/index';

const unroll = require('unroll');
unroll.use(it);

describe('Tests for utils/index.ts', () => {

  toast.isActive = jest.fn().mockReturnValueOnce(true).mockReturnValue(false);

  unroll('it should test the isEmpty function when the object is #condition', (
      done: () => void,
      args: {condition: string, params: Object, result: boolean}
  ) => {
    expect(utils.isEmpty(args.params)).toEqual(args.result);
    done();
  }, [ // tslint:disable-next-line
    ['condition', 'params', 'result'],
    ['valid', {id: 1}, false],
    ['empty', {}, true]
  ]);

  it('should test getEnvironment and return the correct environment', () => {
    expect(utils.getEnvironment()).toEqual('test');

    process.env.NODE_ENV = '';
    expect(utils.getEnvironment()).toEqual('');
  });

  it('should be able to get last page before login if set', () => {
    utils.setLastPageBeforeLogin('/dummyPath');
    expect(utils.getLastPageBeforeLogin()).toEqual('/dummyPath');
  });
});

