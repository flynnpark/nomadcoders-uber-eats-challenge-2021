import { InputType, Field, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "./pagination.dto";
import { IsString } from "class-validator";
import { Podcast } from "../entities/podcast.entity";

@InputType()
export class SearchPodcastsInput extends PaginationInput {
  @Field(() => String)
  @IsString()
  titleQuery: string;
}

@ObjectType()
export class SearchPodcastsOutput extends PaginationOutput {
  @Field(() => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}
