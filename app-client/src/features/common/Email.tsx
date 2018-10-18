/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {Input} from 'src/features/common/RadiumWrappers';
import {removeBorderRadius, inputStyle} from 'src/constants/styles';

type CSSProperties = React.CSSProperties;

export interface EmailProps {
  placeholder?: string;
  style?: CSSProperties;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export let Email: React.StatelessComponent<EmailProps> = props => (
  <Input
      style={props.style || {...removeBorderRadius, ...inputStyle}}
      type="email"
      id="email"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
  />
);

Email = Radium(Email);
