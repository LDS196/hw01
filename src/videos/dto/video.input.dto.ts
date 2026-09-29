import { AvailableResolutions } from '../types/video';

// POST /videos — CreateVideoInputModel: только эти три поля.
export type CreateVideoInputDto = {
  title: string;
  author: string;
  availableResolutions: AvailableResolutions[];
};

// PUT /videos/:id — все поля обязательны (UpdateVideoInputModel).
export type UpdateVideoInputDto = {
  title: string;
  author: string;
  availableResolutions: AvailableResolutions[];
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};
