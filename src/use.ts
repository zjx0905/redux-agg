import { Action } from "redux";
import { Context } from "./context";
import { AggAction } from "./reaction";
import { MIDDLEWARE_GLOBAL_KEY } from "./strings";
import { assert, isFunction, isString } from "./utils";

export interface AggMiddleware<S = any, A extends Action<any> = AggAction> {
  (context: Context<S, A>, action: A, next: AggMiddlewareNext): Promise<void>;
}

export interface AggMiddlewareNext {
  (): Promise<void>;
}

export interface Use<S = any, A extends Action<any> = AggAction> {
  (middleware: AggMiddleware<S, A>): Unused;
  (type: string, middleware: AggMiddleware<S, A>): Unused;
}

export interface Unused {
  (): void;
}

const middlewareCollector = new Map<string, AggMiddleware[]>();

export function createStack(aggAction: AggAction): AggMiddleware[] {
  const stack: AggMiddleware[] = [];

  const { namespace, type } = aggAction;

  return stack.concat(
    getMiddlewares(MIDDLEWARE_GLOBAL_KEY),
    getMiddlewares(namespace),
    getMiddlewares(type)
  );
}

function getMiddlewares(key: string): AggMiddleware[] {
  return middlewareCollector.get(key) ?? [];
}

function setMiddlewares(key: string, middlewares: AggMiddleware[]): void {
  middlewareCollector.set(key, middlewares);
}

export function use(middleware: AggMiddleware): Unused;
export function use(type: string, middleware: AggMiddleware): Unused;
export default function use(
  key: string | AggMiddleware,
  middleware?: AggMiddleware
): Unused {
  assert(
    isFunction(key) || (isString(key) && isFunction(middleware)),
    "use need middleware."
  );

  if (isFunction(key)) {
    middleware = key as AggMiddleware;
    key = MIDDLEWARE_GLOBAL_KEY;
  }

  const middlewares = getMiddlewares(key);
  middlewares.push(middleware as AggMiddleware);
  setMiddlewares(key, middlewares);

  return function unused(): void {
    const index = middlewares.indexOf(middleware as AggMiddleware);
    if (index !== -1) {
      middlewares.splice(index, 1);
    }
  };
}
