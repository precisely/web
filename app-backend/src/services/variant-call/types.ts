/*
* Copyright (c) 2017-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/
export type RefIndex = {refName: string, refVersion: string, start: number};
export type VariantCallIndexes = {
  refIndexes: RefIndex[],
  rsIds: string[]
};
