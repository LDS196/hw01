import { Request, Response } from 'express';
import { VideoInputDto } from '../../dto/video.input.dto';
import { db } from '../../../db/in-memory.db';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { validateVideoInputDto } from '../../validation/video-input-dto.validation';

export function updateVideoHandler(
  req: Request<{ id: string }, {}, VideoInputDto>,
  res: Response,
) {
  const index = db.videos.findIndex((item) => item.id === +req.params.id);

  if (index === -1) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Video not found' }]));
    return;
  }

  const errors = validateVideoInputDto(req.body);

  if (errors.length) {
    res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
    return;
  }

  const current = db.videos[index];
  db.videos[index] = {
    ...current,
    ...req.body,
    id: current.id,
    createdAt: current.createdAt,
  };

  res.sendStatus(HttpStatus.NoContent);
}
