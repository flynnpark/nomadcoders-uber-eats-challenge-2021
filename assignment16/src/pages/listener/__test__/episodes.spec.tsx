import { render, waitFor } from "../../../test-utils";
import React from "react";
import { Episodes } from "../episodes";
import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";

describe("<Episodes />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Episodes />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {});
});
