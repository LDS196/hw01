import { Request, Response } from 'express';
import { UpdateVideoInputDto } from '../../dto/video.input.dto';
import { db } from '../../../db/in-memory.db';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { validateUpdateVideoInputDto } from '../../validation/video-input-dto.validation';

export function updateVideoHandler(
  req: Request<{ id: string }, {}, UpdateVideoInputDto>,
  res: Response,
) {
  const index = db.videos.findIndex((item) => item.id === +req.params.id);

  if (index === -1) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Video not found' }]));
    return;
  }

  const errors = validateUpdateVideoInputDto(req.body);

  if (errors.length) {
    res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
    return;
  }

  const current = db.videos[index];
  db.videos[index] = {
    ...current,
    title: req.body.title,
    author: req.body.author,
    availableResolutions: req.body.availableResolutions,
    canBeDownloaded: req.body.canBeDownloaded,
    minAgeRestriction: req.body.minAgeRestriction,
    publicationDate: req.body.publicationDate,
    id: current.id,
    createdAt: current.createdAt,
  };

  res.sendStatus(HttpStatus.NoContent);
}
