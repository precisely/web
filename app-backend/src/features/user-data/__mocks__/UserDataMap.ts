/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {UserDataMapInstance} from 'src/user-data-map/models/UserDataMap';

const SequelizeMock = require('sequelize-mock');
const DBConnectionMock = new SequelizeMock();

export const UserDataMapMock = DBConnectionMock.define(
  'userDataMap',
  {
    user_id: 'test',
    opaque_id: 'dummyId',
    vendor_data_type: 'test'
  },
  {});

export const UserDataMap = UserDataMapMock;

UserDataMapMock.findAll = jest.fn((params: { limit: number, offset: number }): UserDataMapInstance[] => {
  if (params.limit > 0) {
    return [UserDataMapMock.build()];
  } else {
    throw new Error('mock-findAll error');
  }
});

UserDataMapMock.findCreateFind = jest.fn((params: { where: { user_id: string } }) => {
  return {
    spread: (callback: ((user: UserDataMapInstance) => UserDataMapInstance)): UserDataMapInstance => {
      if (params.where.user_id === 'dummyId') {
        return UserDataMapMock.build();
      } else {
        throw new Error('mock-findCreateFind error');
      }}
  };
});

UserDataMapMock.upsert = jest.fn((params: { user_id: string }): boolean => {
    if (params.user_id === 'dummyId') {
      return true;
    } else {
      throw new Error();
    }
});
