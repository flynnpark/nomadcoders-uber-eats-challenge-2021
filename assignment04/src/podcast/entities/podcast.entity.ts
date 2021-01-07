import { Episode } from './episode.entity';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Podcast {
  @PrimaryGeneratedColumn()
  @Field((_) => Number)
  @IsNumber()
  id: number;

  @Column()
  @Field((_) => String)
  @IsString()
  title: string;

  @Column()
  @Field((_) => String)
  @IsString()
  category: string;

  @Column({ default: 0 })
  @Field((_) => Number)
  @IsNumber()
  rating: number;

  @OneToMany(() => Episode, (episode) => episode.podcast)
  @Field((_) => [Episode], { nullable: true })
  episodes: Episode[];
}
