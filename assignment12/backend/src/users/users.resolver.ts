import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import {
  CreateAccountInput,
  CreateAccountOutput
} from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { AuthUser } from "../auth/auth-user.decorator";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { Role } from "src/auth/role.decorator";
import {
  ToggleSubscribeOutput,
  ToggleSubscribeInput
} from "./dtos/subscribe.dto";
import { Podcast } from "src/podcast/entities/podcast.entity";
import {
  MarkEpisodeAsPlayedOutput,
  MarkEpisodeAsPlayedInput
} from "./dtos/mark-episode-played.dto";

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation((returns) => CreateAccountOutput)
  createAccount(
    @Args("input") createAccountInput: CreateAccountInput
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  login(@Args("input") loginInpt: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInpt);
  }

  @Role(["Any"])
  @Query((returns) => User)
  me(@AuthUser() authUser: User): User {
    return authUser;
  }

  @Role(["Any"])
  @Query((returns) => UserProfileOutput)
  seeProfile(
    @Args() userProfileInput: UserProfileInput
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }

  @Role(["Any"])
  @Mutation((returns) => EditProfileOutput)
  editProfile(
    @AuthUser() authUser: User,
    @Args("input") editProfileInput: EditProfileInput
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Role(["Listener"])
  @Mutation(() => ToggleSubscribeOutput)
  toggleSubscribe(
    @AuthUser() user: User,
    @Args("input") toggleSubscribeInput: ToggleSubscribeInput
  ): Promise<ToggleSubscribeOutput> {
    return this.usersService.toggleSubscribe(user, toggleSubscribeInput);
  }

  @Role(["Listener"])
  @Query(() => [Podcast])
  subscriptions(@AuthUser() user: User): Podcast[] {
    return user.subsriptions;
  }

  @Role(["Listener"])
  @Mutation(() => MarkEpisodeAsPlayedOutput)
  markEpisodeAsPlayed(
    @AuthUser() user: User,
    @Args("input") markEpisodeAsPlayedInput: MarkEpisodeAsPlayedInput
  ): Promise<MarkEpisodeAsPlayedOutput> {
    return this.usersService.markEpisodeAsPlayed(
      user,
      markEpisodeAsPlayedInput
    );
  }
}
