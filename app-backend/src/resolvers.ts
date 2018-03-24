/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {IResolvers} from 'graphql-tools/dist/Interfaces';
import {resolvers as genotypeResolvers} from './api/genotype/resolvers';
import {resolvers as reportResolvers} from './api/report/resolvers';

export const resolvers: IResolvers = {
  Query: {
    ...ReportResolvers.queries,
  },
  Mutation: {
    ...UserDataMapResolvers.mutations,
    ...ReportResolvers.mutations,
  }
};
