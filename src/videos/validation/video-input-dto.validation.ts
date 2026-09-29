import { ValidationError } from '../../core/types/validation-error';
import {
  CreateVideoInputDto,
  UpdateVideoInputDto,
} from '../dto/video.input.dto';
import { AVAILABLE_RESOLUTIONS } from '../types/video';

const TITLE_MAX_LENGTH = 40;
const AUTHOR_MAX_LENGTH = 20;
const MIN_AGE = 1;
const MAX_AGE = 18;

const isIsoDateString = (value: string): boolean => {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
};

const validateTitle = (title: unknown, errors: ValidationError[]): void => {
  if (
    typeof title !== 'string' ||
    !title.trim() ||
    title.length > TITLE_MAX_LENGTH
  ) {
    errors.push({ field: 'title', message: 'Invalid title' });
  }
};

const validateAuthor = (author: unknown, errors: ValidationError[]): void => {
  if (
    typeof author !== 'string' ||
    !author.trim() ||
    author.length > AUTHOR_MAX_LENGTH
  ) {
    errors.push({ field: 'author', message: 'Invalid author' });
  }
};

const validateAvailableResolutions = (
  availableResolutions: unknown,
  errors: ValidationError[],
  minCount: number,
): void => {
  if (
    !Array.isArray(availableResolutions) ||
    availableResolutions.length < minCount ||
    availableResolutions.some((item) => !AVAILABLE_RESOLUTIONS.includes(item))
  ) {
    errors.push({
      field: 'availableResolutions',
      message: 'Invalid availableResolutions',
    });
  }
};

const validateMinAgeRestriction = (
  minAgeRestriction: unknown,
  errors: ValidationError[],
  required: boolean,
): void => {
  if (
    !required &&
    (minAgeRestriction === undefined || minAgeRestriction === null)
  ) {
    return;
  }

  if (minAgeRestriction === null) {
    return;
  }

  if (
    !Number.isInteger(minAgeRestriction) ||
    (minAgeRestriction as number) < MIN_AGE ||
    (minAgeRestriction as number) > MAX_AGE
  ) {
    errors.push({
      field: 'minAgeRestriction',
      message: 'Invalid minAgeRestriction',
    });
  }
};

export const validateCreateVideoInputDto = (
  data: Partial<CreateVideoInputDto>,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  validateTitle(data.title, errors);
  validateAuthor(data.author, errors);
  validateAvailableResolutions(data.availableResolutions, errors, 1);

  return errors;
};

export const validateUpdateVideoInputDto = (
  data: Partial<UpdateVideoInputDto>,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  validateTitle(data.title, errors);
  validateAuthor(data.author, errors);
  validateAvailableResolutions(data.availableResolutions, errors, 1);

  if (typeof data.canBeDownloaded !== 'boolean') {
    errors.push({
      field: 'canBeDownloaded',
      message: 'Invalid canBeDownloaded',
    });
  }

  if (data.minAgeRestriction === undefined) {
    errors.push({
      field: 'minAgeRestriction',
      message: 'Invalid minAgeRestriction',
    });
  } else {
    validateMinAgeRestriction(data.minAgeRestriction, errors, true);
  }

  if (
    typeof data.publicationDate !== 'string' ||
    !isIsoDateString(data.publicationDate)
  ) {
    errors.push({
      field: 'publicationDate',
      message: 'Invalid publicationDate',
    });
  }

  return errors;
};
