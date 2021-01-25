import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { PodcastsService } from "./podcasts.service";
import { Podcast } from "./entities/podcast.entity";
import {
  CreatePodcastInput,
  CreatePodcastOutput
} from "./dtos/create-podcast.dto";
import { CoreOutput } from "./dtos/output.dto";
import {
  PodcastSearchInput,
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
  GetAllPodcastsOutput
} from "./dtos/podcast.dto";
import { UpdatePodcastInput } from "./dtos/update-podcast.dto";
import { Episode } from "./entities/episode.entity";
import { Review } from "./entities/review.entity";
import {
  CreateEpisodeInput,
  CreateEpisodeOutput
} from "./dtos/create-episode.dto";
import { UpdateEpisodeInput } from "./dtos/update-episode.dto";
import { Role } from "src/auth/role.decorator";
import {
  SearchPodcastsInput,
  SearchPodcastsOutput
} from "./dtos/search-podcasts.dto";
import {
  CreateReviewOutput,
  CreateReviewInput
} from "./dtos/create-review.dto";
import { AuthUser } from "src/auth/auth-user.decorator";
import { User } from "src/users/entities/user.entity";

@Resolver((of) => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Query((returns) => GetAllPodcastsOutput)
  getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    return this.podcastsService.getAllPodcasts();
  }

  @Mutation((returns) => CreatePodcastOutput)
  @Role(["Host"])
  createPodcast(
    @AuthUser() user: User,
    @Args("input") createPodcastInput: CreatePodcastInput
  ): Promise<CreatePodcastOutput> {
    return this.podcastsService.createPodcast(user, createPodcastInput);
  }

  @Query((returns) => PodcastOutput)
  getPodcast(
    @Args("input") podcastSearchInput: PodcastSearchInput
  ): Promise<PodcastOutput> {
    return this.podcastsService.getPodcast(podcastSearchInput.id);
  }

  @Mutation((returns) => CoreOutput)
  @Role(["Host"])
  deletePodcast(
    @AuthUser() user: User,
    @Args("input") podcastSearchInput: PodcastSearchInput
  ): Promise<CoreOutput> {
    return this.podcastsService.deletePodcast(user, podcastSearchInput.id);
  }

  @Mutation((returns) => CoreOutput)
  @Role(["Host"])
  updatePodcast(
    @AuthUser() user: User,
    @Args("input") updatePodcastInput: UpdatePodcastInput
  ): Promise<CoreOutput> {
    return this.podcastsService.updatePodcast(user, updatePodcastInput);
  }

  @Query((returns) => SearchPodcastsOutput)
  @Role(["Listener"])
  searchPodcasts(
    @Args("input") searchPodcastsInput: SearchPodcastsInput
  ): Promise<SearchPodcastsOutput> {
    return this.podcastsService.searchPodcasts(searchPodcastsInput);
  }
}

@Resolver((of) => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastService: PodcastsService) {}

  @Query((returns) => EpisodesOutput)
  getEpisodes(
    @Args("input") podcastSearchInput: PodcastSearchInput
  ): Promise<EpisodesOutput> {
    return this.podcastService.getEpisodes(podcastSearchInput.id);
  }

  @Mutation((returns) => CreateEpisodeOutput)
  @Role(["Host"])
  createEpisode(
    @AuthUser() user: User,
    @Args("input") createEpisodeInput: CreateEpisodeInput
  ): Promise<CreateEpisodeOutput> {
    return this.podcastService.createEpisode(user, createEpisodeInput);
  }

  @Mutation((returns) => CoreOutput)
  @Role(["Host"])
  updateEpisode(
    @AuthUser() user: User,
    @Args("input") updateEpisodeInput: UpdateEpisodeInput
  ): Promise<CoreOutput> {
    return this.podcastService.updateEpisode(user, updateEpisodeInput);
  }

  @Mutation((returns) => CoreOutput)
  @Role(["Host"])
  deleteEpisode(
    @AuthUser() user: User,
    @Args("input") episodesSearchInput: EpisodesSearchInput
  ): Promise<CoreOutput> {
    return this.podcastService.deleteEpisode(user, episodesSearchInput);
  }
}

@Resolver((of) => Review)
export class ReviewResolver {
  constructor(private readonly podcastService: PodcastsService) {}

  @Mutation(() => CreateReviewOutput)
  @Role(["Listener"])
  createReview(
    @AuthUser() creator: User,
    @Args("input") createReviewInput: CreateReviewInput
  ): Promise<CreateReviewOutput> {
    return this.podcastService.createReview(creator, createReviewInput);
  }
}
