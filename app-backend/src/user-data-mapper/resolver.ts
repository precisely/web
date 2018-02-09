/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {UserDataMapResolver} from 'src/user-data-mapper/user-data-map/api/resolver';
import {VendorDatatypeResolver} from 'src/user-data-mapper/vendor-data-type/api/resolver';
import {IVendorDatatypeAttributes} from 'src/user-data-mapper/vendor-data-type/models/VendorDatatype';

export const queries = {
    listUserDataMap: () => UserDataMapResolver.list(),
    listVendorDatatype: () => VendorDatatypeResolver.list(),
    getVendorDatatype: (root: any, args: {id: number}) => VendorDatatypeResolver.get(args),

    getUserDataMap: (root: any, args: {data_type_user_id: string, user_id: string, vendor_data_type_id: string}) =>
        UserDataMapResolver.getUserDataMap(args),
};

export const mutations = {
    createVendorDatatype: (root: any, args: { vendor: string, data_type: string }) =>
        VendorDatatypeResolver.create(args),
    updateVendorDatatype: (root: any, args: { id: number, data: IVendorDatatypeAttributes }) =>
        VendorDatatypeResolver.update(args),
    deleteVendorDatatype: (root: any, args: { id: number }) => VendorDatatypeResolver.delete(args),

    createUserDataMap: (root: any, args: {user_id: string, vendor_data_type_id: number}) =>
        UserDataMapResolver.create(args),
};