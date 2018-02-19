/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {CSS} from 'src/interfaces';
import {Row, Col} from 'src/components/ReusableComponents';

export interface IPageContentProps {
    children: React.ReactNode;
}

export let PageContent: React.StatelessComponent<IPageContentProps> = props => (
    <Row style={content} className="p-lg-5 p-sm-1 mx-auto">
        <Col style={formColumn} className="m-5">
            {props.children}
        </Col>
    </Row>
);

PageContent = Radium(PageContent);

const formColumn: CSS = {
    textAlign: 'center',
    padding: 0,
};

const content: CSS = {
    backgroundColor: '#fff',
    boxShadow: '0 1px 15px -4px rgba(192, 79, 127, 0.51)',
};
