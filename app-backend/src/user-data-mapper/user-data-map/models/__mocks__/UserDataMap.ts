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
            vendor_data_type_id: 1
        },
        {});
export const UserDataMap = () => UserDataMapMock;

UserDataMapMock.findAll = jest.fn((): IUserDataMapInstance[] => {
    return [UserDataMapMock.build()];
});

UserDataMapMock.create = jest.fn((args: {user_id: string, vendor_data_type_id: number}): PromiseLike<void> => {
    return new Promise((resolve, reject): void => {
        if (args.user_id === 'test') {
            resolve(UserDataMapMock.build());
        } else {
            reject(new Error('mock-create error'));
        }
    });
});

UserDataMapMock.findOne = jest.fn((
        args: {where: {data_type_user_id: string, user_id: string, vendor_data_type_id: string}}
    ): PromiseLike<void> => {
    return new Promise((resolve, reject): void => {
        if (args.where.data_type_user_id === 'test') {
            resolve(UserDataMapMock.build());
        } else if (args.where.data_type_user_id === 'invalid') {
            resolve();
        } else if (args.where.user_id === 'test' && args.where.vendor_data_type_id === 1) {
            resolve(UserDataMapMock.build());
        } else {
            reject(new Error('mock-findOne error'));
        }
    });
});

UserDataMapMock.associate = (): void => {}; // tslint:disable-line:no-empty