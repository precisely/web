/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {IUserDataMapInstance} from '../UserDataMap';

const SequelizeMock = require('sequelize-mock');
const DBConnectionMock = new SequelizeMock();

export const UserDataMapMock = DBConnectionMock.define(
        'userDataMap',
        {
            user_id: 'test',
            data_type_user_id: 'dummyId',
            vendor_data_type: 'test'
        },
        {});

export const UserDataMap = UserDataMapMock;

UserDataMapMock.findAll = jest.fn((params: {limit: number, offset: number}): PromiseLike<IUserDataMapInstance[]> => {
    return new Promise((resolve, reject): void => {
        if (params.limit > 0) {
            resolve([UserDataMapMock.build()]);
        } else {
            reject(new Error('mock-findAll error'));
        }
    });
});

UserDataMapMock.findCreateFind = jest.fn((params: {where: {user_id: string}}) => {
    return {
        spread: (callback: ((user: IUserDataMapInstance) => IUserDataMapInstance)): Promise<IUserDataMapInstance> => 
                new Promise((resolve, reject): void => {
                    
            if (params.where.user_id === 'dummyId') {
                resolve(callback(UserDataMapMock.build()));
            } else {
                reject(new Error('mock-findCreateFind error'));
            }
        }),
    };
});
