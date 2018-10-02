/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import {ShallowWrapper, shallow, configure} from 'enzyme';
import {Input} from 'src/features/common/ReusableComponents';
import {Email, EmailProps} from 'src/features/common/Email';
import {CSS} from 'src/interfaces';

configure({adapter: new Adapter()});

describe('Email tests.', () => {

  const handleChange = jest.fn();

  const getComponentTree = (style?: CSS): ShallowWrapper<EmailProps> => shallow(
    <Email placeholder="email" value="test@example.com" onChange={handleChange} style={style}/>
  );

  it('should render the input element', () => {
    const componentTree: ShallowWrapper<EmailProps> = getComponentTree();
    expect(componentTree.find(Input).length).toBe(1);
  });

  it('should render the component with the style provided as a prop.', () => {
    const sampleStyle: CSS = {width: '100%'};
    const componentTree: ShallowWrapper<EmailProps> = getComponentTree(sampleStyle);
    expect(componentTree.props().style).toEqual(sampleStyle);
  });
});
