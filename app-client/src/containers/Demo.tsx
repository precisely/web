/*
 * Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
// import {connect} from 'react-redux';
import {graphql, ChildProps} from 'react-apollo';
import gql from 'graphql-tag';
// import {fetchData} from '../actions';
// import {store} from '../store';

export interface IDemoProps {
    data?: Object;
}

type List = {
    length: number;
    list: number[];
    sum: number;
};

type Response = {
    getRandomList: List;
};

type InputProps = {
    length: number;
};

class DemoImpl extends React.Component<ChildProps<InputProps, Response>> {
    render() {
        const {data = {getRandomList: {list: [1, 2]}}} = this.props;

        return (
            <div className="App">
                <h1>The list generated is:{JSON.stringify(data)}</h1>
            </div>
        );
    }
}

export const DemoQuery = gql`
    query GetCharacter($length: Int!) {
        getRandomList(length: $length) {
            length
            list
            sum
        }
    }
`;

const withDemo = graphql<Response, InputProps>(DemoQuery, {
    options: ({ length }) => ({
        variables: { length: 10 }
    })
});

export const Demo = withDemo(DemoImpl);
