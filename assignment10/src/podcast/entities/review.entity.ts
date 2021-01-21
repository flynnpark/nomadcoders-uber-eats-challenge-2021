import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, Max, Min } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from './core.entity';
import { Podcast } from './podcast.entity';

@Entity()
@ObjectType()
export class Review extends CoreEntity {
  @ManyToOne(() => User, (user) => user.reviews)
  @Field((type) => User)
  user: User;

  @ManyToOne(() => Podcast, (podcast) => podcast.reviews)
  @Field((type) => Podcast)
  podcast: Podcast;

  @Column()
  @Field((type) => Number)
  @Min(1)
  @Max(5)
  rating: number;

  @Column()
  @Field((type) => String)
  @IsString()
  content: string;
}
