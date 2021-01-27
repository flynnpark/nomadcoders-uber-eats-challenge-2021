import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import {
  CreateAccountInput,
  CreateAccountOutput
} from "./dtos/create-account.dto";
import {
  ToggleSubscribeInput,
  ToggleSubscribeOutput
} from "./dtos/subscribe.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "../jwt/jwt.service";
import { UserProfileOutput } from "./dtos/user-profile.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { Podcast } from "../podcast/entities/podcast.entity";
import {
  MarkEpisodeAsPlayedInput,
  MarkEpisodeAsPlayedOutput
} from "./dtos/mark-episode-played.dto";
import { Episode } from "src/podcast/entities/episode.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Podcast)
    private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodes: Repository<Episode>,
    private readonly jwtService: JwtService
  ) {}

  private readonly InternalServerErrorOutput = {
    ok: false,
    error: "Internal server error occurred."
  };

  async createAccount({
    email,
    password,
    role
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return { ok: false, error: `There is a user with that email already` };
      }
      const user = this.users.create({
        email,
        password,
        role
      });
      await this.users.save(user);

      return {
        ok: true,
        error: null
      };
    } catch {
      return {
        ok: false,
        error: "Could not create account"
      };
    }
  }
  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ["id", "password"] }
      );
      if (!user) {
        return { ok: false, error: "User not found" };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: "Wrong password"
        };
      }

      const token = this.jwtService.sign(user.id);

      return {
        ok: true,
        token
      };
    } catch (error) {
      return {
        ok: false,
        error
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ id });
      return {
        ok: true,
        user
      };
    } catch (error) {
      return {
        ok: false,
        error: "User Not Found"
      };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOneOrFail(userId);

      if (email) user.email = email;
      if (password) user.password = password;

      await this.users.save(user);
      return {
        ok: true
      };
    } catch (error) {
      return {
        ok: false,
        error: "Could not update profile"
      };
    }
  }

  async toggleSubscribe(
    user: User,
    { podcastId }: ToggleSubscribeInput
  ): Promise<ToggleSubscribeOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id: podcastId });
      if (!podcast) {
        return { ok: false, error: "Podcast not found" };
      }
      if (user.subsriptions.some((sub) => sub.id === podcast.id)) {
        user.subsriptions = user.subsriptions.filter(
          (sub) => sub.id !== podcast.id
        );
      } else {
        console.log("foo");
        user.subsriptions = [...user.subsriptions, podcast];
      }
      await this.users.save(user);
      return { ok: true };
    } catch {
      return this.InternalServerErrorOutput;
    }
  }

  async markEpisodeAsPlayed(
    user: User,
    { id: episodeId }: MarkEpisodeAsPlayedInput
  ): Promise<MarkEpisodeAsPlayedOutput> {
    try {
      const episode = await this.episodes.findOne({ id: episodeId });
      if (!episode) {
        return { ok: false, error: "Episode not found" };
      }
      user.playedEpisodes = [...user.playedEpisodes, episode];
      await this.users.save(user);
      return { ok: true };
    } catch {
      return this.InternalServerErrorOutput;
    }
  }
}
