import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import {
  CreateVideoInputDto,
  UpdateVideoInputDto,
} from '../../../src/videos/dto/video.input.dto';
import { VIDEOS_PATH } from '../../../src/videos/constants/videos.paths';
import {
  TESTING_PATH,
  TESTING_ROUTES,
} from '../../../src/testing/constants/testing.paths';

describe('Video API', () => {
  const app = express();
  setupApp(app);

  const testVideoData: CreateVideoInputDto = {
    title: 'Inception',
    author: 'Nolan',
    availableResolutions: ['P720', 'P1080'],
  };

  beforeAll(async () => {
    await request(app)
      .delete(`${TESTING_PATH}${TESTING_ROUTES.ALL_DATA}`)
      .expect(HttpStatus.NoContent);
  });

  it('✅ should create video; POST /api/videos', async () => {
    const newVideo: CreateVideoInputDto = {
      ...testVideoData,
      title: 'Interstellar',
      author: 'Christopher Nolan',
    };

    const createResponse = await request(app)
      .post(VIDEOS_PATH)
      .send(newVideo)
      .expect(HttpStatus.Created);

    expect(createResponse.body).toEqual({
      id: expect.any(Number),
      title: newVideo.title,
      author: newVideo.author,
      availableResolutions: newVideo.availableResolutions,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    });
  });

  it('✅ should return videos list; GET /api/videos', async () => {
    await request(app)
      .post(VIDEOS_PATH)
      .send({ ...testVideoData, title: 'Another Video' })
      .expect(HttpStatus.Created);

    await request(app)
      .post(VIDEOS_PATH)
      .send({ ...testVideoData, title: 'Another Video 2' })
      .expect(HttpStatus.Created);

    const videoListResponse = await request(app)
      .get(VIDEOS_PATH)
      .expect(HttpStatus.Ok);

    expect(videoListResponse.body).toBeInstanceOf(Array);
    expect(videoListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should return video by id; GET /api/videos/:id', async () => {
    const createResponse = await request(app)
      .post(VIDEOS_PATH)
      .send({ ...testVideoData, title: 'Another Video' })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`${VIDEOS_PATH}/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it('✅ should update video; PUT /api/videos/:id', async () => {
    const createResponse = await request(app)
      .post(VIDEOS_PATH)
      .send({ ...testVideoData, title: 'Another Video' })
      .expect(HttpStatus.Created);

    const videoUpdateData: UpdateVideoInputDto = {
      ...testVideoData,
      title: 'Updated Title',
      author: 'Updated Author',
      availableResolutions: ['P144', 'P2160'],
      canBeDownloaded: true,
      minAgeRestriction: 16,
      publicationDate: '2026-02-01T00:00:00.000Z',
    };

    await request(app)
      .put(`${VIDEOS_PATH}/${createResponse.body.id}`)
      .send(videoUpdateData)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(
      `${VIDEOS_PATH}/${createResponse.body.id}`,
    );

    expect(videoResponse.body).toEqual({
      ...createResponse.body,
      ...videoUpdateData,
      id: createResponse.body.id,
      createdAt: createResponse.body.createdAt,
    });
  });

  it(`✅ DELETE /api/videos/:id and check after NOT FOUND`, async () => {
    const res = await request(app)
      .post(VIDEOS_PATH)
      .send({ ...testVideoData, title: 'Another Video' })
      .expect(HttpStatus.Created);

    await request(app)
      .delete(`${VIDEOS_PATH}/${res.body.id}`)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(
      `${VIDEOS_PATH}/${res.body.id}`,
    );
    expect(videoResponse.status).toBe(HttpStatus.NotFound);
  });
});
