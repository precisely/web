/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../user-data-map/models/UserDataMap');

import {userDataMapResolver} from '../../user-data-map/api/resolver';
import {UserDataMapAttributes, UserDataMapInstance} from '../../user-data-map/models/UserDataMap';

describe('UserDataMap resolver tests.', () => {

    describe('tests for list', () => {

        it('should pass when no params are passed', async () => {
            let responseList: UserDataMapInstance[] = await userDataMapResolver.list();
            let response: UserDataMapAttributes = responseList[0].get({plain: true});
            expect(response.user_id).toEqual('test');
            expect(response.vendor_data_type).toEqual('test');
        });

        it('should pass when valid params are passed', async () => {
            let responseList: UserDataMapInstance[] = await userDataMapResolver.list({limit: 10, offset: 10});
            let response: UserDataMapAttributes = responseList[0].get({plain: true});
            expect(response.user_id).toEqual('test');
            expect(response.vendor_data_type).toEqual('test');
        });

        it('should throw error invalid params are passed', async () => {
            let responseList: UserDataMapInstance[] = await userDataMapResolver.list({limit: -10});
            expect(responseList.message).toEqual('mock-findAll error');
        });
    });

    describe('tests for get', () => {

        it('should pass when valid params are passed', async () => {
            let response: IUserDataMapAttributes = await userDataMapResolver.get({
                user_id: 'test', 
                vendor_data_type: 'test'
            });
            
            expect(response.user_id).toEqual('test');
            expect(response.vendor_data_type).toEqual('test');
        });

        it('should throw error invalid params are passed', async () => {
            try {
                let response: IUserDataMapAttributes = await userDataMapResolver.get({
                    user_id: 'invalid', 
                    vendor_data_type: 'test'
                });
            } catch (error) {
                expect(error.message).toEqual('No such user record found');
            }
        });
    });

    describe('tests for findOrCreate', () => {

        it('should pass when all data is passed', async () => {
            let response: UserDataMapAttributes = await userDataMapResolver.findOrCreate({
                    userId: 'dummyId', 
                    vendorDataType: 'test'
                });
            expect(response.user_id).toEqual('test');
            expect(response.vendor_data_type).toEqual('test');
        });

        it('should throw error when data is missing', async () => {
            let response: UserDataMapAttributes = await userDataMapResolver.findOrCreate({
                    userId: 'invalid', 
                    vendorDataType: 'test'
                });
            expect(response.message).toEqual('mock-findCreateFind error');
        });
    });

});
