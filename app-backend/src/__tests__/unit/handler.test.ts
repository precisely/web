/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.unmock('aws-sdk');
import {graphqlHandler, playgroundHandler} from '../../handler';

it('graphqlHandler should be a function', function() {
  expect(typeof graphqlHandler).toBe('function');
});

it('playgroundHandler should be a function', function() {
  expect(typeof playgroundHandler).toBe('function');
});
