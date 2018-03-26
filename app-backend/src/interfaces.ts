/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

export interface Authorizer {
  claims?: {
    sub: string;
    'custom:roles'?: string;
  };
}

export interface Secrets {
  POSTGRES_DB_NAME: string;
  POSTGRES_DB_USERNAME: string;
  POSTGRES_DB_PASSWORD: string;
  POSTGRES_DB_CONN_STR: string;
}
