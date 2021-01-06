import { Injectable } from '@nestjs/common';
import { GetAllPodcastsResponse } from './dtos/all-podcasts.dto';
import {
  CreateEpisodeDto,
  CreateEpisodeResponse,
} from './dtos/create-episode.dto';
import {
  CreatePodcastDto,
  CreatePodcastResponse,
} from './dtos/create-podcast.dto';
import { DeleteEpisodeInput } from './dtos/delete-episode.dto';
import { DeletePodcastResponse } from './dtos/delete-podcast.dto';
import { GetEpisodeInput, GetEpisodeResponse } from './dtos/get-episode.dto';
import { GetEpisodesResponse } from './dtos/get-episodes.dto';
import { GetPodcastResponse } from './dtos/get-podcast.dto';
import {
  UpdateEpisodeDto,
  UpdateEpisodeResponse,
} from './dtos/update-episode.dto';
import {
  UpdatePodcastDto,
  UpdatePodcastResponse,
} from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';

@Injectable()
export class PodcastsService {
  private podcasts: Podcast[] = [];

  getAllPodcasts(): GetAllPodcastsResponse {
    return { podcasts: this.podcasts, err: null };
  }

  createPodcast({ title, category }: CreatePodcastDto): CreatePodcastResponse {
    const id = Date.now();
    this.podcasts.push({ id, title, category, rating: 0, episodes: [] });
    return { id, err: null };
  }

  getPodcast(id: number): GetPodcastResponse {
    const foundPodcasts = this.podcasts.filter((podcast) => podcast.id === id);
    if (foundPodcasts.length === 0) {
      return { podcast: null, err: 'Podcast not found.' };
    }
    if (foundPodcasts.length === 1) {
      return { podcast: foundPodcasts[0], err: null };
    }
    if (foundPodcasts.length > 2) {
      return { podcast: null, err: 'More than one items with same id.' };
    }
  }

  deletePodcast(id: number): DeletePodcastResponse {
    this.podcasts = this.podcasts.filter((p) => p.id !== +id);
    return { err: null };
  }

  updatePodcast({
    id,
    ...updatePodcastDto
  }: UpdatePodcastDto): UpdatePodcastResponse {
    const { podcast, err: findErr } = this.getPodcast(id);
    if (findErr) {
      return { err: findErr };
    }
    const { err: deleteErr } = this.deletePodcast(id);
    if (deleteErr) {
      return { err: deleteErr };
    }
    this.podcasts.push({ ...podcast, ...updatePodcastDto });
    return { err: null };
  }

  getEpisodes(podcastId: number): GetEpisodesResponse {
    const { podcast, err } = this.getPodcast(podcastId);
    if (err) {
      return { episodes: null, err };
    }
    return { episodes: podcast.episodes, err: null };
  }

  createEpisode({
    podcastId,
    title,
    category,
  }: CreateEpisodeDto): CreateEpisodeResponse {
    const { podcast, err: findErr } = this.getPodcast(podcastId);
    if (findErr) {
      return { episodeId: null, err: findErr };
    }
    const episodeId = Date.now();
    const newEpisode: Episode = { id: episodeId, title, category, rating: 0 };
    const { err } = this.updatePodcast({
      ...podcast,
      episodes: [...podcast.episodes, newEpisode],
    });
    if (err) {
      return { episodeId: null, err };
    }
    return { episodeId, err: null };
  }

  deleteEpisode({
    podcastId,
    episodeId,
  }: DeleteEpisodeInput): { err: string | null } {
    const { podcast, err: findErr } = this.getPodcast(podcastId);
    if (findErr) {
      return { err: findErr };
    }
    const { err } = this.updatePodcast({
      ...podcast,
      episodes: podcast.episodes.filter((episode) => episode.id !== +episodeId),
    });
    if (err) {
      return { err };
    }
    return { err: null };
  }

  getEpisode({ podcastId, episodeId }: GetEpisodeInput): GetEpisodeResponse {
    const { episodes, err: findErr } = this.getEpisodes(podcastId);
    if (findErr) {
      return { episode: null, err: findErr };
    }
    const episode = episodes.find((episode) => episode.id === +episodeId);
    if (!episode) {
      return { episode: null, err: 'Episode not found' };
    }
    return { episode, err: null };
  }

  updateEpisode({
    podcastId,
    episodeId,
    ...updateEpisodeDto
  }: UpdateEpisodeDto): UpdateEpisodeResponse {
    const { episode, err: getEpisodeErr } = this.getEpisode({
      podcastId,
      episodeId,
    });
    if (getEpisodeErr) {
      return { err: getEpisodeErr };
    }
    const { err: deleteErr } = this.deleteEpisode({ podcastId, episodeId });
    if (deleteErr) {
      return { err: deleteErr };
    }
    const { podcast, err: fundPodcastErr } = this.getPodcast(podcastId);
    if (fundPodcastErr) {
      return { err: fundPodcastErr };
    }
    this.updatePodcast({
      ...podcast,
      episodes: [...podcast.episodes, { ...episode, ...updateEpisodeDto }],
    });
    return { err: null };
  }
}
