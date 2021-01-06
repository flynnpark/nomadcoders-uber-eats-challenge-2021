import { ArgsType, Field, ObjectType, PartialType } from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';

@ArgsType()
export class UpdateEpisodeDto extends PartialType(Episode) {
  @Field((type) => Number)
  podcastId: number;

  @Field((type) => Number)
  episodeId: number;
}

@ObjectType()
export class UpdateEpisodeResponse {
  @Field((type) => String, { nullable: true })
  err: string | null;
}
