/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {UserDataMapInstance} from '../UserDataMap';

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

UserDataMapMock.findAll = jest.fn((params: {limit: number, offset: number}): PromiseLike<UserDataMapInstance[]> => {
  return new Promise((resolve, reject): void => {
    if (params.limit > 0) {
      resolve([UserDataMapMock.build()]);
    } else {
      reject(new Error('mock-findAll error'));
    }
  });
});

UserDataMapMock.findOne = jest.fn((params: {where: {user_id: string, vendor_data_type: string}}): 
    PromiseLike<IUserDataMapInstance> => {

  return new Promise((resolve, reject): void => {
    if (params.where.user_id === 'test') {
      resolve(UserDataMapMock.build());
    } else {
      resolve();
    }
  });
});

UserDataMapMock.findCreateFind = jest.fn((params: {where: {user_id: string}}) => {
  return {
    spread: (callback: ((user: UserDataMapInstance) => UserDataMapInstance)): Promise<UserDataMapInstance> => 
        new Promise((resolve, reject): void => {
          
      if (params.where.user_id === 'dummyId') {
        resolve(callback(UserDataMapMock.build()));
      } else {
        reject(new Error('mock-findCreateFind error'));
      }
    }),
  };
});
