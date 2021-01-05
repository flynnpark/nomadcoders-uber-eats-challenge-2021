import { Injectable, NotFoundException } from '@nestjs/common';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcasts.entity';

@Injectable()
class PodcastsService {
  private podcasts: Podcast[] = [];

  getPodcasts(): Podcast[] {
    return this.podcasts;
  }

  createPodcast(podcastData): void {
    const episode = { id: this.podcasts.length + 1, ...podcastData };
    this.podcasts.push(episode);
    return episode;
  }

  getPodcast(podcastId: string): Podcast {
    const podcast = this.podcasts.find((podcast) => podcast.id === +podcastId);
    if (!podcast) {
      throw new NotFoundException(`Podcast with ID ${podcastId} not found`);
    }
    return podcast;
  }

  patchPodcast(podcastId: string, updateData) {
    const podcast = this.getPodcast(podcastId);
    this.deletePodcast(podcastId);
    const updatedPodcast = { ...podcast, ...updateData };
    this.podcasts.push(updatedPodcast);
    return updatedPodcast;
  }

  deletePodcast(podcastId: string) {
    this.getPodcast(podcastId);
    this.podcasts = this.podcasts.filter(
      (podcast) => podcast.id !== +podcastId,
    );
  }

  getEpisodes(podcastId: string): Episode[] {
    const podcast = this.getPodcast(podcastId);
    return podcast.episodes;
  }

  createEpisode(podcastId: string, episodeData) {
    const podcast = this.getPodcast(podcastId);
    this.deletePodcast(podcastId);
    const newEpisode = { id: podcast.episodes.length + 1, ...episodeData };
    podcast.episodes.push(newEpisode);
    this.podcasts.push(podcast);
    return newEpisode;
  }

  getEpisode(podcastId: string, episodeId: string) {
    const podcast = this.getPodcast(podcastId);
    const episode = podcast.episodes.find(
      (episode) => episode.id === +episodeId,
    );
    if (!episode) {
      throw new NotFoundException(
        `Episode with podcast ID ${podcastId} and episode Id ${episodeId} not found`,
      );
    }
    return episode;
  }

  patchEpisode(podcastId: string, episodeId: string, updateData) {
    const podcast = this.getPodcast(podcastId);
    const episode = this.getEpisode(podcastId, episodeId);
    podcast.episodes = podcast.episodes.filter(
      (episode) => episode.id !== +episodeId,
    );
    const updatedEpisode = { ...episode, ...updateData };
    podcast.episodes.push(updatedEpisode);
    this.patchPodcast(podcastId, podcast);
    return updatedEpisode;
  }

  deleteEpisode(podcastId: string, episodeId: string) {
    const podcast = this.getPodcast(podcastId);
    this.getEpisode(podcastId, episodeId);
    podcast.episodes = podcast.episodes.filter(
      (episode) => episode.id !== +episodeId,
    );
    this.patchPodcast(podcastId, podcast);
  }
}

export { PodcastsService };
