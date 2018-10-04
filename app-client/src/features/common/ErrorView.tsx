/*
* Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as React from 'react';
import * as Radium from 'radium';
import { GraphQLError } from 'graphql';

@Radium
export class ErrorView extends React.Component<{
  link?: string,
  graphQLErrors: GraphQLError[],
  networkError: Error}
> {

  render() {
    const backClick = () => window.history.back();
    // FIXME: style
    return (
      <div>
        <h1>{this.props.graphQLErrors[0].message}</h1>
        <a onClick={backClick}>Go back</a>
      </div>
    );
  }
}
