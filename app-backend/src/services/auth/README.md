# Authentication and Authorization

## Overview

This directory contains functionality for authentication and authorization.

* [Auth0](auth0.ts) - authenticates users, issues tokens
* [AWS Custom Authorizer](handlers.ts) - verifies Auth0 tokens
* [Roles](roles.ts) and [Scopes](scopes.ts) - control access
* [GraphQL context object](graphql-context.ts) - wraps authorization functionality for use in GraphQL resolvers

## Authentication Flow
Precise.ly uses Auth0 to manage user accounts and authentication.  Users sign up, login and change and reset passwords through Auth0.
On login, Auth0 authenticates a user and issues a token, which the user's browser presents to API gateway.  The custom authorizer in  [handlers.ts](./handlers.ts) verifies the token and determines the user's roles. When the GraphQL API handler is called, the roles (and other information) are available via the event argument passed to the handler: `event.requestContext.authorizer`.  The GraphQL API makes these values available via the [`GraphQLContext` object](./graphql-context.ts), which is passed as the third argument to each resolver.

![Authentication Flow](docs/auth-flow.png)

See [AWS: Output from a custom authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html ).

## Authorization
During the authentication step, the custom authorizer assigns *roles* such as `admin`, `user` or `public` to the user. Each role is associated with a set of *scopes*. The current user's roles and scopes are available through the resolver's [context](https://graphql.org/learn/execution/#root-fields-resolvers), which will always be a [`GraphQLContext`](graphql-context.ts) instance.

The roles are defined in [roles.ts](roles.ts), and look something like:
```typescript
const RoleScopes = {
  user: compileScopes(
    // these are role scopes
    'Report:read': { state: 'published', public: true },
    'VariantCall:read': { userId: '$userId' },
    ...
  ),
  author: compileScopes(
    ...
  ),
  etc ...
}
```

### Scopes

As hinted in the above example, scopes provide granular access to resources. They are colon-delimited strings structured as `{resource}:{accessType}:{restrictions}`. For example,`Report:write:id=a123456789` provides write access to the report with id `a123456789`.

A user is granted permission to access a resource when one of the scopes granted to the user (the *user scopes*) matches the scope associated the resource (the *resource scope*).

Resources are protected using the `@scoped` decorator. Since decorators can only be applied to class methods, write your resolver methods in the form of a class, and apply the decorator like so:

```typescript
class ReportResolver {
  // this is a resource scope
  @scoped('report:read')
  static id(report: Report) { return report.get('id'); }
  ...
}
```

#### Scope variables

Scope variables allow interpolating values from a context (described below) into a scope.

`${variable}` - interpolates a value from an object, either the resolver context or the resource. This is called the *object interpolation operator*.
`@{variable}` - interpolates the value of a resolver argument. This is only valid for resoure scopes.

##### Tests

Scopes values can be tested in
##### In Role Scopes

Role scope variables are resolved with respect to the current GraphQLContext. For example `Report:write:ownerId=${userId}` produces a scope where `$userId` is substituted with the context's `.userId` property. The resulting scope grants access to all reports owned by the current authenticated user.

##### In Resource Scopes
Resource scope variables are resolved with respect to the resolver's target (the first argument). This is typically a dynogels model. For this reason variables are resolved first with respect to the model instances properties then with respect to its attributes (using `model.get(scopeVariable)`).

For example,
```typescript
class Query {
  @scoped('Report:write:ownerId=@ownerId')
  saveReport(report: Report, {ownerId, title, text, slug})
}




##
