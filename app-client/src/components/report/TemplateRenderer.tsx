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
import {Genotypes} from 'src/containers/report/interfaces';

const {Renderer} = require('markdown-components');
const streams = require('memory-streams'); 

export interface TemplateRendererProps {
  parsedContent: string;
  userData: Genotypes;
}

const renderer = new Renderer({
  components: {GenotypeCase, UserGenotypeSwitch}
});

export const TemplateRenderer: React.StatelessComponent<TemplateRendererProps> = props => {
  const {parsedContent, userData} = props;
  const stream = new streams.WritableStream();
  renderer.write(parsedContent, {userData}, stream);

  return <div dangerouslySetInnerHTML={{__html: stream}} />;
};
