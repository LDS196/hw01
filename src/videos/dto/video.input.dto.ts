import { AvailableResolutions } from '../types/video';

// POST /api/videos — CreateVideoInputModel: только эти три поля.
export type CreateVideoInputDto = {
  title: string;
  author: string;
  availableResolutions: AvailableResolutions[];
};

// PUT /api/videos/:id — все поля обязательны (UpdateVideoInputModel).
export type UpdateVideoInputDto = {
  title: string;
  author: string;
  availableResolutions: AvailableResolutions[];
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};
