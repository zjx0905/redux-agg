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
export interface EffectMiddleware<
  SS = any,
  S extends State = State,
  P = Payload
> {
  (context: Context<SS, S, P>, next: EffectMiddlewareNext): Promise<void>;
}

/**
 * 中间件继续执行下一个任务
 */
export interface EffectMiddlewareNext {
  (): Promise<void>;
}

/**
 * 注册中间件
 */
export interface UseEffectMiddleware<S extends State = State, P = Payload> {
  <SS = any>(middleware: EffectMiddleware<SS, S, P>): Store<S, P>;
  <SS = any>(namespace: string, middleware: EffectMiddleware<SS, S, P>): Store<
    S,
    P
  >;
}

/**
 * 注销中间件
 */
export interface UnusedEffectMiddleware<S extends State = State, P = Payload> {
  <SS = any>(middleware: EffectMiddleware<SS, S, P>): Store<S, P>;
  <SS = any>(namespace: string, middleware: EffectMiddleware<SS, S, P>): Store<
    S,
    P
  >;
}

const middlewaresMap = new Map();

export function createEffectMiddlewareStack<
  SS = any,
  S extends State = State,
  P = Payload
>(context: Context<SS, S, P>): EffectMiddleware<SS, S, P>[] {
  const middlewareStack: EffectMiddleware<SS, S, P>[] = [];
  const { type, namespace } = context;
  return middlewareStack.concat(
    getEffectMiddlewares(MIDDLEWARE_GLOBAL_TYPE),
    getEffectMiddlewares(namespace),
    getEffectMiddlewares(type)
  );
}

function getEffectMiddlewares<SS = any, S extends State = State, P = Payload>(
  namepace: string
): EffectMiddleware<SS, S, P>[] {
  return middlewaresMap.get(namepace) ?? [];
}

function setEffectMiddlewares<SS = any, S extends State = State, P = Payload>(
  namepace: string,
  middlewares: EffectMiddleware<SS, S, P>[]
): void {
  middlewaresMap.set(namepace, middlewares);
}

export function initEffectMiddleware<S extends State = State, P = Payload>(
  store: Store<S, P>
): void {
  store.use = function useEffectMiddleware<SS = any>(
    namepace: string | EffectMiddleware<SS, S, P>,
    middleware?: EffectMiddleware<SS, S, P>
  ): Store<S, P> {
    if (isFunction(namepace)) {
      return useEffectMiddleware(MIDDLEWARE_GLOBAL_TYPE, namepace);
    }

    assert(isString(namepace), 'namespace 必须是一个字符串。');
    assert(isFunction(middleware), 'middleware 必须是一个函数。');

    const middlewares = getEffectMiddlewares(namepace);
    middlewares.push(middleware as any);
    setEffectMiddlewares(namepace, middlewares);
    return store;
  };

  store.unused = function unusedEffectMiddleware<SS = any>(
    namepace: string | EffectMiddleware<SS, S, P>,
    middleware?: EffectMiddleware<SS, S, P>
  ): Store<S, P> {
    if (isFunction(namepace)) {
      return unusedEffectMiddleware(MIDDLEWARE_GLOBAL_TYPE, namepace);
    }

    assert(isString(namepace), 'namespace 必须是一个字符串。');
    assert(isFunction(middleware), 'middleware 必须是一个函数。');

    const middlewares = getEffectMiddlewares(namepace);
    const index = middlewares.indexOf(middleware as any);

    if (index !== -1) {
      middlewares.splice(index, 1);
    }

    return store;
  };
}
