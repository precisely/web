/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {UserDataMapResolver} from './user-data-map/api/resolver';
import {VendorDatatypeResolver} from './vendor-data-type/api/resolver';
import {IVendorDatatypeAttributes} from './vendor-data-type/models/VendorDatatype';

export const queries = {
    listUserDataMap: /* istanbul ignore next */ () =>
        UserDataMapResolver.list(),
    listVendorDatatype: /* istanbul ignore next */ () =>
        VendorDatatypeResolver.list(),
    getVendorDatatype: /* istanbul ignore next */ (root: any, args: {id: number}) =>
        VendorDatatypeResolver.get(args),

    getUserDataMap: /* istanbul ignore next */ (root: any, args: {data_type_user_id: string, user_id: string, vendor_data_type_id: string}) =>
        UserDataMapResolver.getUserDataMap(args),
};

export const mutations = {
    createVendorDatatype: /* istanbul ignore next */ (root: any, args: { vendor: string, data_type: string }) =>
        VendorDatatypeResolver.create(args),
    updateVendorDatatype: /* istanbul ignore next */ (root: any, args: { id: number, data: IVendorDatatypeAttributes }) =>
        VendorDatatypeResolver.update(args),
    deleteVendorDatatype: /* istanbul ignore next */ (root: any, args: { id: number }) =>
        VendorDatatypeResolver.delete(args),
    createUserDataMap: /* istanbul ignore next */ (root: any, args: {user_id: string, vendor_data_type_id: number}) =>
        UserDataMapResolver.create(args),
};