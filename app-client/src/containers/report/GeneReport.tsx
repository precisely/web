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
import {graphql, OptionProps} from 'react-apollo';
import {NavigationBar} from 'src/components/navigationBar/NavigationBar';
import {Container} from 'src/components/ReusableComponents';
import {PageContent} from 'src/components/PageContent';
import {header} from 'src/constants/styleGuide';
import {GetReport} from 'src/containers/report/queries';
import {isLoading} from 'src/containers/report/selectors';
import {store} from 'src/store';
import {setLoadingState, setReportData} from 'src/containers/report/actions';
import {ReportList} from 'src/containers/report/interfaces';

export interface GeneReportProps extends RouteComponentProps<void> {
    isLoading: boolean;
}

export class GeneReportImpl extends React.Component<GeneReportProps> {

    componentWillMount(): void {
        store.dispatch(setLoadingState());
    }

    /**
     * This is dummy container to fetch the results from the Report. 
     * The actual implementation will be added in the next PR.
     */
    render(): JSX.Element {
        return (
            <div>
                <NavigationBar {...this.props}/>
                <Container className="mx-auto mt-5 mb-5">
                    <h1 className="mt-5 mb-4" style={header}>Report data</h1>
                    <PageContent>
                        {this.props.isLoading ? 'Fetching the data. Plesae wait...' : 'Data fetched.'}
                    </PageContent>
                </Container>
            </div>
        );
    }
}

// TODO Figure out correct types for the exported component.
// tslint:disable-next-line
const withGeneReport = graphql<any, any>(GetReport, {
    options: () => ({
        // Dummy parameters to fetch the data.
        variables: {slug: 'demo', userId: 'test-id', vendorDataType: 'precisely:demo'}
    }),
    props: (props: OptionProps<void, {report: ReportList}>): void => {
        if (props.data.report) {
            store.dispatch(setReportData(props.data.report));
        }
    }
});

const mapStateToProps: Selector<Map<string, Object>, {isLoading: boolean}> = createStructuredSelector({
    isLoading: isLoading(),
});

// TODO Figure out correct types for the exported component.
// tslint:disable-next-line
export const GeneReport: any = connect(mapStateToProps)(withGeneReport(GeneReportImpl));
