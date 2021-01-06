import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

@Resolver((of) => Podcast)
export class PodcastsResolver {
  constructor(private podcastsService: PodcastsService) {}

  @Query((returns) => GetAllPodcastsResponse)
  getAllPodcasts(): GetAllPodcastsResponse {
    return this.podcastsService.getAllPodcasts();
  }

  @Mutation((returns) => CreatePodcastResponse)
  createPodcast(
    @Args() createPodcastDto: CreatePodcastDto,
  ): CreatePodcastResponse {
    return this.podcastsService.createPodcast(createPodcastDto);
  }

  @Query((returns) => GetPodcastResponse)
  getPodcast(@Args('podcastId') podcastId: number): GetPodcastResponse {
    return this.podcastsService.getPodcast(podcastId);
  }

  @Mutation((returns) => DeletePodcastResponse)
  deletePodcast(@Args('podcastId') podcastId: number): DeletePodcastResponse {
    return this.podcastsService.deletePodcast(podcastId);
  }

  @Mutation((returns) => UpdatePodcastResponse)
  updatePodcast(
    @Args() updatePodcastDto: UpdatePodcastDto,
  ): UpdatePodcastResponse {
    return this.podcastsService.updatePodcast(updatePodcastDto);
  }

  @Query((returns) => GetEpisodesResponse)
  getEpisodes(@Args('podcastId') podcastId: number): GetEpisodesResponse {
    return this.podcastsService.getEpisodes(podcastId);
  }

  @Mutation((returns) => CreateEpisodeResponse)
  createEpisode(
    @Args() createEpisodeDto: CreateEpisodeDto,
  ): CreateEpisodeResponse {
    return this.podcastsService.createEpisode(createEpisodeDto);
  }

  @Mutation((returns) => DeletePodcastResponse)
  deleteEpisode(
    @Args() deleteEpisodeInput: DeleteEpisodeInput,
  ): DeletePodcastResponse {
    return this.podcastsService.deleteEpisode(deleteEpisodeInput);
  }

  @Query((returns) => GetEpisodeResponse)
  getEpisode(@Args() getEpisodeInput: GetEpisodeInput): GetEpisodeResponse {
    return this.podcastsService.getEpisode(getEpisodeInput);
  }

  @Mutation((returns) => UpdateEpisodeResponse)
  updateEpisode(
    @Args() updateEpisodeDto: UpdateEpisodeDto,
  ): UpdateEpisodeResponse {
    return this.podcastsService.updateEpisode(updateEpisodeDto);
  }
}
