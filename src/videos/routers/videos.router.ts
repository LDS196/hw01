import { Router } from 'express';
import { getVideoListHandler } from './handlers/get-video-list.handler';
import { createVideoHandler } from './handlers/create-video.handler';
import { updateVideoHandler } from './handlers/update-video.handler';
import { deleteVideoHandler } from './handlers/delete-video.handler';
import { VIDEOS_ROUTES } from '../constants/videos.paths';
import { getVideoHandler } from './handlers/get-video.handler';

export const videosRouter = Router();

videosRouter
  .get(VIDEOS_ROUTES.ROOT, getVideoListHandler)
  .get(VIDEOS_ROUTES.BY_ID, getVideoHandler)
  .post(VIDEOS_ROUTES.ROOT, createVideoHandler)
  .put(VIDEOS_ROUTES.BY_ID, updateVideoHandler)
  .delete(VIDEOS_ROUTES.BY_ID, deleteVideoHandler);
