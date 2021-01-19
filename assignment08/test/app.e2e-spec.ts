import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { getConnection, Repository } from 'typeorm';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { AppModule } from './../src/app.module';

const GRAPHQL_ENDPOINT = '/graphql';

const testPodcast = {
  title: 'test',
  category: 'test',
};

const testUser = {
  email: 'flynn@flynnpark.dev',
  password: 'flynndev',
};

describe('App (e2e)', () => {
  let app: INestApplication;
  let podcastsRepository: Repository<Podcast>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    podcastsRepository = moduleFixture.get<Repository<Podcast>>(
      getRepositoryToken(Podcast)
    );
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('Podcasts Resolver', () => {
    describe('createPodcast', () => {
      it('should create a new podcast', () =>
        request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `mutation {
              createPodcast(input: {
                title: "${testPodcast.title}",
                category: "${testPodcast.category}",
              }) {
                ok
                id
              }
            }`,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createPodcast.ok).toBe(true);
            expect(res.body.data.createPodcast.id).toBe(1);
          }));
    });
    describe('getAllPodcasts', () => {
      let podcastIds: number[];
      beforeAll(async () => {
        const podcasts = await podcastsRepository.find();
        podcastIds = podcasts.map((podcast) => podcast.id);
      });
      it('should get all podcasts', () =>
        request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `{
              getAllPodcasts {
                ok
                podcasts {
                  id
                }
              }
            }`,
          })
          .expect(200)
          .expect((res) => {
            const {
              body: {
                data: {
                  getAllPodcasts: { ok, podcasts },
                },
              },
            } = res;
            const receivedPodcastIds = podcasts.map((podcast) => podcast.id);
            expect(ok).toBe(true);
            expect(receivedPodcastIds).toStrictEqual(podcastIds);
          }));
    });
    describe('getPodcast', () => {
      let podcastId: number;
      beforeAll(async () => {
        const [podcast] = await podcastsRepository.find();
        podcastId = podcast.id;
      });
      it('should get a podcast', () =>
        request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `{
              getPodcast(input: {id: ${podcastId}}) {
                ok
                podcast {
                  id
                }
              }
            }`,
          })
          .expect(200)
          .expect((res) => {
            const {
              body: {
                data: {
                  getPodcast: {
                    ok,
                    podcast: { id },
                  },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(id).toBe(podcastId);
          }));
      it('should fail get a podcast', () =>
        request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `{
            getPodcast(input: {id: ${podcastId + 1}}) {
              ok
              error
              podcast {
                id
              }
            }
          }`,
          })
          .expect(200)
          .expect((res) => {
            const {
              body: {
                data: {
                  getPodcast: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe(`Podcast with id ${podcastId + 1} not found`);
          }));
    });
    it.todo('getEpisodes');
    it.todo('deletePodcast');
    it.todo('updatePodcast');
    it.todo('createEpisode');
    it.todo('updateEpisode');
    it.todo('deleteEpisode');
  });
  describe('Users Resolver', () => {
    describe('createAccount', () => {
      it('should create a new account', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
          mutation {
            createAccount(input: {
              email: "${testUser.email}",
              password: "${testUser.password}",
              role: Host
            }) {
              ok
              error
            }
          }
        `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createAccount.ok).toBe(true);
            expect(res.body.data.createAccount.error).toBe(null);
          });
      });
      it('should fail if account already exists', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
          mutation {
            createAccount(input: {
              email: "${testUser.email}",
              password: "${testUser.password}",
              role: Host
            }) {
              ok
              error
            }
          }
        `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createAccount.ok).toBe(false);
            expect(res.body.data.createAccount.error).toBe(
              'There is a user with that email already'
            );
          });
      });
    });
    it.todo('me');
    it.todo('seeProfile');
    it.todo('login');
    it.todo('editProfile');
  });
});
