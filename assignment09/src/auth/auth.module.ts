import {  Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PodcastsModule } from 'src/podcast/podcasts.module';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [PodcastsModule, UsersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
