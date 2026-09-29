export const AVAILABLE_RESOLUTIONS = [
  'P144',
  'P240',
  'P360',
  'P480',
  'P720',
  'P1080',
  'P1440',
  'P2160',
] as const;

export type AvailableResolutions = (typeof AVAILABLE_RESOLUTIONS)[number];

// Данные храним в массиве в памяти, поэтому id — обычное число (позже, с БД, станет строкой).
export type Video = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: AvailableResolutions[];
};
