import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class SubscribeToPodcastInput {
  @Field((type) => Int)
  @IsInt()
  podcastId: number;
}
