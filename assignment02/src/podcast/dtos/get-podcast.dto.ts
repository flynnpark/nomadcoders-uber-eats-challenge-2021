import { Field, ObjectType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';

@ObjectType()
export class GetPodcastResponse {
  @Field((type) => Podcast, { nullable: true })
  podcast: Podcast | null;

  @Field((type) => String, { nullable: true })
  err: string | null;
}
