import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';
import { PodcastsService } from './podcasts.service';
import { Podcast } from './entities/podcast.entity';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import { CoreOutput } from './dtos/output.dto';
import {
  PodcastSearchInput,
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
  GetAllPodcastsOutput,
} from './dtos/podcast.dto';
import { UpdatePodcastInput } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import { UpdateEpisodeInput } from './dtos/update-episode.dto';

@Resolver((of) => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}
  @Query((returns) => GetAllPodcastsOutput)
  getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    return this.podcastsService.getAllPodcasts();
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => CreatePodcastOutput)
  @Role(['Host'])
  createPodcast(
    @Args('input') createPodcastInput: CreatePodcastInput
  ): Promise<CreatePodcastOutput> {
    return this.podcastsService.createPodcast(createPodcastInput);
  }

  @Query((returns) => PodcastOutput)
  getPodcast(
    @Args('input') podcastSearchInput: PodcastSearchInput
  ): Promise<PodcastOutput> {
    return this.podcastsService.getPodcast(podcastSearchInput.id);
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => CoreOutput)
  @Role(['Host'])
  deletePodcast(
    @Args('input') podcastSearchInput: PodcastSearchInput
  ): Promise<CoreOutput> {
    return this.podcastsService.deletePodcast(podcastSearchInput.id);
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => CoreOutput)
  @Role(['Host'])
  updatePodcast(
    @Args('input') updatePodcastInput: UpdatePodcastInput
  ): Promise<CoreOutput> {
    return this.podcastsService.updatePodcast(updatePodcastInput);
  }
}

@Resolver((of) => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastService: PodcastsService) {}

  @Query((returns) => EpisodesOutput)
  getEpisodes(
    @Args('input') podcastSearchInput: PodcastSearchInput
  ): Promise<EpisodesOutput> {
    return this.podcastService.getEpisodes(podcastSearchInput.id);
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => CreateEpisodeOutput)
  @Role(['Host'])
  createEpisode(
    @Args('input') createEpisodeInput: CreateEpisodeInput
  ): Promise<CreateEpisodeOutput> {
    return this.podcastService.createEpisode(createEpisodeInput);
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => CoreOutput)
  @Role(['Host'])
  updateEpisode(
    @Args('input') updateEpisodeInput: UpdateEpisodeInput
  ): Promise<CoreOutput> {
    return this.podcastService.updateEpisode(updateEpisodeInput);
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => CoreOutput)
  @Role(['Host'])
  deleteEpisode(
    @Args('input') episodesSearchInput: EpisodesSearchInput
  ): Promise<CoreOutput> {
    return this.podcastService.deleteEpisode(episodesSearchInput);
  }
}
