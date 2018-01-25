/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector, Selector} from 'reselect';
import {graphql, ChildProps} from 'react-apollo';
import {setLength} from 'src/actions';
import {store} from 'src/store';
import {InputProps} from 'src/containers/demo/interfaces';
import {DemoQuery} from 'src/containers/demo/queries';
import {getLength} from 'src/containers/demo/selectors';

export interface IDemoProps {
    data?: Object;
}

class DemoImpl extends React.Component<ChildProps<InputProps, Response>> {

    componentWillMount(): void {
        store.dispatch(setLength(100));
    }

    render() {
        const {data = {getRandomList: {list: [1, 2]}}} = this.props;

        return (
            <div className="App">
                <h1>The list generated is:{JSON.stringify(data)}</h1>
            </div>
        );
    }
}

const withDemo = graphql<Response, InputProps>(DemoQuery, {
    options: ({ length }) => ({
        variables: { length }
    })
});

const mapStateToProps: Selector<Map<string, Object>, {length: number}> = createStructuredSelector({
    length: getLength(),
});

export const Demo = connect(mapStateToProps)(withDemo(DemoImpl));
