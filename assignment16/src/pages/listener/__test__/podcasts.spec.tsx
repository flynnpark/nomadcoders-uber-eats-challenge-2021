import { ApolloProvider } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { RenderResult } from '@testing-library/react';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import React from 'react';
import { render, waitFor } from '../../../test-utils';
import { Podcasts, ALLPODCASTS_QUERY } from '../podcasts';

describe('<Podcasts />', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Podcasts />
        </ApolloProvider>
      );
    });
  });
  it('renders OK', async () => {
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ALLPODCASTS_QUERY,
              },
              result: {
                data: {
                  getAllPodcasts: {
                    ok: true,
                    error: 'queryError',
                    podcasts: [
                      {
                        id: 1,
                        title: 'Test title',
                        category: 'Test category',
                        thumbnailUrl: 'Test',
                        description: 'Test',
                        rating: 3,
                      },
                    ],
                  },
                },
              },
            },
          ]}
        >
          <Podcasts />
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      await waitFor(() => expect(document.title).toBe('Home | Nuber-podcasts'));
      getByText('Test category');
    });
  });
});
