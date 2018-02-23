/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {IResolvers} from 'graphql-tools/dist/Interfaces';
import * as UserDataMapResolvers from './user-data-map/api/resolver';
import * as GeneticsResolvers from './genetics-service/api/resolver';
import * as ReportResolvers from './report-service/api/resolver';

export const resolvers: IResolvers = {
    Query: {
        ...UserDataMapResolvers.queries,
        ...GeneticsResolvers.queries,
        ...ReportResolvers.queries,
    },
    Mutation: {
        ...UserDataMapResolvers.mutations,
        ...GeneticsResolvers.mutations,
        ...ReportResolvers.mutations,
    }
};
