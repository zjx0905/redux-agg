import { Model } from '../api/model';

const _toString = Object.prototype.toString;

export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isPromise<T = void>(value: any): value is Promise<T> {
  return value && isFunction(value.then);
}

export function isPlainObject<T extends object>(value: any): value is T {
  return _toString.call(value) === '[object Object]';
}

export function isModel<T extends Model>(value: any): value is T {
  return (
    isPlainObject<T>(value) &&
    isString(value.namespace) &&
    isPlainObject(value.reducers)
  );
}
