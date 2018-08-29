/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as components from './components';
import { transform } from 'lodash';

const ComponentMap = transform<React.StatelessComponent, React.StatelessComponent>(
  components,
  (result, value, key) => {
    result[key.toLowerCase()] = value;
  }
);

export const SmartReport: React.StatelessComponent<{ elements: any[]}> = (
  { elements }
) => { // tslint:disable-line no-any
  const result = <div>{...elementsToReact(elements, 'smart-report')}</div>;
  return result;
};

function elementsToReact(elements: any[], parentKey: string) {
  let index = 0;
  const result = elements.map((elt: any) => {
    const key = `${parentKey}.${index}`;
    index += 1;
    if (elt.type === 'text') {
      return textElementToReact(elt, key);
    }

    if (elt.type === 'tag') {
      return tagElementToReact(elt, key);
    }

    throw new Error(`Unexpected content ${JSON.stringify(elt)}`);
  });
  return result;
}

function textElementToReact(elt: any, key: string): React.ReactElement<any> {
  return <div key={key} dangerouslySetInnerHTML={{__html: elt.blocks.join('')}} />;
}

function tagElementToReact(elt: any, key: string): React.ReactElement<any> {
  const TagName = ComponentMap[elt.name];
  const childKey = `${key}.${elt.name}`;
  if (!TagName) {
    return <div><p>{'<'}{elt.rawName}{'>'} not implemented: {JSON.stringify(elt)}</p></div>;
  }

  return <TagName key={key} {...elt.attrs}>{elementsToReact(elt.children, childKey)}</TagName>;
}
