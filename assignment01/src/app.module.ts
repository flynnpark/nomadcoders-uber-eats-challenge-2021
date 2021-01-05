import { Module } from '@nestjs/common';
import { PodcastsController } from './podcasts/podcasts.controllers';
import { PodcastsService } from './podcasts/podcasts.service';

@Module({
  imports: [],
  controllers: [PodcastsController],
  providers: [PodcastsService],
})
export class AppModule {}
