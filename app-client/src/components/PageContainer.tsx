/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {CSS} from 'src/interfaces';

export let PageContainer: React.StatelessComponent<{style?: CSS}> = props => (
    <div style={[container, props.style]}>
        {props.children}
    </div>
);

PageContainer = Radium(PageContainer);

const container: CSS = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};
