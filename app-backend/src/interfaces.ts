/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

export interface AuthorizerAttributes {
  claims?: {
    sub: string;
    'custom:roles'?: string;
  };
}
