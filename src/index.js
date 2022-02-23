import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  ApolloClient,
  gql,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://glowing-owl-94.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret':
      'adKSrtBAg0mbJa5aABAY0v40cXvOcXo6MTUU8BO73EGQMfNUF5mT5ltEoKGEYouk',
  },
});

// client
//   .query({
//     query: gql`
//       query getTodos {
//         todos {
//           done
//           id
//           text
//         }
//       }
//     `,
//   })
//   .then((result) => console.log(result));

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
