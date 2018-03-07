/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */

import * as React from 'react';
import * as Radium from 'radium';
import {UserGenotypeSwitch} from 'src/components/report/UserGenotypeSwitch';
import {GenotypeCase} from 'src/components/report/GenotypeCase';

const {Renderer} = require('markdown-components');

const renderer = new Renderer({
    components: {UserGenotypeSwitch, GenotypeCase}
});

export interface TemplateRendererProps {
    parsedContent: string;
    context: string;
    // tslint:disable-next-line
    stream: any;
}

@Radium
export class TemplateRenderer extends React.Component<TemplateRendererProps> {

    render(): JSX.Element {
        let {parsedContent, context, stream} = this.props;
        renderer.write(parsedContent, context, stream);

        return (
            <div dangerouslySetInnerHTML={stream.toString()}/>
        );
    }
}
