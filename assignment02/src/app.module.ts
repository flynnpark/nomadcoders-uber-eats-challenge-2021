import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PodcastsModule } from './podcast/podcasts.module';

@Module({
  imports: [PodcastsModule, GraphQLModule.forRoot({ autoSchemaFile: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
