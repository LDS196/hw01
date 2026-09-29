// Базовый путь модуля видео (задаётся при подключении роутера в setup-app).
export const VIDEOS_PATH = '/api/videos';

// Относительные под-маршруты внутри роутера видео — чтобы не хардкодить строки.
export const VIDEOS_ROUTES = {
  ROOT: '',
  BY_ID: '/:id',
} as const;
