/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {RouteComponentProps} from 'react-router';
import {Container} from 'src/components/ReusableComponents';
import {NavbarHeader} from 'src/components/NavbarHeader/NavbarHeader';

@Radium
export class Dashboard extends React.Component<RouteComponentProps<void>> {

    /**
     * This is a dummy component for demonstration purpose only.
     * It will be removed in future.
     */

    render(): JSX.Element {
        return (
            <div>
                <NavbarHeader {...this.props}/>
                <hr/>
                <Container>
                    <h6>This is a dummy dashboard page.</h6><br/>
                </Container>
            </div>
        );
    }
}