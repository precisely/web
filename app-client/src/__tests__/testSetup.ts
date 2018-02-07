/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

export const mockedHistory: {
    push: jest.Mock<void>, 
    goBack: jest.Mock<void>,
    replace: jest.Mock<void>
} = {
    push: jest.fn<void>(),
    goBack: jest.fn<void>(),
    replace: jest.fn<void>()
};
