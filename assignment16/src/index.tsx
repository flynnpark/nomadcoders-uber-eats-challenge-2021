import { render } from 'react-dom';

import App from './App';
import { ApolloProvider } from '@apollo/client';
import './styles/styles.css';
import { client } from './apollo';

const rootElement = document.getElementById('root');
render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  rootElement
);
