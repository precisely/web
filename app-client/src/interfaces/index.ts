/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

export {CSSProperties as CSS} from 'react';

export interface GenericAction<Payload = {}> {
    type: string;
    payload?: Payload;
}
