import { ApolloProvider } from '@apollo/client';
import { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import React from 'react';
import { render, waitFor } from '../../test-utils';
import { Login, LOGIN_MUTATION } from '../login';

describe('<Login />', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      );
    });
  });
  it('renders OK', async () => {
    await waitFor(() => expect(document.title).toBe('Log In | Nuber-podcasts'));
  });
  it('displays email validation errors', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/E-mail/i);
    await waitFor(() => {
      userEvent.type(email, 'this@wont');
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);
    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/Email is required!/i);
  });
  it('renders password validation errors', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/E-mail/i);
    const password = getByPlaceholderText(/Password/i);
    const button = getByRole('button');
    await waitFor(() => {
      userEvent.type(email, 'test@test.com');
      userEvent.type(password, '12');
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(
      /Password must be more than 10 characters/i
    );
    await waitFor(() => {
      userEvent.clear(password);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/Password is required!/i);
  });
  it('renders button enabled', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/E-mail/i);
    const password = getByPlaceholderText(/Password/i);
    const button = getByRole('button');
    await waitFor(() => {
      userEvent.type(email, 'test@test.com');
      userEvent.type(password, '1234567890');
    });
    expect(button).not.toBeDisabled();
  });
  it('submits form and calls mutation', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/E-mail/i);
    const password = getByPlaceholderText(/Password/i);
    const button = getByRole('button');
    const formData = {
      email: 'test@test.com',
      password: '1234567890',
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: 'test',
          error: 'mutationError',
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    jest.spyOn(Storage.prototype, 'setItem');
    const logSpy = jest.spyOn(console, 'log');
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.type(password, '{enter}');
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/mutationError/i);
    expect(localStorage.setItem).toHaveBeenCalledWith('nuber-potcasts-token', 'test');
  });
});
