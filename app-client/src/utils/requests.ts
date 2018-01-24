/*
* Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

// Add methods for api calls using axios here
import Axios, {AxiosResponse} from 'axios';
import {serverURL} from '../config';

export function doGet(url: string) {

    return Axios.get(serverURL + url)
        .then((response: AxiosResponse): void => {
            return response.data || {};
        })
        .catch(() => {
            // Error handling code goes here
        });
}
