import { APIGatewayEvent, Context as LambdaContext } from 'aws-lambda';

// This is the third argument to every GraphQL resolver
export class ResolverContext {
  readonly lambdaContext: LambdaContext;
  readonly event: APIGatewayEvent;

  constructor(event: APIGatewayEvent, lambdaContext: LambdaContext) {
    this.lambdaContext = lambdaContext;
    this.event = event;
  }

  get cognitoUserId(): string {
    const authorizer: { claims?: { sub: string }} = this.event.requestContext.authorizer;
    return authorizer.claims.sub;
  }
}
