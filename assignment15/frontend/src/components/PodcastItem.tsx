import { useHistory } from 'react-router-dom';
import { getAllPodcasts_getAllPodcasts_podcasts } from '../__generated__/getAllPodcasts';

interface PodcastItemProps {
  podcast: getAllPodcasts_getAllPodcasts_podcasts;
}

export default function PodcastItem({
  podcast: { id, title, category },
}: PodcastItemProps) {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/${id}`);
  };

  return (
    <div
      className="max-w-4xl px-10 py-6 bg-white rounded-lg shadow-md mb-6"
      onClick={handleClick}
    >
      <h3>{title}</h3>
      <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {category}
      </span>
    </div>
  );
}
