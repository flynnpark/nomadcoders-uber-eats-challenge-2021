import {
  ObjectType,
  Field,
  InputType,
  registerEnumType
} from "@nestjs/graphql";
import { IsString, IsEmail } from "class-validator";
import {
  Column,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToMany,
  JoinTable
} from "typeorm";
import { CoreEntity } from "./core.entity";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { Podcast } from "../../podcast/entities/podcast.entity";
import { Episode } from "../../podcast/entities/episode.entity";
import { Review } from "../../podcast/entities/review.entity";

export enum UserRole {
  Host = "Host",
  Listener = "Listener"
}

registerEnumType(UserRole, { name: "UserRole" });

@InputType("UserInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column()
  @Field((type) => String)
  @IsString()
  password: string;

  @Column({ type: "simple-enum", enum: UserRole })
  @Field((type) => UserRole)
  role: UserRole;

  @OneToMany(() => Podcast, (podcast) => podcast.creator, { eager: true })
  @Field((type) => [Podcast])
  podcasts: Podcast[];

  @OneToMany(() => Review, (review) => review.creator, { eager: true })
  @Field((type) => [Review])
  reviews: Review[];

  @ManyToMany(() => Episode, { eager: true })
  @Field((type) => [Episode])
  @JoinTable()
  playedEpisodes: Episode[];

  @ManyToMany(() => Podcast, { eager: true })
  @Field(() => [Podcast])
  @JoinTable()
  subsriptions: Podcast[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password) {
      return;
    }
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
