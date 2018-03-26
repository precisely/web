/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {IResolvers} from 'graphql-tools/dist/Interfaces';
import * as ReportResolvers from './features/report/api/resolver';

export const resolvers: IResolvers = {
  Query: {
    ...ReportResolvers.queries,
  },
  Mutation: {
    ...ReportResolvers.mutations,
  }
};
