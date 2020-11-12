import { assert } from '../helpers/assert';
import { isFunction, isString } from '../helpers/type';
import { MIDDLEWARE_GLOBAL_TYPE } from '../helpers/strings';
import { Context } from '../model/context';
import { Store } from './store';
import { Payload } from './action';
import { State } from './model';

/**
 * 中间件
 */
export interface Middleware<SS = any, S extends State = State, P = Payload> {
  (context: Context<SS, S, P>, next: MiddlewareNext): Promise<void>;
}

/**
 * 中间件继续执行下一个任务
 */
export interface MiddlewareNext {
  (): Promise<void>;
}

/**
 * 注册中间件
 */
export interface UseMiddleware<S extends State = State, P = Payload> {
  <SS = any>(middleware: Middleware<SS, S, P>): Store<S, P>;
  <SS = any>(namespace: string, middleware: Middleware<SS, S, P>): Store<S, P>;
}

/**
 * 注销中间件
 */
export interface UnusedMiddleware<S extends State = State, P = Payload> {
  <SS = any>(middleware: Middleware<SS, S, P>): Store<S, P>;
  <SS = any>(namespace: string, middleware: Middleware<SS, S, P>): Store<S, P>;
}

const middlewaresMap = new Map();

export function createMiddlewareStack<
  SS = any,
  S extends State = State,
  P = Payload
>(context: Context<SS, S, P>): Middleware<SS, S, P>[] {
  const middlewareStack: Middleware<SS, S, P>[] = [];
  const { type, namespace } = context;
  return middlewareStack.concat(
    getMiddlewares(MIDDLEWARE_GLOBAL_TYPE),
    getMiddlewares(namespace),
    getMiddlewares(type)
  );
}

function getMiddlewares<SS = any, S extends State = State, P = Payload>(
  namepaceOrMiddleware: string
): Middleware<SS, S, P>[] {
  return middlewaresMap.get(namepaceOrMiddleware) ?? [];
}

function setMiddlewares<SS = any, S extends State = State, P = Payload>(
  namepaceOrMiddleware: string,
  middlewares: Middleware<SS, S, P>[]
): void {
  middlewaresMap.set(namepaceOrMiddleware, middlewares);
}

export function defineMiddleware<
  SS = any,
  S extends State = State,
  P = Payload
>(middleware: Middleware<SS, S, P>): Middleware<SS, S, P> {
  return middleware;
}

export function use<S extends State = State, P = Payload>(
  store: Store<S, P>
): void {
  store.use = function useMiddleware<SS = any>(
    namepaceOrMiddleware: string | Middleware<SS, S, P>,
    middleware?: Middleware<SS, S, P>
  ): Store<S, P> {
    if (isFunction(namepaceOrMiddleware)) {
      return useMiddleware(MIDDLEWARE_GLOBAL_TYPE, namepaceOrMiddleware);
    }

    assert(isString(namepaceOrMiddleware), 'namespace 必须是一个字符串。');
    assert(isFunction(middleware), 'middleware 必须是一个函数。');

    const middlewares = getMiddlewares(namepaceOrMiddleware);
    middlewares.push(middleware as any);
    setMiddlewares(namepaceOrMiddleware, middlewares);
    return store;
  };
}

export function unused<S extends State = State, P = Payload>(
  store: Store<S, P>
): void {
  store.unused = function unusedMiddleware<SS = any>(
    namepaceOrMiddleware: string | Middleware<SS, S, P>,
    middleware?: Middleware<SS, S, P>
  ): Store<S, P> {
    if (isFunction(namepaceOrMiddleware)) {
      return unusedMiddleware(MIDDLEWARE_GLOBAL_TYPE, namepaceOrMiddleware);
    }

    assert(isString(namepaceOrMiddleware), 'namespace 必须是一个字符串。');
    assert(isFunction(middleware), 'middleware 必须是一个函数。');

    const middlewares = getMiddlewares(namepaceOrMiddleware);
    const index = middlewares.indexOf(middleware as any);

    if (index !== -1) {
      middlewares.splice(index, 1);
    }

    setMiddlewares(namepaceOrMiddleware, middlewares);
    return store;
  };
}
