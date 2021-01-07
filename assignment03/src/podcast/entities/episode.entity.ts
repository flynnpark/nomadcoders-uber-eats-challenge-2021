import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Episode {
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  title: string;

  @Field((type) => String)
  category: string;

  @Field((type) => Number)
  rating: number;
}
