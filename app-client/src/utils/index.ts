/*
* Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

/* tslint:disable no-any */
const packageJson: any = require('../../../package.json');
const localConfigJson: any = require('../../../localConfig.json');
/* tslint:enable no-any */

/**
 * A method to check if the given object is empty
 * @param object the JS object that needs to be checked
 * @returns boolean - true if object is empty, else false
 */
export function isEmpty(object: Object): boolean {
    return (!object || !Object.keys(object).length);
}

/**
 * A method to get the current NODE environment
 * @returns string - current NODE environment
 */
export function getEnvironment(): string {
    return process.env.NODE_ENV || '';
}

/**
 * A method to get serverURL configuration from package.json or localConfig.json
 * @returns Object for package.json or localConfig.json as per the environment
 */
export function getConfig(): Object {
    return (getEnvironment() === 'production') ? packageJson : localConfigJson;
}

