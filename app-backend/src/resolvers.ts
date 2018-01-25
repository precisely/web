/*
* Copyright (c) 2011-Present, CauseCode Technologies Pvt Ltd, India.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {random, IRandomList} from "./random/resolver";
import {IResolvers} from "graphql-tools/dist/Interfaces";

export const resolvers: IResolvers = {
  Query: {
    getRandomList: (root: any, args: {length: number}): IRandomList => random.list(args),
  },
};
