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

const errorTextStyle: React.CSSProperties = {
  textAlign: 'center',
  textShadow: '-1px 1px #FFF',

};

const linkStyle: React.CSSProperties = {
  textDecorationLine: 'underline'
};

@Radium
export class ErrorView extends React.Component<{error: DisplayError}> {

  render() {
    return (
      <div style={{display: 'inline'}}>
        <h1 style={errorTextStyle}>{this.props.error.message}</h1>
        <h3 style={errorTextStyle}>{this.props.error.description}</h3>
        <div style={{textAlign: 'center'}}>{this.renderResolution()}</div>
      </div>
    );
  }

  renderResolution()  {
    if (this.props.error.resolution) {
      const { url, text} = this.props.error.resolution.link;
      return <a style={linkStyle} href={url}>{text}</a>;
    } else {
      return <a style={linkStyle} href="/">back to home page</a>;
    }
    return null;
  }

}
