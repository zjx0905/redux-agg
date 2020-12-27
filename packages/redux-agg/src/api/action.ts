import { Action as ReduxAction } from 'redux';
import { Model } from './model';

export type Payload = never;

export interface ExtraProps {
  [extraProps: string]: any;
}

/**
 * Action 是一个普通对象，用于描述此次操作的意图
 *
 * - Action.type 用于描述操作类型
 *
 * - Action.payload 用于携带额外数据
 *
 * ```ts
 * const action: Action<string> = {
 *   type: 'namespace/method',
 *   payload: 'data'
 * }
 * ```
 * - 不需要携带额外数据时可以省略 payload
 *
 * ```ts
 * const action: Action = {
 *   type: 'namespace/method'
 * }
 * ```
 */
export type Action<P = Payload> = [P] extends [Payload]
  ? ReduxAction<string> & {
      extraProps?: ExtraProps;
    } & ExtraProps
  : ReduxAction<string> & {
      payload: P;
      extraProps?: ExtraProps;
    } & ExtraProps;

export interface ActionCreator {
  <P = Payload>(
    method: string,
    payload?: Action<P>['payload'],
    extraProps?: ExtraProps
  ): Action<P>;
}

export interface ActionHelper {
  <P = Payload>(
    payload?: Action<P>['payload'],
    extraProps?: ExtraProps
  ): Action<P>;
}

export type ActionHelpers<T extends Model> = {
  [K in keyof (T['reducers'] & T['effects'])]: ActionHelper;
};

export function createActionCreator(namespace: string): ActionCreator {
  return function createAction<P = Payload>(
    method: string,
    payload?: Action<P>['payload'],
    extraProps?: ExtraProps
  ): Action<P> {
    const action = Object.create(null);
    action.type = `${namespace}/${method}`;
    action.payload = payload;
    action.extraProps = extraProps;

    return action;
  };
}

export function createActionHelpers<T extends Model>(
  model: T
): ActionHelpers<T> {
  const { namespace, reducers, effects } = model;
  const actionHelpers = Object.create(null);
  const methods = [
    ...new Set([...Object.keys(reducers), ...Object.keys(effects ?? {})]),
  ];
  const createAction = createActionCreator(namespace);
  methods.forEach((method) => {
    actionHelpers[method] = function actionHelper<P = Payload>(
      payload?: Action<P>['payload'],
      extraProps?: ExtraProps
    ): Action<P> {
      return createAction(method, payload, extraProps);
    };
  });
  return actionHelpers;
}
