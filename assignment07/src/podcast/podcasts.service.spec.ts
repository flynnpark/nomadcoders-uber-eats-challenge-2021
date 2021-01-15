import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { identity } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateEpisodeInput } from './dtos/create-episode.dto';
import { CreatePodcastInput } from './dtos/create-podcast.dto';
import { EpisodesSearchInput } from './dtos/podcast.dto';
import { UpdateEpisodeInput } from './dtos/update-episode.dto';
import { UpdatePodcastInput } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

const mockPodcastRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
};

const mockEpisodeRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PodcastService', () => {
  let service: PodcastsService;
  let podcastRepository: MockRepository<Podcast>;
  let episodeRepository: MockRepository<Episode>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        PodcastsService,
        {
          provide: getRepositoryToken(Podcast),
          useValue: mockPodcastRepository,
        },
        {
          provide: getRepositoryToken(Episode),
          useValue: mockEpisodeRepository,
        },
      ],
    }).compile();
    service = module.get<PodcastsService>(PodcastsService);
    podcastRepository = module.get(getRepositoryToken(Podcast));
    episodeRepository = module.get(getRepositoryToken(Episode));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPodcast', () => {
    const createPodcastArgs: CreatePodcastInput = {
      title: 'test',
      category: 'test',
    };
    it('should create a new podcast', async () => {
      podcastRepository.create.mockReturnValue(createPodcastArgs);
      podcastRepository.save.mockResolvedValue({ id: 1, ...createPodcastArgs });
      const result = await service.createPodcast(createPodcastArgs);

      expect(podcastRepository.create).toHaveBeenCalledTimes(1);
      expect(podcastRepository.create).toHaveBeenCalledWith(createPodcastArgs);

      expect(podcastRepository.save).toHaveBeenCalledTimes(1);
      expect(podcastRepository.save).toHaveBeenCalledWith(createPodcastArgs);

      expect(result).toEqual({ ok: true, id: 1 });
    });
    it('should fail on exception', async () => {
      podcastRepository.save.mockRejectedValue(new Error());
      const result = await service.createPodcast(createPodcastArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Internal server error occurred.',
      });
    });
  });

  describe('getPodcast', () => {
    const getPodcastArg = 1;

    it('should fail if no podcast is found', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      const result = await service.getPodcast(getPodcastArg);
      expect(podcastRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${getPodcastArg} not found`,
      });
    });
    it('should get an existing podcast', async () => {
      const mockedPodcast: Podcast = {
        id: 1,
        title: 'test',
        category: 'test',
        rating: 0,
        episodes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      podcastRepository.findOne.mockResolvedValue(mockedPodcast);
      const result = await service.getPodcast(getPodcastArg);
      expect(podcastRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ok: true,
        podcast: mockedPodcast,
      });
    });
    it('should fail on exception', async () => {
      podcastRepository.findOne.mockRejectedValue(new Error());
      const result = await service.getPodcast(getPodcastArg);
      expect(result).toEqual({
        ok: false,
        error: 'Internal server error occurred.',
      });
    });
  });

  describe('getAllPodcasts', () => {
    const mockedPodcasts: Podcast[] = [
      {
        id: 1,
        title: 'test1',
        category: 'test1',
        rating: 0,
        episodes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'test2',
        category: 'test2',
        rating: 0,
        episodes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        title: 'test3',
        category: 'test3',
        rating: 0,
        episodes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    it('should get all podcasts', async () => {
      podcastRepository.find.mockResolvedValue(mockedPodcasts);
      const result = await service.getAllPodcasts();
      expect(podcastRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true, podcasts: mockedPodcasts });
    });
    it('should fail on exception', async () => {
      podcastRepository.find.mockRejectedValue(new Error());
      const result = await service.getAllPodcasts();
      expect(result).toEqual({
        ok: false,
        error: 'Internal server error occurred.',
      });
    });
  });

  describe('deletePodcast', () => {
    const deletePodcastArg = 1;
    const mockedPodcast: Podcast = {
      id: 1,
      title: 'test',
      category: 'test',
      rating: 0,
      episodes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it('should fail if no podcast is found', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      const result = await service.deletePodcast(deletePodcastArg);
      expect(podcastRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${deletePodcastArg} not found`,
      });
    });
    it('should delete an existing podcast', async () => {
      podcastRepository.findOne.mockResolvedValue(mockedPodcast);
      const result = await service.deletePodcast(deletePodcastArg);
      expect(podcastRepository.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ok: true,
      });
    });
    it('should fail on exception', async () => {
      podcastRepository.delete.mockRejectedValue(new Error());
      const result = await service.deletePodcast(deletePodcastArg);
      expect(result).toEqual({
        ok: false,
        error: 'Internal server error occurred.',
      });
    });
  });

  describe('updatePodcast', () => {
    const updatePodcastArgs: UpdatePodcastInput = {
      id: 1,
      payload: {
        title: 'updated test',
      },
    };
    const mockedPodcast: Podcast = {
      id: 1,
      title: 'test',
      category: 'test',
      rating: 0,
      episodes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it('should fail fail podcast does not exists', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      const result = await service.updatePodcast(updatePodcastArgs);
      expect(podcastRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${updatePodcastArgs.id} not found`,
      });
    });
    it('should update a podcast', async () => {
      podcastRepository.findOne.mockResolvedValue(mockedPodcast);
      podcastRepository.save.mockResolvedValue({
        ...mockedPodcast,
        ...updatePodcastArgs,
      });
      const result = await service.updatePodcast(updatePodcastArgs);
      expect(podcastRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true });
    });
    it('should update a podcast with rating', async () => {
      podcastRepository.findOne.mockResolvedValue(mockedPodcast);
      const result = await service.updatePodcast({
        ...updatePodcastArgs,
        payload: { ...updatePodcastArgs.payload, rating: 1 },
      });
      expect(podcastRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true });
    });
    it('should fail if out of range rating', async () => {
      podcastRepository.findOne.mockResolvedValue(mockedPodcast);
      const updateOutrangeRatingPodcastArgs: UpdatePodcastInput = {
        ...updatePodcastArgs,
        payload: {
          ...updatePodcastArgs.payload,
          rating: 0,
        },
      };
      podcastRepository.findOne.mockResolvedValue(mockedPodcast);
      const result = await service.updatePodcast(
        updateOutrangeRatingPodcastArgs,
      );
      expect(result).toEqual({
        ok: false,
        error: 'Rating must be between 1 and 5.',
      });
    });
    it('should fail on exception', async () => {
      podcastRepository.save.mockRejectedValue(new Error());
      const result = await service.updatePodcast(updatePodcastArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Internal server error occurred.',
      });
    });
  });

  describe('createEpisode', () => {
    const createEpisodeArgs: CreateEpisodeInput = {
      podcastId: 1,
      title: 'test episode',
      category: 'test',
    };
    it('should fail fail if podcast does not exists', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      const result = await service.createEpisode(createEpisodeArgs);
      expect(podcastRepository.findOne).toHaveBeenCalledTimes(1);
      expect(podcastRepository.findOne).toHaveBeenCalledTimes(
        createEpisodeArgs.podcastId,
      );
      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${createEpisodeArgs.podcastId} not found`,
      });
    });
    it('should create a new episode', async () => {
      const mockedPodcast: Podcast = {
        id: 1,
        title: 'test',
        category: 'test',
        rating: 0,
        episodes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const episodeReturnValue = {
        title: createEpisodeArgs.title,
        category: createEpisodeArgs.category,
      };
      podcastRepository.findOne.mockResolvedValue(mockedPodcast);
      episodeRepository.create.mockReturnValue(episodeReturnValue);
      episodeRepository.save.mockResolvedValue(episodeReturnValue);
      episodeRepository.save.mockReturnValue({
        id: 1,
        ...episodeReturnValue,
      });
      const result = await service.createEpisode(createEpisodeArgs);
      expect(episodeRepository.create).toHaveBeenCalledTimes(1);
      expect(episodeRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true, id: 1 });
    });
    it('should fail on exception', async () => {
      episodeRepository.save.mockRejectedValue(new Error());
      const result = await service.createEpisode(createEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Internal server error occurred.',
      });
    });
  });

  describe('getEpisodes', () => {
    const mockedPodcastId = 1;
    it('should fail if podcast does not exists', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      const result = await service.getEpisodes(mockedPodcastId);
      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${mockedPodcastId} not found`,
      });
    });
    it('should get all episodes from podcast', async () => {
      const mockedPodcast: Podcast = {
        id: 1,
        title: 'test',
        category: 'test',
        rating: 0,
        episodes: [
          {
            id: 1,
            title: 'test episode',
            category: 'test',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      podcastRepository.findOne.mockResolvedValue(mockedPodcast);
      const result = await service.getEpisodes(mockedPodcastId);
      expect(result).toEqual({ ok: true, episodes: mockedPodcast.episodes });
    });
  });

  describe('getEpisode', () => {
    const mockedPodcastId = 1;
    const mockedPodcast: Podcast = {
      id: 1,
      title: 'test',
      category: 'test',
      rating: 0,
      episodes: [
        {
          id: 1,
          title: 'test episode 1',
          category: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'test episode 2',
          category: 'test 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const getEpisodeArgs = {
      podcastId: mockedPodcastId,
      episodeId: 1,
    };
    it('should fail if podcast does not exists', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      const result = await service.getEpisode(getEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${mockedPodcastId} not found`,
      });
    });
    it('sholuld fail if episode does not exists', async () => {
      const emptyEpisodesPodcast = {
        ...mockedPodcast,
        episodes: [],
      };
      podcastRepository.findOne.mockResolvedValue(emptyEpisodesPodcast);
      const result = await service.getEpisode(getEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: `Episode with id ${getEpisodeArgs.episodeId} not found in podcast with id ${getEpisodeArgs.podcastId}`,
      });
    });
    it('should get an existing episode', async () => {
      podcastRepository.findOne.mockResolvedValue(mockedPodcast);
      episodeRepository.find.mockResolvedValue(mockedPodcast.episodes[0]);
      const result = await service.getEpisode(getEpisodeArgs);
      expect(result).toEqual({ ok: true, episode: mockedPodcast.episodes[0] });
    });
  });

  describe('deleteEpisode', () => {
    const deleteEpisodeArgs: EpisodesSearchInput = {
      podcastId: 1,
      episodeId: 1,
    };
    const mockedPodcast: Podcast = {
      id: 1,
      title: 'test',
      category: 'test',
      rating: 0,
      episodes: [
        {
          id: 1,
          title: 'test episode 1',
          category: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'test episode 2',
          category: 'test 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it('should fail if episode not found', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      const result = await service.deleteEpisode(deleteEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${deleteEpisodeArgs.podcastId} not found`,
      });
    });
    it('should delete an existing episode', async () => {
      podcastRepository.findOne.mockResolvedValue(mockedPodcast);
      const result = await service.deleteEpisode(deleteEpisodeArgs);
      expect(result).toEqual({ ok: true });
    });
    it('should fail on exception', async () => {
      episodeRepository.delete.mockRejectedValue(new Error());
      const result = await service.deleteEpisode(deleteEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Internal server error occurred.',
      });
    });
  });

  describe('updateEpisode', () => {
    const updateEpisodeArgs: UpdateEpisodeInput = {
      podcastId: 1,
      episodeId: 1,
      title: 'updated test',
    };
    const mockedPodcast: Podcast = {
      id: 1,
      title: 'test',
      category: 'test',
      rating: 0,
      episodes: [
        {
          id: 1,
          title: 'test episode 1',
          category: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'test episode 2',
          category: 'test 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it('should fail if episode not found', async () => {
      podcastRepository.findOne.mockResolvedValue(undefined);
      const result = await service.updateEpisode(updateEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: `Podcast with id ${updateEpisodeArgs.podcastId} not found`,
      });
    });
    it('should update an existing episode', async () => {
      podcastRepository.findOne.mockResolvedValue(mockedPodcast);
      episodeRepository.save.mockResolvedValue(mockedPodcast);
      const result = await service.updateEpisode(updateEpisodeArgs);
      expect(result).toEqual({ ok: true });
    });
    it('should fail on exception', async () => {
      episodeRepository.save.mockRejectedValue(new Error());
      const result = await service.updateEpisode(updateEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Internal server error occurred.',
      });
    });
  });
});
