import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { Review } from "../entities/review.entity";
import { CoreOutput } from "./output.dto";
import { IsNumber } from "class-validator";

@InputType()
export class CreateReviewInput extends PickType(
  Review,
  ["title", "text"],
  InputType
) {
  @Field(() => Number)
  @IsNumber()
  podcastId: number;
}

@ObjectType()
export class CreateReviewOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  id?: number;
}
