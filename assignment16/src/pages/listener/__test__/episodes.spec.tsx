import { render, waitFor } from '../../../test-utils';
import React from 'react';
import { Episodes, GET_EPISODES_QUERY } from '../episodes';
import { ApolloProvider } from '@apollo/client';
import { act, RenderResult, wait } from '@testing-library/react';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { MockedProvider } from '@apollo/client/testing';

jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom');
  return {
    ...realModule,
    useParams: () => {
      return {
        id: 1,
      };
    },
  };
});

describe('<Episodes />', () => {
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
    });
  });
  it('render loading...', async () => {
    const { getByText } = render(
      <MockedProvider>
        <Episodes />
      </MockedProvider>
    );
    expect(getByText('Loading...')).toBeInTheDocument();
  });
  it('renders OK', async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: GET_EPISODES_QUERY,
              variables: { input: { id: 1 } },
            },
            result: {
              data: {
                getPodcast: {
                  ok: true,
                  error: null,
                  podcast: {
                    id: 1,
                    title: 'Test podcast',
                    description: 'Test podcast description',
                    thumbnailUrl: 'Test thumbnail',
                  },
                },
                getEpisodes: {
                  ok: true,
                  error: null,
                  episodes: [
                    {
                      title: 'Test episode',
                      description: 'Test episode description',
                    },
                  ],
                },
              },
            },
          },
        ]}
        addTypename={false}
      >
        <Episodes />
      </MockedProvider>
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    await waitFor(() =>
      expect(document.title).toBe('Episode List | Nuber-podcasts')
    );
    await waitFor(() => expect(getByText('Test podcast')).toBeInTheDocument());
    await waitFor(() => expect(getByText('Test episode')).toBeInTheDocument());
  });
});
