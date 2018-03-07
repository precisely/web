/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {Col} from 'src/components/ReusableComponents';

export interface GenotypeCaseProps {
    children: React.ReactNode;
    svn: string;
}

export let GenotypeCase: React.StatelessComponent<GenotypeCaseProps> = props => (
    <Col>
        {props.children}
    </Col>
);

GenotypeCase = Radium(GenotypeCase);
