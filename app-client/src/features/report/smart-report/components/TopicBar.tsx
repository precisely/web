/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
 * @Author: Aneil Mallavarapu
 * @Date: 2018-10-16 09:49:01
 * @Last Modified by: Aneil Mallavarapu
 * @Last Modified time: 2018-10-16 09:49:42
 */

import * as React from 'react';
import { isBoolean } from 'util';

export const TopicBar: React.StatelessComponent = (keys: any) => {
  const icons = [];
  for (const key in keys) {
    if (keys.hasOwnProperty(key) && isBoolean(keys[key])) {
      icons.push(key);
    }
  }
  return <p>TopicBar with icons for {icons.join(', ')} goes here</p>;
};

