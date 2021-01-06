import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';

@ArgsType()
export class GetEpisodeInput {
  @Field((type) => Number)
  readonly podcastId: number;

  @Field((type) => Number)
  readonly episodeId: number;
}

@ObjectType()
export class GetEpisodeResponse {
  @Field((type) => Episode, { nullable: true })
  episode: Episode | null;

  @Field((type) => String, { nullable: true })
  err: string | null;
}
