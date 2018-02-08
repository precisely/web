/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {IResolvers} from "graphql-tools/dist/Interfaces";
import {UserDataMapResolver} from "./userDataMapper/userDataMap/resolver";
import {VendorDatatypeResolver} from "./userDataMapper/vendorDatatype/resolver";
import {IVendorDatatypeAttributes} from "src/userDataMapper/vendorDatatype/VendorDatatype";

export const resolvers: IResolvers = {
    Query: {
        listUserDataMap: () => UserDataMapResolver.list(),
        listVendorDatatype: () => VendorDatatypeResolver.list(),
        getVendorDatatype: (root: any, args: { id: number }) => VendorDatatypeResolver.get(args),
    },
    Mutation: {
        createVendorDatatype: (root: any, args: { vendor: string, data_type: string }) => 
                VendorDatatypeResolver.create(args),
        updateVendorDatatype: (root: any, args: { id: number, data: IVendorDatatypeAttributes }) =>
                VendorDatatypeResolver.update(args),
        deleteVendorDatatype: (root: any, args: { id: number }) => VendorDatatypeResolver.delete(args),
    }
};
