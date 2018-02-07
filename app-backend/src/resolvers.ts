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

export const resolvers: IResolvers = {
  Query: {
    listUserDataMap: () => UserDataMapResolver.list(),
    listVendorDatatype: () => VendorDatatypeResolver.list(),
    getVendorDatatype: (root: any, args: {id: number}): any => VendorDatatypeResolver.get(args),
  },
  Mutation: {
    createVendorDatatype: (root: any, args: {vendor: string, data_type: string}) => VendorDatatypeResolver.create(args),
    deleteVendorDatatype: (root: any, args: {id: number}) => VendorDatatypeResolver.delete(args),
  }
};
