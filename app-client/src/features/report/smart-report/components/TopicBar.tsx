/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
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

