/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../userDataMapper/vendorDatatype/VendorDatatype');
jest.mock('../../userDataMapper/userDataMap/UserDataMap');

import * as Sequelize from 'sequelize';
import {sequelize} from '../../userDataMapper/sequelize';
import {VendorDatatypeResolver} from '../../userDataMapper/vendorDatatype/resolver';

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
})