import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import toSnakeCase from '../../utils/toSnakeCase';

const sensitiveKeys = ['password'];

function isPlainObject(value: any): value is Record<string, any> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

function deepClean(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepClean);
  }

  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (isPlainObject(obj)) {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
      if (!sensitiveKeys.includes(key)) {
        newObj[key] = deepClean(obj[key]);
      }
    }
    return newObj;
  }

  return obj;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => toSnakeCase(deepClean(data))),
    );
  }
}
