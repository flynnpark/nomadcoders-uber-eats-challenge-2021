import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CreatePodcastDto } from './create-podcast.dto';

@ArgsType()
export class CreateEpisodeDto extends CreatePodcastDto {
  @Field((type) => Number)
  podcastId: number;
}

@ObjectType()
export class CreateEpisodeResponse {
  @Field((type) => Number)
  episodeId: number;

  @Field((type) => String, { nullable: true })
  err: string | null;
}
