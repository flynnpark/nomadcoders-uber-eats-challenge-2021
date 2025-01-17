import { Module } from '@nestjs/common';
import { PodcastsResolver } from './podcasts.resolver';
import { PodcastsService } from './podcasts.service';

@Module({
  providers: [PodcastsService, PodcastsResolver],
})
export class PodcastsModule {}
