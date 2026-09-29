import { ValidationError } from '../../core/types/validation-error';
import { VideoInputDto } from '../dto/video.input.dto';
import { AVAILABLE_RESOLUTIONS } from '../types/video';

const TITLE_MAX_LENGTH = 400;
const AUTHOR_MAX_LENGTH = 200;
const MIN_AGE = 1;
const MAX_AGE = 18;

const isIsoDateString = (value: string): boolean => {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
};

export const validateVideoInputDto = (
  data: Partial<VideoInputDto>,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (
    typeof data.title !== 'string' ||
    !data.title.trim() ||
    data.title.trim().length > TITLE_MAX_LENGTH
  ) {
    errors.push({ field: 'title', message: 'Invalid title' });
  }

  if (
    typeof data.author !== 'string' ||
    !data.author.trim() ||
    data.author.trim().length > AUTHOR_MAX_LENGTH
  ) {
    errors.push({ field: 'author', message: 'Invalid author' });
  }

  if (
    !Array.isArray(data.availableResolutions) ||
    data.availableResolutions.some(
      (item) => !AVAILABLE_RESOLUTIONS.includes(item),
    )
  ) {
    errors.push({
      field: 'availableResolutions',
      message: 'Invalid availableResolutions',
    });
  }

  if (
    data.canBeDownloaded !== undefined &&
    typeof data.canBeDownloaded !== 'boolean'
  ) {
    errors.push({
      field: 'canBeDownloaded',
      message: 'Invalid canBeDownloaded',
    });
  }

  if (data.minAgeRestriction !== undefined && data.minAgeRestriction !== null) {
    const age = data.minAgeRestriction;
    if (!Number.isInteger(age) || age < MIN_AGE || age > MAX_AGE) {
      errors.push({
        field: 'minAgeRestriction',
        message: 'Invalid minAgeRestriction',
      });
    }
  }

  if (
    data.publicationDate !== undefined &&
    (typeof data.publicationDate !== 'string' ||
      !isIsoDateString(data.publicationDate))
  ) {
    errors.push({
      field: 'publicationDate',
      message: 'Invalid publicationDate',
    });
  }

  return errors;
};
