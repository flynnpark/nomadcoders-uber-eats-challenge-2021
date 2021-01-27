import { ObjectType, Field } from "@nestjs/graphql";
import { CoreOutput } from "./output.dto";
import { Podcast } from "src/podcast/entities/podcast.entity";

@ObjectType()
export class SubscriptionsOutput extends CoreOutput {
  @Field(() => [Podcast], { nullable: true })
  subscriptions?: Podcast[];
}
