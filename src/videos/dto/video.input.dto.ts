// Данные, которые клиент присылает при создании/обновлении dbltj

import { AvailableResolutions } from '../types/video';

// (без служебных id и createdAt — их проставляет сервер).
export type VideoInputDto = {
  title: string;
  author: string;
  availableResolutions: AvailableResolutions[];
  canBeDownloaded?: boolean;
  minAgeRestriction?: number;
  publicationDate?: string;
};
