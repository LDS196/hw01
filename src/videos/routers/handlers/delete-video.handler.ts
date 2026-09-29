import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';

export function deleteVideoHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const index = db.videos.findIndex((item) => item.id === +req.params.id);

  if (index === -1) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Video not found' }]));
    return;
  }

  db.videos.splice(index, 1);
  res.sendStatus(HttpStatus.NoContent);
}
