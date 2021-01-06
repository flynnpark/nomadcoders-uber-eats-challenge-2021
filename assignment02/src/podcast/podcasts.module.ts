import { Module } from '@nestjs/common';
import { EpisodeController, PodcastsController } from './podcasts.controller';
import { PodcastsService } from './podcasts.service';

@Module({
  controllers: [PodcastsController, EpisodeController],
  providers: [PodcastsService],
})
export class PodcastsModule {}
