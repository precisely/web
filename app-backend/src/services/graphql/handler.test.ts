/**
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import {apiHandler, playgroundHandler} from './handlers';

it('graphqlHandler should be a function', () => {
  expect(typeof apiHandler).toBe('function');
});

it('playgroundHandler should be a function', () => {
  expect(typeof playgroundHandler).toBe('function');
});
