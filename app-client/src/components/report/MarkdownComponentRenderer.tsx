/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import {UserGenotypeSwitch} from 'src/components/report/UserGenotypeSwitch';
import {GenotypeCase} from 'src/components/report/GenotypeCase';
import {UserData} from 'src/containers/report/interfaces';

const {Renderer} = require('markdown-components');
const streams = require('memory-streams'); 

export interface MarkdownComponentRendererProps {
  parsedContent: string;
  userData: UserData;
}

const renderer = new Renderer({
  components: {GenotypeCase, UserGenotypeSwitch}
});

export const MarkdownComponentRenderer: React.StatelessComponent<MarkdownComponentRendererProps> = props => {
  let {parsedContent, userData} = props;
  const stream = new streams.WritableStream();
  parsedContent = JSON.parse(parsedContent);

  renderer.write(parsedContent, {userData}, stream);

  return <div dangerouslySetInnerHTML={{__html: stream}} />;
};
