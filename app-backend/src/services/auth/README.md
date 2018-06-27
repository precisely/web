# Authentication and Authorization

## Overview

This directory contains functionality for authentication and authorization.

* [Auth0](auth0.ts) - authenticates users, issues tokens
* [AWS Custom Authorizer](handlers.ts) - verifies Auth0 tokens
* [Roles](roles.ts) and [Scopes](scopes.ts) - control access

## Authentication Flow
Precise.ly uses Auth0 to manage user accounts and authentication.  Users sign up, login and change and reset passwords through Auth0.
On login, Auth0 authenticates a user and issues a token, which the user's browser presents to API gateway.  The custom authorizer in  [handlers.ts](./handlers.ts) verifies the token and determines the user's roles. When the GraphQL API handler is called, the roles (and other information) are available via the event argument passed to the handler: `event.requestContext.authorizer`.  The GraphQL API makes these values available via the [`GraphQLContext` object](./graphql-context.ts), which is passed as the third argument to each resolver.

![Authentication Flow](docs/auth-flow.png)

See [AWS: Output from a custom authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html ).

## Authorization

We use [AccessControlPlus](https://github.com/aneilbaboo/accesscontrol-plus) to define roles and scopes (permissions).

See also the [GraphQLContext](../graphql/README.md) documentation
