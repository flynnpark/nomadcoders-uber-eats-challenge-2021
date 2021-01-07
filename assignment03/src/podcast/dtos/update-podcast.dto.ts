import {
  ArgsType,
  Field,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';

@ArgsType()
export class UpdatePodcastDto extends PartialType(Podcast) {
  @Field((type) => Number)
  id: number;
}

@ObjectType()
export class UpdatePodcastResponse {
  @Field((type) => String, { nullable: true })
  err: string | null;
}
