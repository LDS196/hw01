import { Request, Response } from 'express';
import { Video } from '../../types/video';
import { validateVideoInputDto } from '../../validation/video-input-dto.validation';
import { VideoInputDto } from '../../dto/video.input.dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { db } from '../../../db/in-memory.db';

export function createVideoHandler(
  req: Request<{}, {}, VideoInputDto>,
  res: Response,
) {
  const errors = validateVideoInputDto(req.body);

  if (errors.length) {
    res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
    return;
  }

  const lastVideo = db.videos[db.videos.length - 1];
  const createdAt = new Date().toISOString();
  const publicationDate =
    req.body.publicationDate ??
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const newVideo: Video = {
    id: lastVideo ? lastVideo.id + 1 : 1,
    title: req.body.title,
    author: req.body.author,
    availableResolutions: req.body.availableResolutions,
    canBeDownloaded: req.body.canBeDownloaded ?? false,
    minAgeRestriction: req.body.minAgeRestriction ?? null,
    createdAt,
    publicationDate,
  };

  db.videos.push(newVideo);
  res.status(HttpStatus.Created).send(newVideo);
}
