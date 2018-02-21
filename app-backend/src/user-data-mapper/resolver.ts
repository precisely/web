/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {UserDataMapResolver, IListFilters} from './user-data-map/api/resolver';

// tslint:disable:no-any

export const queries = {
    listUserDataMap: /* istanbul ignore next */ (root: any, args: IListFilters) =>
        UserDataMapResolver.list(args),
};

export const mutations = {
    findOrCreateUserDataMap: /* istanbul ignore next */ 
        (root: any, args: {userId: string, vendorDataType: string}) => UserDataMapResolver.findOrCreate(args),
};