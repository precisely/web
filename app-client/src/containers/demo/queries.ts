import gql from 'graphql-tag';

export const DemoQuery = gql`
    query GetCharacter($length: Int!) {
        getRandomList(length: $length) {
            length
            list
            sum
        }
    }
`;
