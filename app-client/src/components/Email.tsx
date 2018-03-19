/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {Input} from 'src/components/ReusableComponents';
import {CSS} from 'src/interfaces';
import {removeBorderRadius, inputStyle} from 'src/constants/styleGuide';

export interface EmailProps {
  placeholder?: string;
  style?: CSS;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export let Email: React.StatelessComponent<EmailProps> = props => (
  <Input
      style={[removeBorderRadius, inputStyle] || props.style}
      type="email"
      id="email"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
  />
);

Email = Radium(Email);
