import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
export function getVideoHandler(req: Request<{ id: string }>, res: Response) {
  const video = db.videos.find((item) => item.id === +req.params.id);

  if (!video) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Video not found' }]));
    return;
  }

  res.status(HttpStatus.Ok).send(video);
}
