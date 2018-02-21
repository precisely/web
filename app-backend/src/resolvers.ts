/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {IResolvers} from 'graphql-tools/dist/Interfaces';
import * as UserDataMapperResolvers from './user-data-map/api/resolver';
import * as GeneticsResolvers from './genetics-service/api/resolver';
import * as ReportResolvers from './report-service/api/resolver';

export const resolvers: IResolvers = {
    Query: {
        ...UserDataMapperResolvers.queries,
        ...GeneticsResolvers.queries,
    },
    Mutation: {
        ...UserDataMapperResolvers.mutations,
        ...GeneticsResolvers.mutations,
        ...ReportResolvers.mutations,
    }
};
