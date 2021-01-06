import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class CreatePodcastDto {
  @Field((type) => String)
  readonly title: string;

  @Field((type) => String)
  readonly category: string;
}

@ObjectType()
export class CreatePodcastResponse {
  @Field((type) => Number)
  id: number;

  @Field((type) => String, { nullable: true })
  err: string | null;
}
