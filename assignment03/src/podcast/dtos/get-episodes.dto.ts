import { Field, ObjectType } from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';

@ObjectType()
export class GetEpisodesResponse {
  @Field((type) => [Episode], { nullable: true })
  episodes: Episode[] | null;

  @Field((type) => String, { nullable: true })
  err: string | null;
}
