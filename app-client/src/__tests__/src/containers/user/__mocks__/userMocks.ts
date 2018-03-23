/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

/**
 * In future, if we need to mock a module for a specific test file, we will be adding the mocks for the same in it's
 * directory.
 *
 * For example, if we need to add a mock specific to Login and it's not going to be used anywhere, it will be added
 * here.
 *
 */

/**
 * jest.mock('src/dummy/path', () => ({
 *   getResetPasswordCode: jest.fn<void>()
 *     .mockImplementationOnce((email: string, successCallback?: () => void) => { successCallback(); })
 *     .mockImplementationOnce((email: string, successCallback?: () => void, failureCallback?: () => void) => {
 *       failureCallback();
 *     }),
 * }));
 *
 */
