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

export interface PageContentProps {
  children: React.ReactNode;
  style?: CSS;
}

export let PageContent: React.StatelessComponent<PageContentProps> = props => (
  <Row style={[content, props.style]} className="p-5 mx-auto">
    <Col style={formColumn}>
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
  boxShadow: '0 2px 29px -8px rgba(192, 79, 127, 0.51)',
};
