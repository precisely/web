import {isEqual} from 'lodash';
import { DataValue } from 'react-apollo';
import { NetworkError, UnknownError, DisplayErrorClasses } from './display-error';
import { GraphQLError } from 'graphql';

type GQLPath = ReadonlyArray<string | number>;

export function checkGraphQLData(data: DataValue<any, any>, ...paths: GQLPath[]): void {
  const error = data && data.error;
  if (error) {
    if (error.networkError) {
      throw new NetworkError();
    }

    checkGraphQLErrors(error.graphQLErrors, paths);
  }
}

function checkGraphQLErrors(graphQLErrors: GraphQLError[], paths: GQLPath[]) {
  for (const gqlError of graphQLErrors) {
    if (pathSelected(gqlError.path, paths)) {
      const name = gqlError.extensions &&  gqlError.extensions.name;
      const errorClass = DisplayErrorClasses[name];
      if (errorClass) {
        throw new errorClass({ graphqlError: gqlError });
      } else {
        throw new UnknownError({});
      }
    }
  }
}

function pathSelected(path: GQLPath, paths: GQLPath[]) {
  return paths.length === 0 || paths.some(p => isEqual(path, p));
}

