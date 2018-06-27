# GraphQL service

This directory contains the handler for the GraphQL api endpoint.

## GraphQLContext

The GraphQL handler generates a context object ([`GraphQLContext`](graphql-context.ts)), which is passed as the context argument to GraphQL resolver functions. The GraphQLContext contains helpful information like `userId` and `roles` and provides a method for testing whether the current user can perform an action.

Resolvers can test whether access is permitted by using the `GraphQLContext.can(scope, resource)` method, or the `@scope` decorator.

```typescript
import {accessControl} from 'access-control';
accessControl
  .grant('user')
    .resource('Report')
      .action('read').fields()
      .action('update').where(userIsOwner).withConstraint()
      .action('delete').where(userIsOwner).withConstraint(ensureOwnerIdIsUserId);

class ReportResolver {
  @scope('admin', 'Report:read')
  id(report: Report, args: any, context: GraphQLContext) {
    ...
  }
}
```




