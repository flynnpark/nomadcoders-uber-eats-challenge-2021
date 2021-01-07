import { Field, ObjectType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';

@ObjectType()
export class GetAllPodcastsResponse {
  @Field((type) => [Podcast])
  podcasts: Podcast[];

  @Field((type) => String, { nullable: true })
  err: string | null;
}
