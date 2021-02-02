import { ObjectType, Field } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { Podcast } from "./podcast.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
@ObjectType()
export class Review extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  title: string;

  @Column()
  @Field((type) => String)
  @IsString()
  text: string;

  @ManyToOne(() => Podcast, (podcast) => podcast.reviews, {
    onDelete: "CASCADE"
  })
  @Field((type) => Podcast)
  podcast: Podcast;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: "CASCADE"
  })
  @Field((type) => User)
  creator: User;
}
