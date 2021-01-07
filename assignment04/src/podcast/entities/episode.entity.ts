import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Podcast } from './podcast.entity';

@InputType('EpisodeInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Episode {
  @PrimaryGeneratedColumn()
  @Field((_) => Number)
  id: number;

  @Column()
  @Field((_) => String)
  title: string;

  @Column()
  @Field((_) => String)
  category: string;

  @ManyToOne(() => Podcast, (podcast) => podcast.episodes)
  podcast: Podcast;
}
