import { APIGatewayEvent, Context as LambdaContext } from 'aws-lambda';
import { IResolverObject } from 'graphql-tools';

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

  get userId(): string {
    return this.event.requestContext.authorizer.userId; // the auth0 userId "auth0|a6b34ff91"
  }
}

export function modelFieldsResolver<T>(fields: string[]): IResolverObject {
  let resolver = {};
  for (const field of fields) {
    resolver[field] = (obj: T) => obj[field];
  }
  return resolver;
}
