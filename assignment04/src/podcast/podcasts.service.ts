import { Injectable } from '@nestjs/common';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { CoreOutput } from './dtos/output.dto';
import {
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
} from './dtos/podcast.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
  ) {}

  getAllPodcasts(): Promise<Podcast[]> {
    return this.podcasts.find({ relations: ['episodes'] });
  }

  async createPodcast({
    title,
    category,
  }: CreatePodcastDto): Promise<CoreOutput> {
    const newPodcast = this.podcasts.create({ title, category });
    await this.podcasts.save(newPodcast);
    return {
      ok: true,
    };
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    const podcast = await this.podcasts.findOne({
      where: { id },
      relations: ['episodes'],
    });
    if (!podcast) {
      return {
        ok: false,
        error: `${id} id podcast doesn't exist!`,
      };
    }
    return {
      ok: true,
      podcast,
    };
  }

  async deletePodcast(id: number): Promise<CoreOutput> {
    const { ok, error, podcast } = await this.getPodcast(id);
    if (!ok) {
      return { ok, error };
    }
    await this.podcasts.delete(podcast);
    return {
      ok: true,
    };
  }

  async updatePodcast({ id, ...rest }: UpdatePodcastDto): Promise<CoreOutput> {
    const { ok, error } = await this.getPodcast(id);
    if (!ok) {
      return { ok, error };
    }
    await this.podcasts.update(id, rest);
    return { ok };
  }

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    const { ok, error, podcast } = await this.getPodcast(podcastId);
    if (!ok) {
      return { ok, error };
    }
    return { ok: true, episodes: podcast.episodes };
  }

  async createEpisode({
    id: podcastId,
    title,
    category,
  }: CreateEpisodeDto): Promise<CoreOutput> {
    const { podcast, ok, error } = await this.getPodcast(podcastId);
    if (!ok) {
      return { ok, error };
    }
    const newEpisode = this.episodes.create({ title, category, podcast });
    await this.episodes.save(newEpisode);

    return { ok: true };
  }

  async deleteEpisode({
    podcastId,
    episodeId,
  }: EpisodesSearchInput): Promise<CoreOutput> {
    const { podcast, error, ok } = await this.getPodcast(podcastId);
    if (!ok) {
      return { ok, error };
    }
    const episode = await this.episodes.findOne({ id: episodeId, podcast });
    if (!episode) {
      return {
        ok: false,
        error: `${episodeId} id episode doesn't exist!`,
      };
    }

    await this.episodes.delete({ id: episodeId, podcast });

    return { ok: true };
  }

  async updateEpisode({
    podcastId,
    episodeId,
    ...rest
  }: UpdateEpisodeDto): Promise<CoreOutput> {
    const { podcast, error, ok } = await this.getPodcast(podcastId);
    if (!ok) {
      return { ok, error };
    }
    const episode = await this.episodes.findOne({ id: episodeId, podcast });
    if (!episode) {
      return {
        ok: false,
        error: `${episodeId} id episode doesn't exist!`,
      };
    }
    await this.episodes.update({ id: episodeId, podcast }, rest);
    return { ok: true };
  }
}
