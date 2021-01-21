import { Field, ObjectType, InputType, Int, PickType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';
import { Podcast } from '../entities/podcast.entity';
import { IsInt } from 'class-validator';
import { Episode } from '../entities/episode.entity';

@ObjectType()
export class PodcastsOutput extends CoreOutput {
  @Field((type) => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}

@InputType()
export class GetPodcastInput extends PickType(Podcast, ['id'], InputType) {}

@InputType()
export class SearchPodcastsInput extends PickType(
  Podcast,
  ['title'],
  InputType
) {}

@ObjectType()
export class PodcastOutput extends CoreOutput {
  @Field((type) => Podcast, { nullable: true })
  podcast?: Podcast;
}

@ObjectType()
export class EpisodesOutput extends CoreOutput {
  @Field((type) => [Podcast], { nullable: true })
  episodes?: Episode[];
}

@InputType()
export class EpisodesSearchInput {
  @Field((type) => Int)
  @IsInt()
  podcastId: number;

  @Field((type) => Int)
  @IsInt()
  episodeId: number;
}

export class GetEpisodeOutput extends CoreOutput {
  episode?: Episode;
}
