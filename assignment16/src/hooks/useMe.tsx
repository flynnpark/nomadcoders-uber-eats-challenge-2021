import { gql, useQuery } from '@apollo/client';
import { meQuery } from '../__type_graphql__/meQuery';

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
    }
  }
`;

export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY);
};
