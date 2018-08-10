/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:48:05 
 * @Last Modified by:   Aneil Mallavarapu 
 * @Last Modified time: 2018-08-10 09:48:05 
 */

import gql from 'graphql-tag';

import variantCallSchema from './variant-call/schema';
import reportSchema from './report/schema';

const mainSchema = [gql`
type Query 

type Mutation

scalar JSON`];

export default [...mainSchema, ...variantCallSchema, ...reportSchema];
