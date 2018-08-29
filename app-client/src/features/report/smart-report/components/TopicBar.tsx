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

