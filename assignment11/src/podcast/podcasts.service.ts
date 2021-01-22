import { Injectable } from "@nestjs/common";
import {
  CreateEpisodeInput,
  CreateEpisodeOutput
} from "./dtos/create-episode.dto";
import {
  CreatePodcastInput,
  CreatePodcastOutput
} from "./dtos/create-podcast.dto";
import { UpdateEpisodeInput } from "./dtos/update-episode.dto";
import { UpdatePodcastInput } from "./dtos/update-podcast.dto";
import { Episode } from "./entities/episode.entity";
import { Review } from "./entities/review.entity";
import { Podcast } from "./entities/podcast.entity";
import { CoreOutput } from "./dtos/output.dto";
import {
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
  GetAllPodcastsOutput,
  GetEpisodeOutput
} from "./dtos/podcast.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Raw, Like } from "typeorm";
import {
  SearchPodcastsInput,
  SearchPodcastsOutput
} from "./dtos/search-podcasts.dto";
import {
  CreateReviewInput,
  CreateReviewOutput
} from "./dtos/create-review.dto";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>
  ) {}

  private readonly InternalServerErrorOutput = {
    ok: false,
    error: "Internal server error occurred."
  };

  async getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    try {
      const podcasts = await this.podcastRepository.find();
      return {
        ok: true,
        podcasts
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async createPodcast(
    creator: User,
    { title, category }: CreatePodcastInput
  ): Promise<CreatePodcastOutput> {
    try {
      const newPodcast = this.podcastRepository.create({ title, category });
      newPodcast.creator = creator;
      const { id } = await this.podcastRepository.save(newPodcast);
      return {
        ok: true,
        id
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    try {
      const podcast = await this.podcastRepository.findOne(
        { id },
        { relations: ["episodes", "creator", "reviews"] }
      );
      if (!podcast) {
        return {
          ok: false,
          error: `Podcast with id ${id} not found`
        };
      }
      return {
        ok: true,
        podcast
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async deletePodcast(user: User, id: number): Promise<CoreOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }
      if (podcast.creator.id !== user.id) {
        return { ok: false, error: "Not authorized" };
      }
      await this.podcastRepository.delete({ id });
      return { ok };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async updatePodcast(
    user: User,
    { id, payload }: UpdatePodcastInput
  ): Promise<CoreOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }
      if (podcast.creator.id !== user.id) {
        return { ok: false, error: "Not authorized" };
      }
      if (
        payload.rating !== null &&
        (payload.rating < 1 || payload.rating > 5)
      ) {
        return {
          ok: false,
          error: "Rating must be between 1 and 5."
        };
      } else {
        const updatedPodcast: Podcast = { ...podcast, ...payload };
        await this.podcastRepository.save(updatedPodcast);
        return { ok };
      }
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async searchPodcasts({
    titleQuery,
    page
  }: SearchPodcastsInput): Promise<SearchPodcastsOutput> {
    try {
      const [podcasts, totalCount] = await this.podcastRepository.findAndCount({
        // where: { title: Raw((title) => `${title} LIKE ${titleQuery}`) },
        where: { title: Like(`%${titleQuery}%`) },
        take: 50,
        skip: (page - 1) * 50
      });
      if (!podcasts) {
        return { ok: false, error: "Could not find podcasts" };
      }
      return {
        ok: true,
        podcasts,
        totalCount,
        totalPages: Math.ceil(totalCount / 50)
      };
    } catch (err) {
      console.log(err);
      return this.InternalServerErrorOutput;
    }
  }

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    const { podcast, ok, error } = await this.getPodcast(podcastId);
    if (!ok) {
      return { ok, error };
    }
    return {
      ok: true,
      episodes: podcast.episodes
    };
  }

  async getEpisode({
    podcastId,
    episodeId
  }: EpisodesSearchInput): Promise<GetEpisodeOutput> {
    const { episodes, ok, error } = await this.getEpisodes(podcastId);
    if (!ok) {
      return { ok, error };
    }
    const episode = episodes.find((episode) => episode.id === episodeId);
    if (!episode) {
      return {
        ok: false,
        error: `Episode with id ${episodeId} not found in podcast with id ${podcastId}`
      };
    }
    return {
      ok: true,
      episode
    };
  }

  async createEpisode(
    user: User,
    { podcastId, title, category }: CreateEpisodeInput
  ): Promise<CreateEpisodeOutput> {
    try {
      const { podcast, ok, error } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      if (podcast.creator.id !== user.id) {
        return { ok: false, error: "Not authorized" };
      }
      const newEpisode = this.episodeRepository.create({ title, category });
      newEpisode.podcast = podcast;
      const { id } = await this.episodeRepository.save(newEpisode);
      return {
        ok: true,
        id
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async deleteEpisode(
    user: User,
    { podcastId, episodeId }: EpisodesSearchInput
  ): Promise<CoreOutput> {
    try {
      const { episode, error, ok } = await this.getEpisode({
        podcastId,
        episodeId
      });
      if (!ok) {
        return { ok, error };
      }
      if (episode.podcast.creator.id !== user.id) {
        return { ok: false, error: "Not authorized" };
      }
      await this.episodeRepository.delete({ id: episode.id });
      return { ok: true };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async updateEpisode(
    user: User,
    { podcastId, episodeId, ...rest }: UpdateEpisodeInput
  ): Promise<CoreOutput> {
    try {
      const { episode, ok, error } = await this.getEpisode({
        podcastId,
        episodeId
      });
      if (!ok) {
        return { ok, error };
      }
      if (episode.podcast.creator.id !== user.id) {
        return { ok: false, error: "Not authorized" };
      }
      const updatedEpisode = { ...episode, ...rest };
      await this.episodeRepository.save(updatedEpisode);
      return { ok: true };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async createReview(
    creator: User,
    { title, text, podcastId }: CreateReviewInput
  ): Promise<CreateReviewOutput> {
    try {
      const { ok, error: podcastFindErr, podcast } = await this.getPodcast(
        podcastId
      );
      if (!ok || podcastFindErr) {
        return { ok: false, error: podcastFindErr };
      }
      const review = this.reviewRepository.create({ title, text });
      review.podcast = podcast;
      review.creator = creator;
      const { id } = await this.reviewRepository.save(review);
      return { ok: true, id };
    } catch {
      return this.InternalServerErrorOutput;
    }
  }
}
