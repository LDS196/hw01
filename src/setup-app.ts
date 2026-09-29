import express, { Express, Request, Response } from 'express';
import { HttpStatus } from './core/types/http-statuses';
import { VIDEOS_PATH } from './videos/constants/videos.paths';
import { videosRouter } from './videos/routers/videos.router';
import { TESTING_PATH } from './testing/constants/testing.paths';
import { testingRouter } from './testing/routers/testing.router';
import { setupSwagger } from './core/swagger/setup-swagger';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send('Hello world');
  });

  app.use(VIDEOS_PATH, videosRouter);
  app.use(TESTING_PATH, testingRouter);
  setupSwagger(app);

  app.use((req: Request, res: Response) => {
    res.sendStatus(HttpStatus.NotFound);
  });

  return app;
};
