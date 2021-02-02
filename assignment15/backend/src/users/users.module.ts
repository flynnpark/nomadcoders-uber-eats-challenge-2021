import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { User } from "./entities/user.entity";
import { Podcast } from "../podcast/entities/podcast.entity";
import { Episode } from "../podcast/entities/episode.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Podcast, Episode])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService]
})
export class UsersModule {}
