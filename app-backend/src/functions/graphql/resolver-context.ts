import { APIGatewayEvent, Context as LambdaContext } from 'aws-lambda';

export type ExtendedAuthorizer = {
  claims?: {
    sub: string;
    dataBridge: { [key: string]: string }
  }
};

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

  opaqueId(key: string) {
    const authorizer: ExtendedAuthorizer = this.event.requestContext.authorizer;
    return authorizer.claims.dataBridge && authorizer.claims.dataBridge[key];
  }
}
