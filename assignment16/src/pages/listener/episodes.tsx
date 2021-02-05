import { gql, useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { PODCAST_FRAGMENT } from '../../fragments';
import {
  getEpisodes,
  getEpisodesVariables,
} from '../../__type_graphql__/getEpisodes';

export const GET_EPISODES_QUERY = gql`
  query getEpisodes($input: PodcastSearchInput!) {
    getPodcast(input: $input) {
      ok
      error
      podcast {
        id
        title
        thumbnailUrl
        description
      }
    }
    getEpisodes(input: $input) {
      ok
      error
      episodes {
        title
        description
      }
    }
  }
`;

interface IEpisodeParams {
  id: string;
}

export const Episodes = () => {
  const params = useParams<IEpisodeParams>();
  const { data, loading, error } = useQuery<getEpisodes, getEpisodesVariables>(
    GET_EPISODES_QUERY,
    {
      variables: {
        input: {
          id: +params.id,
        },
      },
    }
  );

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full px-5 xl:px-0 mx-auto max-w-screen-xl">
      <Helmet>
        <title>Episode List | Nuber-podcasts</title>
      </Helmet>
      <div className="flex justify-center my-8">
        <div className="flex flex-col justify-center px-3 md:px-12 w-3/4">
          <h1 className="text-blue-400 font-semibold text-3xl">
            {data?.getPodcast.podcast?.title}
          </h1>
          <h2 className="py-3 text-md font-light">
            {data?.getPodcast.podcast?.description}
          </h2>
          <Link
            to="/"
            className="border-2 border-blue-400 rounded-full px-4 w-28 text-blue-400 font-semibold hover:bg-blue-400 hover:text-gray-50 transition-colors"
          >
            ↵ Go Back
          </Link>
        </div>
        <div
          style={{
            backgroundImage: `url(${data?.getPodcast.podcast?.thumbnailUrl})`,
          }}
          className="bg-cover w-32 h-32 md:w-48 md:h-48 rounded-md"
        ></div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {data?.getEpisodes.episodes?.map((episode) => (
          <div
            key={episode.title}
            className="w-full border-2 border-blue-400 rounded-lg px-4 md:px-16 py-3 flex justify-between items-center"
          >
            <div className="mr-2 md:mr-8">
              <h2 className="font-semibold font-lg">{episode.title}</h2>
              <h3 className="font-md"> - {episode.description}</h3>
            </div>
            <div>
              <svg
                className="w-12 hover:text-blue-400 transition-colors cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
