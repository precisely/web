/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {IResolvers} from 'graphql-tools/dist/Interfaces';
import {resolvers as variantCallResolvers} from './variant-call';
import {resolvers as reportResolvers} from './report';
import {merge} from 'lodash';

export const resolvers: IResolvers = [
  variantCallResolvers,
  reportResolvers].reduce(merge);
