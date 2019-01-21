/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import gql from 'graphql-tag';

import variantCallSchema from './variant-call/schema';
import reportSchema from './report/schema';
import surveySchema from './survey/schema';

const mainSchema = [gql`
type Query 

type Mutation

scalar JSON`];

export default [...mainSchema, ...variantCallSchema, ...reportSchema, ...surveySchema];
