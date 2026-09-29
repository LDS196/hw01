import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { VideoInputDto } from '../../../src/videos/dto/video.input.dto';
import { VIDEOS_PATH } from '../../../src/videos/constants/videos.paths';
import {
  TESTING_PATH,
  TESTING_ROUTES,
} from '../../../src/testing/constants/testing.paths';

describe('Video API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestVideoData: VideoInputDto = {
    title: 'Inception',
    author: 'Nolan',
    availableResolutions: ['P720', 'P1080'],
    canBeDownloaded: false,
    minAgeRestriction: 16,
    publicationDate: '2026-02-01T00:00:00.000Z',
  };

  beforeAll(async () => {
    await request(app)
      .delete(`${TESTING_PATH}${TESTING_ROUTES.ALL_DATA}`)
      .expect(HttpStatus.NoContent);
  });

  it(`❌ should not create video when incorrect body passed; POST /api/videos`, async () => {
    const invalidDataSet1 = await request(app)
      .post(VIDEOS_PATH)
      .send({
        ...correctTestVideoData,
        title: '   ',
        author: '    ',
        availableResolutions: ['P999'],
        canBeDownloaded: 'yes',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(VIDEOS_PATH)
      .send({
        ...correctTestVideoData,
        title: '',
        author: '',
        availableResolutions: 'P144',
        minAgeRestriction: 0,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post(VIDEOS_PATH)
      .send({
        ...correctTestVideoData,
        title: 'A'.repeat(401),
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);

    const videoListResponse = await request(app).get(VIDEOS_PATH);
    expect(videoListResponse.body).toHaveLength(0);
  });

  it('❌ should not update video when incorrect data passed; PUT /api/videos/:id', async () => {
    const {
      body: { id: createdVideoId },
    } = await request(app)
      .post(VIDEOS_PATH)
      .send({ ...correctTestVideoData })
      .expect(HttpStatus.Created);

    const invalidDataSet1 = await request(app)
      .put(`${VIDEOS_PATH}/${createdVideoId}`)
      .send({
        ...correctTestVideoData,
        title: '   ',
        author: '    ',
        availableResolutions: ['P999'],
        canBeDownloaded: 'yes',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${VIDEOS_PATH}/${createdVideoId}`)
      .send({
        ...correctTestVideoData,
        title: '',
        author: '',
        availableResolutions: 'P144',
        minAgeRestriction: 0,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .put(`${VIDEOS_PATH}/${createdVideoId}`)
      .send({
        ...correctTestVideoData,
        title: 'A'.repeat(401),
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);

    const videoResponse = await request(app).get(
      `${VIDEOS_PATH}/${createdVideoId}`,
    );

    expect(videoResponse.body).toEqual({
      ...correctTestVideoData,
      id: createdVideoId,
      createdAt: expect.any(String),
    });
  });

  it('❌ should not update video when incorrect resolutions passed; PUT /api/videos/:id', async () => {
    const {
      body: { id: createdVideoId },
    } = await request(app)
      .post(VIDEOS_PATH)
      .send({ ...correctTestVideoData })
      .expect(HttpStatus.Created);

    await request(app)
      .put(`${VIDEOS_PATH}/${createdVideoId}`)
      .send({
        ...correctTestVideoData,
        availableResolutions: ['P144', 'invalid-resolution', 'P720'],
      })
      .expect(HttpStatus.BadRequest);

    const videoResponse = await request(app).get(
      `${VIDEOS_PATH}/${createdVideoId}`,
    );

    expect(videoResponse.body).toEqual({
      ...correctTestVideoData,
      id: createdVideoId,
      createdAt: expect.any(String),
    });
  });
});
