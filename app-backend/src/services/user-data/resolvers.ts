/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {UserData} from './services';

export const resolvers = {
  UserData: {
    genotypes: async (userData: UserData) => await userData.genotypes()
    // surveyResponses: ...
  }
};
