/*
 * Copyright (c) 2017-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 *
 */

// Analyzes various e
import * as React from 'react';
import Radium from 'radium';
import { DisplayError } from 'src/errors/display-error';


// ErrorView expects one of three types of errors:
//    a JS Error objects (provided as error)
//    GraphQL errors - a JSON array returned in a graphql query
//    Network error - a network error as returned by a graphql query
@Radium
export class ErrorView extends React.Component<{error: DisplayError}> {

  render() {
    return (
      <>
        <h1>{this.props.error.message}</h1>
        <h3>{this.props.error.description}</h3>
        {this.renderResolution()}
      </>
    );
  }

  renderResolution()  {
    if (this.props.error.resolution) {
      const { url, text} = this.props.error.resolution.link;
      return <a href={url}>{text}</a>;
    }
    return null;
  }

}
