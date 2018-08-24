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

const ComponentMap = transform<React.StatelessComponent, React.StatelessComponent>(components, (result, value, key) => {
  result[key.toLowerCase()] = value;
});

export const SmartReport: React.StatelessComponent = (props: any) => { // tslint:disable-line no-any
  const elements: any[] = props.elements;

  return <div>{elementsToReact(elements)}</div>;
};

function elementsToReact(elements: any[]) {
  return elements.map((elt: any) => {
    if (elt.type === 'text') {
      return textElementToReact(elt);
    }

    if (elt.type === 'tag') {
      return tagElementToReact(elt);
    }

    throw new Error(`Unexpected content ${JSON.stringify(elt)}`);
  });
}

function textElementToReact(elt: any): React.ReactElement<any> {
  return <div dangerouslySetInnerHTML={{__html: elt.blocks.join('')}} />;
}

function tagElementToReact(elt: any): React.ReactElement<any> {
  const TagName = ComponentMap[elt.name];

  if (!TagName) {
    throw new Error(`Invalid tag ${elt.name} encountered`);
  }

  return <TagName {...elt.attrs}>{elementsToReact(elt.children)}</TagName>;
}
