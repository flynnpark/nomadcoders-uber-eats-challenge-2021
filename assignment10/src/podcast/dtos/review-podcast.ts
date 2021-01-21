import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class ReviewPodcastInput {
  @Field((type) => Int)
  @IsInt()
  podcastId: number;

  @Field((type) => Int)
  @IsInt()
  rating: number;

  @Field((type) => String)
  @IsString()
  content: string;
}
