/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {IVendorDatatypeInstance} from '../VendorDatatype';

const SequelizeMock = require('sequelize-mock');
const DBConnectionMock = new SequelizeMock();

export const VendorDatatypeMock = DBConnectionMock.define('vendorDatatype', {
        vendor: 'test',
        data_type: 'test',
    }, {
        instanceMethods: {
            update: jest.fn((): void => VendorDatatypeMock.build()),
            destroy: jest.fn((): void => {}),
        },
        paranoid: true
    });
export const VendorDatatype = () => VendorDatatypeMock;

VendorDatatypeMock.findAll = jest.fn((): IVendorDatatypeInstance[] => {
        return [VendorDatatypeMock.build()];
    })

VendorDatatypeMock.findById = jest.fn((id: number): PromiseLike<IVendorDatatypeInstance> => {
    return new Promise((resolve: (instance?: IVendorDatatypeInstance) => void, reject: () => void): void => {
        if (id >= 1) {
            resolve(VendorDatatypeMock.build());
        } else {
            resolve();
        }
    });
});

VendorDatatypeMock.create = jest.fn((
        args: {vendor: string, data_type: string}
    ): PromiseLike<IVendorDatatypeInstance> => {
    return new Promise((resolve: (instance: IVendorDatatypeInstance) => void, reject: (error: Error) => void): void => {
        if (args.vendor && args.data_type) {
            resolve(VendorDatatypeMock.build());
        } else {
            reject(new Error('mock-create error'));
        }
    });
});

VendorDatatypeMock.destroy = jest.fn((args: {where: {id: number}}): PromiseLike<number> => {
    return new Promise((resolve: (id: number) => void, reject: () => void): void => {
        if (args.where.id >= 1) {
            resolve(1);
        } else {
            resolve(0);
        }
    });
});

VendorDatatypeMock.associate = () => {};