/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

jest.doMock('src/utils', () => ({
  showAlert: jest.fn<number>().mockReturnValue(1),
  checkEmailAndPassword: jest.fn()
      .mockImplementationOnce(() => {
        return {isValid: false, toastId: 1};
      })
      .mockImplementation(() => {
        return {isValid: true, toastId: 1};
      }),
}));
