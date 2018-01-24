import * as React from 'react';
import UserList from './components/UserList';
import './App.css';

const logo = require('./logo.svg');

import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {Provider} from 'react-redux';

import {store} from './store';

const client = new ApolloClient({
  link: new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_ENDPOINT }),
  cache: new InMemoryCache(),
});

/* fetch data from graphQL server and print on console */
//client.query({ query: gql`{ hello }` }).then(console.log);

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <ApolloProvider client={client}>
                    <div>
                        <div className="App-header">
                            <img src={logo} className="App-logo" alt="logo" />
                            <h2>Serverless GraphQL Apollo </h2>
                        </div>
                        <div className="App-User">
                            <UserList />
                        </div>
                    </div>
                </ApolloProvider>
            </Provider>
        );
    }
}

export default App;
