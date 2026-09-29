import { Video } from '../videos/types/video';

export const db = {
  videos: <Video[]>[
    {
      id: 1,
      title: 'Video 1',
      author: 'Author 1',
      canBeDownloaded: true,
      minAgeRestriction: 18,
      createdAt: '2026-01-01',
      publicationDate: '2026-01-01',
      availableResolutions: ['P720', 'P1080', 'P1440', 'P2160'],
    },
    {
      id: 2,
      title: 'Video 2',
      author: 'Author 2',
      canBeDownloaded: true,
      minAgeRestriction: 18,
      createdAt: '2026-01-01',
      publicationDate: '2026-01-01',
      availableResolutions: [
        'P144',
        'P240',
        'P360',
        'P480',
        'P720',
        'P1080',
        'P1440',
        'P2160',
      ],
    },
  ],
};
