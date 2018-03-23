/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../utils', () => ({
  hasAuthorizedRoles: jest.fn().mockReturnValue(true),
  addEnvironmentToTableName: jest.fn((tableName: string, version: string) => {
    return `test-${version}-${tableName}}`;
  }),
}));
