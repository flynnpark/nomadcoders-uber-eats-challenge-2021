import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/podcast/dtos/output.dto';
import { Podcast } from 'src/podcast/entities/podcast.entity';

@ObjectType()
export class SeeSubscriptionsOutput extends CoreOutput {
  @Field((type) => [Podcast])
  podcasts?: Podcast[];
}
