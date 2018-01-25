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
import {FormControl, Label, Row, Col, Grid} from 'react-bootstrap';
import {setLength} from 'src/actions/demoAction';
import {store} from 'src/store';
import {InputProps} from 'src/containers/demo/interfaces';
import {DemoQuery} from 'src/containers/demo/queries';
import {getLength} from 'src/containers/demo/selectors';

export interface IDemoProps {
    data?: {getRandomList: {list: number[]}};
}

class DemoImpl extends React.Component<ChildProps<InputProps, Response> & IDemoProps> {

    fetchRandomNumbers = (e: React.ChangeEvent<EventTarget>): void => {
        if (e.target[`value`]) {
            store.dispatch(setLength(parseInt(e.target[`value`], 10)));
        }
    }

    renderList = (): JSX.Element => {
        const {data} = this.props;

        if (!data || !data.getRandomList || !data.getRandomList.list || !data.getRandomList.list.length) {
            return null;
        }

        return (
            <Row>
                <Col xs={12} style={{backgroundColor: '#c1c1c1', wordWrap: 'break-word'}}>
                    {JSON.stringify(data.getRandomList.list)}
                </Col>
            </Row>
        );
    }

    render() {
        return (
            <Grid>
                <h3 style={{textAlign: 'center'}}>You have successfully configured the boilerplate.</h3>
                <br/>
                <Row>
                    <Col xs={4} style={{marginTop: '-3px', fontSize: '24px'}}>
                        <Label>Enter random number length: </Label>
                    </Col>
                    <Col xs={3}>
                        <FormControl type="number" onChange={this.fetchRandomNumbers} value={this.props.length} />
                    </Col>
                </Row>
                <br/>
                {this.renderList()}
            </Grid>
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
