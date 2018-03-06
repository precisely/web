/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {connect} from 'react-redux';
import {createStructuredSelector, Selector} from 'reselect';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {Container} from 'src/components/ReusableComponents';
import {PageContent} from 'src/components/PageContent';
import {header} from 'src/constants/styleGuide';
import {graphql} from 'react-apollo';
import {GetReport} from 'src/containers/report/queries';
import {isLoading} from 'src/containers/report/selectors';
import {store} from 'src/store';
import {setLoadingState} from 'src/containers/report/actions';

export class ViewReportImpl extends React.Component<RouteComponentProps<void> & {isLoading: boolean}> {

    componentWillMount(): void {
        store.dispatch(setLoadingState());
    }

    /**
     * This is dummy container to fetch the results from the Report. 
     * The actual Implementation will be added in the next PR.
     */
    render(): JSX.Element {
        return (
            <div>
                <NavigationBar {...this.props}/>
                <Container className="mx-auto mt-5 mb-5">
                    <h1 className="mt-5 mb-4" style={header}>Dashboard</h1>
                    <PageContent>
                        Loading...
                    </PageContent>
                </Container>
            </div>
        );
    }
}

// tslint:disable
const withViewReport = graphql<Response, any>(GetReport, {
    options: () => ({
        variables: {slug: 'demo', userId: 'test-id', vendorDataType: 'precisely:demo'}
    })
});

const mapStateToProps: Selector<Map<string, Object>, any> = createStructuredSelector({
    isLoading: isLoading(),
});

export const ViewReport = connect(mapStateToProps)(withViewReport(ViewReportImpl));
