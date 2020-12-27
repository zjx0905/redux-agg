import { isFunction, isPlainObject } from '../helpers/type';
import { Action, Payload } from '../api/action';
import { Context } from './context';
import { createEffectMiddlewareStack } from '../api/effectMiddleware';
import { Model, State } from '../api/model';

export interface Effect<SS = any, S extends State = State, P = Payload> {
  (context: Context<SS, S, P>, payload: Action<P>['payload']): Promise<void>;
}

export interface EffectsObject<SS = any, S extends State = State, P = Payload> {
  [key: string]: Effect<SS, S, P>;
}

export interface PerformerCallBack {
  (): Promise<void>;
}

export interface SideEffect<SS = any, S extends State = State, P = Payload> {
  (context: Context<SS, S, P>): Promise<void> | void;
}

const sideEffectsMap = new Map();

export function tryHitSideEffects<
  SS = any,
  S extends State = State,
  P = Payload
>(context: Context<SS, S, P>): Promise<void> | void {
  const sideEffect = sideEffectsMap.get(context.namespace);

  if (!isFunction(sideEffect)) {
    return;
  }

  return sideEffect(context);
}

async function asyncPerformer<SS = any, S extends State = State, P = Payload>(
  context: Context<SS, S, P>,
  callback: PerformerCallBack
): Promise<void> {
  const middlewareStack = await Promise.resolve(
    createEffectMiddlewareStack(context)
  );

  function middlewareNext(): Promise<void> {
    const middleware = middlewareStack.shift();

    if (isFunction(middleware)) {
      return middleware(context, middlewareNext);
    }

    if (middlewareStack.length) {
      return middlewareNext();
    }

    return callback();
  }

  return middlewareNext();
}

export function increasedSideEffects<
  SS = any,
  S extends State = State,
  P = Payload
>(model: Model<SS, S, P>): void {
  const { namespace, effects } = model;

  if (!isPlainObject(effects)) {
    return;
  }

  function sideEffect(context: Context<SS, S, P>): Promise<void> | void {
    const { method, payload } = context;
    const effect = effects![method];

    if (!isFunction(effect)) {
      return;
    }

    return asyncPerformer(
      context,
      (): Promise<void> => {
        return effect(context, payload);
      }
    );
  }

  sideEffectsMap.set(namespace, sideEffect);
}

export function reduceSideEffects(namespace: string): void {
  if (sideEffectsMap.has(namespace)) {
    sideEffectsMap.delete(namespace);
  }
}
