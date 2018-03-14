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
import {Input} from 'src/components/ReusableComponents';
import {Email} from 'src/components/Email';

configure({adapter: new Adapter()});

describe('Email tests.', () => {

  const handleChange = jest.fn();

  const componentTree: ShallowWrapper =
      shallow(<Email placeholder="email" value="test@example.com" onChange={handleChange} />);

  it('should render the input element', () => {
    expect(componentTree.find(Input).length).toBe(1);
  });
});
