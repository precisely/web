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

## Roles

Users may be associated with one or more roles. Current roles are `user`, `admin`, and `author`. The accesscontrol-plus library is used to map roles to permissions, and the `GraphQLContext` class provides a convenient way of guarding access to GraphQL queries, mutations and fields. 

User roles are stored in Auth0 app_metadata under the `"roles"` key as a comma delimited string. This value is copied into the JWKS token returned by Auth0 under the key `"https://precise.ly/roles"`. This is performed by a custom Auth0 rule "Copy App Metadata Roles to idToken". If no `"roles"` key is found in the user's app_metadata, the `"user"` role is assumed. 

Currently, the only means provided for changing a user's role is via the [Auth0 user management interface](https://manage.auth0.com/#/users ). Simply find the user and update their app_metadata. For example, by setting app_metadata to `{ "roles": "user,author" }`, you are granting a user both the `"user"` and `"author"` role.