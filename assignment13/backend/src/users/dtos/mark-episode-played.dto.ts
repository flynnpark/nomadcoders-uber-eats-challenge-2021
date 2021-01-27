import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "./output.dto";
import { Episode } from "src/podcast/entities/episode.entity";

@InputType()
export class MarkEpisodeAsPlayedInput extends PickType(
  Episode,
  ["id"],
  InputType
) {}

@ObjectType()
export class MarkEpisodeAsPlayedOutput extends CoreOutput {}
