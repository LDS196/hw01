import { Request, Response } from 'express';
import { Video } from '../../types/video';
import { validateCreateVideoInputDto } from '../../validation/video-input-dto.validation';
import { CreateVideoInputDto } from '../../dto/video.input.dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { db } from '../../../db/in-memory.db';

export function createVideoHandler(
  req: Request<{}, {}, CreateVideoInputDto>,
  res: Response,
) {
  const errors = validateCreateVideoInputDto(req.body);

  if (errors.length) {
    res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
    return;
  }

  const lastVideo = db.videos[db.videos.length - 1];
  const now = new Date();
  const createdAt = now.toISOString();
  const publicationDate = new Date(
    now.getTime() + 24 * 60 * 60 * 1000,
  ).toISOString();

  const newVideo: Video = {
    id: lastVideo ? lastVideo.id + 1 : 0,
    title: req.body.title,
    author: req.body.author,
    availableResolutions: req.body.availableResolutions,
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt,
    publicationDate,
  };

  db.videos.push(newVideo);
  res.status(HttpStatus.Created).send(newVideo);
}
