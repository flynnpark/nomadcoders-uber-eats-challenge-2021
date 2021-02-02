import { InputType, ObjectType, Field } from "@nestjs/graphql";
import { CoreOutput } from "./output.dto";

@InputType()
export class ToggleSubscribeInput {
  @Field((type) => Number)
  podcastId: number;
}

@ObjectType()
export class ToggleSubscribeOutput extends CoreOutput {}
