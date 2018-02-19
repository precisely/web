/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

// All the global CSS styles and color constants should be written here

import {CSS} from 'src/interfaces';

export const buttonDefault: string = '#6c757d';
export const buttonHover: string = '#545b62';
export const defaultBackground: string = '#F5F5F5';

export const helveticaFont: CSS = {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
};

export const formButton: CSS = {
    width: '100%',
    color: '#fff',
    backgroundColor: buttonDefault,
    borderColor: buttonDefault,
    ':hover': {
        backgroundColor: buttonHover,
        borderColor: buttonHover,
    }
};

export const removeBorderRadius: CSS = {
    borderRadius: 0,
};

export const inputStyle: CSS = {
    borderTop: 'none',
    ...removeBorderRadius,
};

export const container: CSS = {
    height: '-webkit-fill-available',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultBackground,
    padding: 0,
};

export const header: CSS = {
    textAlign: 'center',
    fontWeight: 200,
};

export const loginAndSignupPanel: CSS = {
    width: '500px',
    '@media screen and (max-width: 700px)': {
        width: '345px',
    },
};
