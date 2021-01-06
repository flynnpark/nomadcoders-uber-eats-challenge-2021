import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class DeleteEpisodeInput {
  @Field((type) => Number)
  readonly podcastId: number;

  @Field((type) => Number)
  readonly episodeId: number;
}

@ObjectType()
export class DeletePodcastResponse {
  @Field((type) => String, { nullable: true })
  err: string | null;
}
