import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeletePodcastResponse {
  @Field((type) => String, { nullable: true })
  err: string | null;
}
