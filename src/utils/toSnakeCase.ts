import { snakeCase } from 'lodash';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }

  if (isObject(obj)) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = snakeCase(key);
      const value = obj[key];

      if (value instanceof Date) {
        acc[snakeKey] = value.toISOString();
      } else {
        acc[snakeKey] = toSnakeCase(value);
      }

      return acc;
    }, {} as Record<string, any>);
  }

  return obj;
}

export default toSnakeCase;
