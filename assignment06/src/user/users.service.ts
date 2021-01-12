import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dtos/create-user.dto';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({
    username,
    password,
    role,
  }: CreateUserInput): Promise<CoreOutput> {
    try {
      const exists = await this.users.findOne({ username });
      if (exists) {
        return {
          ok: false,
          error: 'There is a user with that username already',
        };
      }
      await this.users.save(this.users.create({ username, password, role }));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: "Couldn't create user" };
    }
  }

  async login({ username, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ username });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<User> {
    return this.users.findOne({ id });
  }

  async editProfile(
    userId: number,
    { username, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOne(userId);
    if (username) {
      user.username = username;
    }
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
  }
}
