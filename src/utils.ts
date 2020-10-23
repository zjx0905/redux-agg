export function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined";
}

export function isNull(value: unknown): value is null {
  return typeof value === null;
}

export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export default function warning(message: string): void {
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error(message);
  }
  try {
    throw new Error(message);
  } catch (e) {}
}

export function isPromise<T = unknown>(value: any): value is Promise<T> {
  return value && isFunction(value.then);
}

export function keys(value: object): string[] {
  return Object.keys(value);
}

export function create(obj: object | null = null): object {
  return Object.create(obj);
}

export function assert(succeed: boolean, message: string): void {
  if (!succeed) {
    throw new Error(`[redux-agg]: ${message}`);
  }
}

export function assign(...objects: object[]): object {
  return Object.assign({}, ...objects);
}
