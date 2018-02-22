/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

jest.mock('../../user-data-map/models/UserDataMap');

import {UserDataMapResolver} from '../../user-data-map/api/resolver';
import {IUserDataMapAttributes, IUserDataMapInstance} from '../../user-data-map/models/UserDataMap';

describe('UserDataMap resolver tests.', (): void => {

    describe('tests for list', (): void => {

        it('should pass when no params are passed', async () => {
            let responseList: IUserDataMapInstance[] = await UserDataMapResolver.list();
            let response: IUserDataMapAttributes = responseList[0].get({plain: true});
            expect(response.user_id).toEqual('test');
            expect(response.vendor_data_type).toEqual('test');
        });

        it('should pass when valid params are passed', async () => {
            let responseList: IUserDataMapInstance[] = await UserDataMapResolver.list({limit: 10, offset: 10});
            let response: IUserDataMapAttributes = responseList[0].get({plain: true});
            expect(response.user_id).toEqual('test');
            expect(response.vendor_data_type).toEqual('test');
        });

        it('should throw error invalid params are passed', async () => {
            let responseList: IUserDataMapInstance[] = await UserDataMapResolver.list({limit: -10});
            expect(responseList.message).toEqual('mock-findAll error');
        });
    });

    describe('tests for findOrCreate', (): void => {

        it('should pass when all data is passed', async () => {
            let response: IUserDataMapAttributes = await UserDataMapResolver.findOrCreate({
                    userId: 'dummyId', 
                    vendorDataType: 'test'
                });
            expect(response.user_id).toEqual('test');
            expect(response.vendor_data_type).toEqual('test');
        });

        it('should throw error when data is missing', async () => {
            let response: IUserDataMapAttributes = await UserDataMapResolver.findOrCreate({
                    userId: 'invalid', 
                    vendorDataType: 'test'
                });
            expect(response.message).toEqual('mock-findCreateFind error');
        });
    });

});