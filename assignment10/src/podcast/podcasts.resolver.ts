import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PodcastsService } from './podcasts.service';
import { Podcast } from './entities/podcast.entity';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import { CoreOutput } from './dtos/output.dto';
import {
  GetPodcastInput,
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
  PodcastsOutput,
  SearchPodcastsInput,
} from './dtos/podcast.dto';
import { UpdatePodcastInput } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import { UpdateEpisodeInput } from './dtos/update-episode.dto';
import { Role } from 'src/auth/role.decorator';
import { ReviewPodcastInput } from './dtos/review-podcast';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { SubscribeToPodcastInput } from './dtos/subscribe-to-podcast.dto';
import { argsToArgsConfig } from 'graphql/type/definition';

@Resolver((of) => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Query((returns) => PodcastsOutput)
  getAllPodcasts(): Promise<PodcastsOutput> {
    return this.podcastsService.getAllPodcasts();
  }

  @Mutation((returns) => CreatePodcastOutput)
  @Role(['Host'])
  createPodcast(
    @Args('input') createPodcastInput: CreatePodcastInput
  ): Promise<CreatePodcastOutput> {
    return this.podcastsService.createPodcast(createPodcastInput);
  }

  @Query((returns) => PodcastOutput)
  getPodcast(
    @Args('input') getPodcastInput: GetPodcastInput
  ): Promise<PodcastOutput> {
    return this.podcastsService.getPodcast(getPodcastInput.id);
  }

  @Query((returns) => PodcastsOutput)
  @Role(['Listener'])
  searchPodcast(
    @Args('input') searchPodcastInput: SearchPodcastsInput
  ): Promise<PodcastsOutput> {
    return this.podcastsService.searchPodcasts(searchPodcastInput.title);
  }

  @Mutation((returns) => CoreOutput)
  @Role(['Host'])
  deletePodcast(
    @Args('input') getPodcastInput: GetPodcastInput
  ): Promise<CoreOutput> {
    return this.podcastsService.deletePodcast(getPodcastInput.id);
  }

  @Mutation((returns) => CoreOutput)
  @Role(['Host'])
  updatePodcast(
    @Args('input') updatePodcastInput: UpdatePodcastInput
  ): Promise<CoreOutput> {
    return this.podcastsService.updatePodcast(updatePodcastInput);
  }

  @Mutation((returns) => CoreOutput)
  @Role(['Listener'])
  reviewPodcast(
    @AuthUser() authUser: User,
    @Args('input') reviewPodcastInput: ReviewPodcastInput
  ): Promise<CoreOutput> {
    return this.podcastsService.reviewPodcast(authUser, reviewPodcastInput);
  }

  @Mutation((returns) => CoreOutput)
  @Role(['Listener'])
  subscribeToPodcast(
    @AuthUser() authUser: User,
    @Args('input') subscribeToPodcastInput: SubscribeToPodcastInput
  ): Promise<CoreOutput> {
    return this.podcastsService.subscribeToPodcast(
      authUser,
      subscribeToPodcastInput
    );
  }
}

@Resolver((of) => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastService: PodcastsService) {}

  @Query((returns) => EpisodesOutput)
  getEpisodes(
    @Args('input') GetPodcastInput: GetPodcastInput
  ): Promise<EpisodesOutput> {
    return this.podcastService.getEpisodes(GetPodcastInput.id);
  }

  @Mutation((returns) => CreateEpisodeOutput)
  @Role(['Host'])
  createEpisode(
    @Args('input') createEpisodeInput: CreateEpisodeInput
  ): Promise<CreateEpisodeOutput> {
    return this.podcastService.createEpisode(createEpisodeInput);
  }

  @Mutation((returns) => CoreOutput)
  @Role(['Host'])
  updateEpisode(
    @Args('input') updateEpisodeInput: UpdateEpisodeInput
  ): Promise<CoreOutput> {
    return this.podcastService.updateEpisode(updateEpisodeInput);
  }

  @Mutation((returns) => CoreOutput)
  @Role(['Host'])
  deleteEpisode(
    @Args('input') episodesSearchInput: EpisodesSearchInput
  ): Promise<CoreOutput> {
    return this.podcastService.deleteEpisode(episodesSearchInput);
  }

  @Mutation((returns) => CoreOutput)
  @Role(['Listener'])
  markEpisodeAsPlayed(
    @AuthUser() authUser: User,
    @Args('input') markEpisodeAsPlayedInput: EpisodesSearchInput
  ): Promise<CoreOutput> {
    return this.podcastService.markEpisodeAsPlayed(
      authUser,
      markEpisodeAsPlayedInput
    );
  }
}
