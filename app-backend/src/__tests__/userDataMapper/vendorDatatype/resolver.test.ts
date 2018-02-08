/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../../userDataMapper/vendorDatatype/VendorDatatype');
jest.mock('../../../userDataMapper/userDataMap/UserDataMap');

import * as Sequelize from 'sequelize';
import {sequelize} from '../../../userDataMapper/sequelize';
import {VendorDatatypeResolver} from '../../../userDataMapper/vendorDatatype/resolver';

describe('Tests for VendorDatatypeResolve', (): void => {

    it('should pass when list is found', async () => {
        let response = await VendorDatatypeResolver.list();
        response = response[0].get({plain: true});
        expect(response.vendor).toEqual('test');
        expect(response.data_type).toEqual('test');
    });

    describe('tests for get', (): void => {

        it('should pass when vendor is found', async () => {
            let response = await VendorDatatypeResolver.get({id: 1});
            response = response.get({plain: true});
            expect(response.vendor).toEqual('test');
            expect(response.data_type).toEqual('test');
        });

        it('should fail when no vendor is found', async () => {
            let response = await VendorDatatypeResolver.get({id: -1});
            expect(response.message).toEqual('No such vendor found');
        });

    })

    describe('tests for create', (): void => {

        it('should pass when all data is passed', async () => {
            let response = await VendorDatatypeResolver.create({vendor: 'test', data_type: 'test'});
            expect(response.vendor).toEqual('test');
            expect(response.data_type).toEqual('test');
        });

        it('should throw error when data is missing', async () => {
            let response = await VendorDatatypeResolver.create({vendor: 'test'});
            expect(response.message).toEqual('mock-create error');
        });
    })

    describe('tests for update', (): void => {

        it('should pass when all data is passed', async () => {
            let response = await VendorDatatypeResolver.update({id: 1, data: {vendor: 'test'}});
            expect(response.vendor).toEqual('test');
            expect(response.data_type).toEqual('test');
        });

        it('should throw error when invalid id is passed', async () => {
            let response = await VendorDatatypeResolver.update({id: -1, data: {vendor: 'test'}});
            expect(response.message).toEqual('No such vendor found');
        });
    })

    describe('tests for delete', (): void => {

        it('should pass when successfully deleted', async () => {
            let response = await VendorDatatypeResolver.delete({id: 1});
            expect(response.success).toEqual(true);
            expect(response.message).toEqual('Deleted Successfully');
        });

        it('should throw error when error in deletion', async () => {
            let response = await VendorDatatypeResolver.delete({id: -1});
            expect(response.message).toEqual('Couldn\'t be deleted');
        });
    })
})