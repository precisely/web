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
import {Button} from 'src/components/ReusableComponents';
import {logOut} from 'src/utils/cognito';

@Radium
export class Dashboard extends React.Component<RouteComponentProps<void>> {

    /**
     * This is a dummy component for demonstration purpose only.
     * It will be removed in future.
     */

    render(): JSX.Element {
        return (
            <div>
                <h6>This is a dummy dashboard page.</h6><br/>
                <Button onClick={(logout): void => { logOut(); this.props.history.push('/login'); }}>
                    Logout
                </Button>
            </div>
        );
    }
}