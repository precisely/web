import { APIGatewayEvent, Context as LambdaContext } from 'aws-lambda';
import { IResolverObject } from 'graphql-tools';
import {Item} from 'src/db/dynamo/dynogels';

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
    return this.event.requestContext.authorizer.principalId; // the auth0 userId "auth0|a6b34ff91"
  }
}

export function dynamoFieldResolver<T>(fields: (keyof T)[]): IResolverObject {
  let resolver = {};
  for (const field of fields) {
    resolver[<string> field] = (obj: Item<T>) => obj.get(field);
  }
  return resolver;
}
