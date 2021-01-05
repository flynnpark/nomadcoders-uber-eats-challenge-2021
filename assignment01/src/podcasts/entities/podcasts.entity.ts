import { Episode } from './episode.entity';

class Podcast {
  id: number;
  title: string;
  category: string;
  rating: number;
  episodes: Episode[];
}

export { Podcast };
