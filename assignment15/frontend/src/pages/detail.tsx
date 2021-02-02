import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { getPodcast, getPodcastVariables } from '../__generated__/getPodcast';

const GET_PODCAST_QUERY = gql`
  query getPodcast($input: PodcastSearchInput!) {
    getPodcast(input: $input) {
      ok
      error
      podcast {
        id
        createdAt
        updatedAt
        title
        category
        rating
        episodes {
          id
          createdAt
          updatedAt
          title
          category
        }
      }
    }
  }
`;

interface DetailParams {
  id: string;
}

export default function Detail() {
  const { id } = useParams<DetailParams>();

  const { data, loading } = useQuery<getPodcast, getPodcastVariables>(
    GET_PODCAST_QUERY,
    { variables: { input: { id: parseInt(id, 10) } } }
  );

  return (
    <div className="h-screen flex justify-center bg-gray-800">
      <div className="w-full max-w-lg pt-7 pb-12 rounded-lg text-center">
        <h3 className="mt-6 text-center text-3xl font-extrabold text-white pb-4">
          {data?.getPodcast.podcast?.title || 'Podcast'}
        </h3>
        <div className="max-w-4xl px-10 py-6 bg-white rounded-lg shadow-md mb-6">
          {loading ? (
            <div className="pt-8">
              <h4 className="text-white">No Podcasts</h4>
            </div>
          ) : (
            <>{data?.getPodcast.podcast?.category}</>
          )}
        </div>
      </div>
    </div>
  );
}
