import { ValidationError } from '../types/validation-error';

// Оборачивает список ошибок в единый формат ответа ДЗ: { errorsMessages: [...] }.
export const createErrorMessages = (
  errors: ValidationError[],
): { errorsMessages: ValidationError[] } => {
  return { errorsMessages: errors };
};
