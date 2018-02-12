/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../../user-data-mapper/vendor-data-type/models/VendorDatatype');
jest.mock('../../../user-data-mapper/user-data-map/models/UserDataMap');

import {UserDataMapResolver} from '../../../user-data-mapper/user-data-map/api/resolver';

describe('UserDataMap resolver tests.', (): void => {
    it('should pass when list is found', async () => {
        let response = await UserDataMapResolver.list();
        response = response[0].get({plain: true});
        expect(response.data_type_user_id).toEqual('dummyId');
        expect(response.user_id).toEqual('test');
    });

    describe('tests for create', (): void => {

        it('should pass when all data is passed', async () => {
            let response = await UserDataMapResolver.create({user_id: 'test', vendor_data_type_id: 1});
            expect(response.user_id).toEqual('test');
            expect(response.vendor_data_type_id).toEqual(1);
        });

        it('should throw error when data is missing', async () => {
            let response = await UserDataMapResolver.create({user_id: 'invalid'});
            expect(response.message).toEqual('mock-create error');
        });
    });

    describe('tests for update', (): void => {

        it('should pass when data_type_user_id is passed', async () => {
            let response = await UserDataMapResolver.getUserDataMap({data_type_user_id: 'test'});
            expect(response.user_id).toEqual('test');
            expect(response.vendor_data_type_id).toEqual(1);
        });

        it('should pass when user_id & vendor_data_type_id are passed', async () => {
            let response = await UserDataMapResolver.getUserDataMap({user_id: 'test', vendor_data_type_id: 1});
            expect(response.user_id).toEqual('test');
            expect(response.vendor_data_type_id).toEqual(1);
        });

        it('should throw error when no user data is found', async () => {
            let response = await UserDataMapResolver.getUserDataMap({data_type_user_id: 'invalid'});
            expect(response.message).toEqual('No such user data found');
        });

        it('should throw error when params are missing', async () => {
            let response = await UserDataMapResolver.getUserDataMap({});
            expect(response.message).toEqual('Missing Parameters. See documentation for details.');
        });
    });
});