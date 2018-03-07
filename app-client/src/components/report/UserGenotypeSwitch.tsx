/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {Row} from 'src/components/ReusableComponents';

export interface UserGenotypeSwitchProps {
    children: React.ReactNode;
    gene: string;
}

export let UserGenotypeSwitch: React.StatelessComponent<UserGenotypeSwitchProps> = props => (
    <Row>
        {props.children}
    </Row>
);

UserGenotypeSwitch = Radium(UserGenotypeSwitch);
