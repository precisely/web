/*
* Copyright (c) 2011-Present, CauseCode Technologies Pvt Ltd, India.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {twitterEndpoint} from "./twitter";
import {random, IRandomList} from "./random";
import {IResolvers} from "graphql-tools/dist/Interfaces";

export const resolvers: IResolvers = {
  Query: {
    getTwitterFeed: (root: any, args: any): any => twitterEndpoint.getRawTweets(args),
    getRandomList: (root: any, args: {length: number}): IRandomList => random.list(args),
  },
};
