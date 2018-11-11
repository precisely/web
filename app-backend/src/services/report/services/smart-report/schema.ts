/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import gql from 'graphql-tag';

export default [gql`
type Personalization {
  status: String,
  elements: JSON
}`];
