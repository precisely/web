/*
* Copyright (c) 2011-Present, Precise.ly, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as React from 'react';
import {Route, Redirect} from 'react-router-dom';

export interface IAuthRouteProps {
    onEnter: () => boolean;
    // tslint:disable-next-line no-any
    component: any;
    path: string;
    redirectTo: string;
    exact?: boolean;
}

export class AuthRoute extends React.Component<IAuthRouteProps> {
    render(): JSX.Element {
        const {onEnter, component, path, redirectTo, exact} = this.props;
        const routeProps = exact ? {path, component, exact} : {path, component};
        
        return onEnter() ? <Route {...routeProps} /> : <Redirect from={path} to={redirectTo} />;
    } 
}