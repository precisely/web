/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 * @Author: Aneil Mallavarapu 
 * @Date: 2018-08-10 09:49:33 
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-10-25 20:34:46
 */

import gql from 'graphql-tag';

export default [gql`
type Personalization {
  status: String,
  elements: JSON
}`];
