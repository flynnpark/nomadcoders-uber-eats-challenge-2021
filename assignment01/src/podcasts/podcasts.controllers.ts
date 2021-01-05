import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

@Controller('podcasts')
class PodcastsController {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Get()
  getPodcasts(): Podcast[] {
    return this.podcastsService.getPodcasts();
  }

  @Post()
  createPodcast(@Body() podcastData) {
    return this.podcastsService.createPodcast(podcastData);
  }

  @Get(':podcastId')
  getPodcast(@Param('podcastId') podcastId: string): Podcast {
    return this.podcastsService.getPodcast(podcastId);
  }

  @Patch(':podcastId')
  patchPodcast(@Param('podcastId') podcastId: string, @Body() updateData) {
    return this.podcastsService.patchPodcast(podcastId, updateData);
  }

  @Delete(':podcastId')
  deletePodcast(@Param('podcastId') podcastId: string) {
    return this.podcastsService.deletePodcast(podcastId);
  }

  @Get(':podcastId/episodes')
  getEpisodes(@Param('podcastId') podcastId: string) {
    return this.podcastsService.getEpisodes(podcastId);
  }

  @Post(':podcastId/episodes')
  createEpisode(@Param('podcastId') podcastId: string, @Body() episodeData) {
    return this.podcastsService.createEpisode(podcastId, episodeData);
  }

  @Patch(':podcastId/episodes/:episodeId')
  patchEpisode(
    @Param('podcastId') podcastId: string,
    @Param('episodeId') episodeId: string,
    @Body() updateData,
  ) {
    return this.podcastsService.patchEpisode(podcastId, episodeId, updateData);
  }

  @Delete(':podcastId/episodes/:episodeId')
  deleteEpisode(
    @Param('podcastId') podcastId: string,
    @Param('episodeId') episodeId: string,
  ) {
    return this.podcastsService.deleteEpisode(podcastId, episodeId);
  }
}

export { PodcastsController };
