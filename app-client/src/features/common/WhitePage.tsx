/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
type CSSProperties = React.CSSProperties;
import {Row, Col} from 'src/features/common/RadiumWrappers';

export interface WhitePageProps {
  children: React.ReactNode;
  style?: CSSProperties;
}

export const WhitePage: React.StatelessComponent<WhitePageProps> = Radium((props: WhitePageProps) => (
  <Row style={{...content, ...props.style}} className="p-5 mx-auto">
    <Col style={formColumn}>
      {props.children}
    </Col>
  </Row>
));

const formColumn: CSSProperties = {
  textAlign: 'center',
  padding: 0,
};

const content: CSSProperties = {
  backgroundColor: '#fff',
  boxShadow: '0 2px 29px -8px rgba(192, 79, 127, 0.51)',
};
