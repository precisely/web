import gql from 'graphql-tag';

export const DemoQuery = gql`
    query GetGeneticsData($opaqueId: String!, $gene: String!) {
        getGeneticsData(opaqueId: $opaqueId, gene: $gene) {
            gene,
            source
        }
    }
`;
