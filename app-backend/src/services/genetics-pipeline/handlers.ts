/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import {Handler, Context, Callback, S3CreateEvent} from 'aws-lambda';

export const vcfIngester: Handler = (event: S3CreateEvent, context: Context, callback: Callback) => {
  // TODO
};
