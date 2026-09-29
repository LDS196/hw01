import { OpenAPIV3 } from 'openapi-types';
import { AVAILABLE_RESOLUTIONS } from '../../videos/types/video';
import { VIDEOS_PATH } from '../../videos/constants/videos.paths';
import {
  TESTING_PATH,
  TESTING_ROUTES,
} from '../../testing/constants/testing.paths';

const availableResolutionsSchema: OpenAPIV3.SchemaObject = {
  type: 'string',
  enum: [...AVAILABLE_RESOLUTIONS],
  example: 'P1080',
};

const videoInputDtoSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'author', 'availableResolutions'],
  properties: {
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 400,
      example: 'Inception',
    },
    author: {
      type: 'string',
      minLength: 1,
      maxLength: 200,
      example: 'Nolan',
    },
    availableResolutions: {
      type: 'array',
      items: { $ref: '#/components/schemas/AvailableResolutions' },
      example: ['P720', 'P1080'],
    },
    canBeDownloaded: { type: 'boolean', example: false },
    minAgeRestriction: {
      type: 'integer',
      nullable: true,
      minimum: 1,
      maximum: 18,
      example: 16,
    },
    publicationDate: {
      type: 'string',
      format: 'date-time',
      example: '2026-02-01T00:00:00.000Z',
    },
  },
};

const videoSchema: OpenAPIV3.SchemaObject = {
  allOf: [
    { $ref: '#/components/schemas/VideoInputDto' },
    {
      type: 'object',
      required: [
        'id',
        'createdAt',
        'canBeDownloaded',
        'minAgeRestriction',
        'publicationDate',
      ],
      properties: {
        id: { type: 'integer', example: 1 },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2026-09-26T16:00:00.000Z',
        },
        canBeDownloaded: { type: 'boolean', example: false },
        minAgeRestriction: {
          type: 'integer',
          nullable: true,
          minimum: 1,
          maximum: 18,
          example: null,
        },
        publicationDate: {
          type: 'string',
          format: 'date-time',
          example: '2026-09-27T16:00:00.000Z',
        },
      },
    },
  ],
};

const validationErrorSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['field', 'message'],
  properties: {
    field: { type: 'string', example: 'title' },
    message: { type: 'string', example: 'Invalid title' },
  },
};

const errorResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['errorMessages'],
  properties: {
    errorMessages: {
      type: 'array',
      items: { $ref: '#/components/schemas/ValidationError' },
    },
  },
};

const errorResponseRef: OpenAPIV3.MediaTypeObject = {
  schema: { $ref: '#/components/schemas/ErrorResponse' },
};

export const openApiDocument: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Videos API',
    version: '1.0.0',
    description: 'API для управления видео',
  },
  tags: [
    { name: 'Videos', description: 'Видео' },
    { name: 'Testing', description: 'Служебные эндпоинты для e2e' },
  ],
  paths: {
    [VIDEOS_PATH]: {
      get: {
        tags: ['Videos'],
        summary: 'Список видео',
        responses: {
          200: {
            description: 'Список видео',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Video' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Videos'],
        summary: 'Создать видео',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VideoInputDto' },
            },
          },
        },
        responses: {
          201: {
            description: 'Видео создано',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Video' },
              },
            },
          },
          400: {
            description: 'Ошибка валидации',
            content: { 'application/json': errorResponseRef },
          },
        },
      },
    },
    [`${VIDEOS_PATH}/{id}`]: {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
        },
      ],
      get: {
        tags: ['Videos'],
        summary: 'Видео по id',
        responses: {
          200: {
            description: 'Видео найдено',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Video' },
              },
            },
          },
          404: {
            description: 'Видео не найдено',
            content: { 'application/json': errorResponseRef },
          },
        },
      },
      put: {
        tags: ['Videos'],
        summary: 'Обновить видео',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VideoInputDto' },
            },
          },
        },
        responses: {
          204: { description: 'Обновлено' },
          400: {
            description: 'Ошибка валидации',
            content: { 'application/json': errorResponseRef },
          },
          404: {
            description: 'Видео не найдено',
            content: { 'application/json': errorResponseRef },
          },
        },
      },
      delete: {
        tags: ['Videos'],
        summary: 'Удалить видео',
        responses: {
          204: { description: 'Удалено' },
          404: {
            description: 'Видео не найдено',
            content: { 'application/json': errorResponseRef },
          },
        },
      },
    },
    [`${TESTING_PATH}${TESTING_ROUTES.ALL_DATA}`]: {
      delete: {
        tags: ['Testing'],
        summary: 'Очистить in-memory БД',
        responses: {
          204: { description: 'Данные удалены' },
        },
      },
    },
  },
  components: {
    schemas: {
      AvailableResolutions: availableResolutionsSchema,
      VideoInputDto: videoInputDtoSchema,
      Video: videoSchema,
      ValidationError: validationErrorSchema,
      ErrorResponse: errorResponseSchema,
    },
  },
};
