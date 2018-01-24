/*
* Copyright (c) 2011-Present, CauseCode Technologies Pvt Ltd, India.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import lambdaPlayground from 'graphql-playground-middleware-lambda';
import {Handler, Context, Callback, APIGatewayEvent} from 'aws-lambda';
import {graphqlLambda, graphiqlLambda, LambdaHandler } from 'apollo-server-lambda';
import { ITypeDefinitions } from 'graphql-tools/dist/Interfaces';
import {makeExecutableSchema } from 'graphql-tools';
import {resolvers} from './resolvers/';

const typeDefs: ITypeDefinitions = require('./schemas/index.graphql');

const myGraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
    logger: console,
});

export const graphqlHandler: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const handler: LambdaHandler = graphqlLambda({ schema: myGraphQLSchema, tracing: true });
    return handler(event, context, callback);
};

// for local endpointURL is /graphql and for prod it is /stage/graphql
export const playgroundHandler: ((event: APIGatewayEvent, context: Context, callback: Callback) => void)
        = lambdaPlayground({

    endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT || '/production/graphql',
});

export const graphiqlHandler: ((event: APIGatewayEvent, context: Context, callback: Callback) => void) 
        = graphiqlLambda({
            
    endpointURL: process.env.REACT_APP_GRAPHQL_ENDPOINT || '/production/graphql',
});
