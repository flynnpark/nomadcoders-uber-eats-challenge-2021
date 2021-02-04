import { ApolloProvider } from '@apollo/client';
import { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import React from 'react';
import { render, waitFor } from '../../test-utils';
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from '../create-account';

const mockPush = jest.fn();

jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom');
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe('<CreateAccount />', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });
  it('renders OK', async () => {
    await waitFor(() =>
      expect(document.title).toBe('Create Account | Nuber-podcasts')
    );
  });
  it('renders validation errors', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/E-mail/i);
    const password = getByPlaceholderText(/Password/i);
    const confirm = getByPlaceholderText(/Confirm/i);
    await waitFor(() => {
      userEvent.type(email, 'wont@work');
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/Email address invalid/i);
    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/Email is required!/i);
    await waitFor(() => {
      userEvent.type(email, 'test@test.com');
      userEvent.type(password, '123');
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(
      /Password must be more than 10 characters/i
    );
    await waitFor(() => {
      userEvent.clear(password);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/Password is required!/i);
    await waitFor(() => {
      userEvent.type(password, '1234567890');
      userEvent.type(confirm, '123');
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/Password not matched/i);
  });
  it('renders button enabled', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/E-mail/i);
    const password = getByPlaceholderText(/Password/i);
    const confirm = getByPlaceholderText(/Confirm/i);
    const button = getByRole('button');
    await waitFor(() => {
      userEvent.type(email, 'test@test.com');
      userEvent.type(password, '1234567890');
      userEvent.type(confirm, '1234567890');
    });
    expect(button).not.toBeDisabled();
  });
  it('submits form and calls mutation', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/E-mail/i);
    const password = getByPlaceholderText(/Password/i);
    const confirm = getByPlaceholderText(/Confirm/i);
    const formData = {
      email: 'test@test.com',
      password: '1234567890',
      confirm: '1234567890',
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: 'mutationError',
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedMutationResponse
    );
    jest.spyOn(window, 'alert').mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.type(confirm, formData.confirm);
      userEvent.type(confirm, '{enter}');
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
      },
    });
    expect(window.alert).toHaveBeenCalledWith('Account Created! Log in now!');
    const mutationError = getByRole('alert');
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mutationError).toHaveTextContent('mutation-error');
  });
});
