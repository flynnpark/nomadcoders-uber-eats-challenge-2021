import { gql, useQuery } from '@apollo/client';
import PodcastItem from '../components/PodcastItem';
import { getAllPodcasts } from '../__generated__/getAllPodcasts';

const GET_PODCASTS_QUERY = gql`
  query getAllPodcasts {
    getAllPodcasts {
      ok
      error
      podcasts {
        id
        createdAt
        updatedAt
        title
        category
        rating
      }
    }
  }
`;

export default function Home() {
  const { data, loading } = useQuery<getAllPodcasts>(GET_PODCASTS_QUERY);

  return (
    <div className="h-screen flex justify-center bg-gray-800">
      <div className="w-full max-w-lg pt-7 pb-12 rounded-lg text-center">
        <h3 className="mt-6 text-center text-3xl font-extrabold text-white pb-4">
          Podcasts
        </h3>
        {loading ? (
          <div className="pt-8">
            <h4 className="text-white">Loading...</h4>
          </div>
        ) : (
          <>
            {data?.getAllPodcasts.podcasts?.length ? (
              <>
                {data?.getAllPodcasts.podcasts.map((podcast) => (
                  <PodcastItem key={podcast.id} podcast={podcast} />
                ))}
              </>
            ) : (
              <div className="pt-8">
                <h4 className="text-white">No Podcasts</h4>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
