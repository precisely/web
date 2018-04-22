// required to enable import of .graphql files
// see https://github.com/apollographql/graphql-tag/issues/59#issuecomment-302393028

declare module '*.graphql' {
  import {DocumentNode} from 'graphql';

  const value: DocumentNode;
  export default value;
}