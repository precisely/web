/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

const SequelizeMock = require('sequelize-mock');
const DBConnectionMock = new SequelizeMock();

export const UserDataMapMock = DBConnectionMock.define(
  'userDataMap',
  {
    user_id: 'testUserId',
    opaque_id: 'testOpaqueId',
    vendor_data_type: 'testVendorDataType'
  },
  {});

export const UserDataMap = UserDataMapMock;

UserDataMapMock.findOne = jest.fn((params: { where: { user_id: string } }) => {
  if (params.where.user_id === 'testUserId') {
    return UserDataMapMock.build();
  } else {
    throw new Error('mock-findFindAll error');
  }
});
