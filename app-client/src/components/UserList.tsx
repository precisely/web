import * as React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import User from './User';

export interface IUserListProps {
    loading: boolean;
    error: {message: string};
    // tslint:disable-no-any
    getRandomList: any
}

const UserList = (props: any): JSX.Element => {

    const {loading, error, getRandomList} = props;

    if(loading) {
        return <p>Loading ...</p>;
    }

    if(error) {
        return <p>{error.message}</p>;
    }

    return (
        <div>
            success
            <User key={getRandomList.name} user={getRandomList}/>
        </div>
    );
}

export const UserQuery = gql`
    query {
        getRandomList(length: 1) {
            list
        }
    }
`;

export default graphql(UserQuery, {
        options: {},
        props: ({data, ownProps}): any => ({...data, ownProps})
    }
)(UserList);
