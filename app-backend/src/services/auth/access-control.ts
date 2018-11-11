/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import { AccessControlPlus } from 'accesscontrol-plus';

const accessControl = new AccessControlPlus();

accessControl
  .deny('public').scope('*:*')
  .grant('user').inherits('public')
  .grant('admin').inherits('user');

export default accessControl;
