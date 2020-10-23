import { Action, AnyAction, Reducer } from "redux";
import { isUndefined } from "./utils";

export interface AggAction<P = any> extends AnyAction {
  namespace: string;
  payload: P;
}

export interface AggReducer<D = any, P = any> {
  (state: D, payload: P): D;
}

export interface AggReducers<D = any, P = any> {
  [key: string]: AggReducer<D, P>;
}

const performReducers = new Map<string, Reducer>();

export function respond<S = any, A extends Action = AggAction>(
  state: S | undefined,
  aggAction: A
) {
  const _state = state ?? ({} as any);
  const currentState: any = {};

  performReducers.forEach((performReducer, key: string) => {
    currentState[key] = performReducer(_state[key], aggAction);
  });

  return currentState;
}

export function synthetic(
  namespace: string,
  defaultState: any,
  reducers: AggReducers
) {
  function performReducer<D = any, A extends Action = AggAction>(
    state: D = defaultState,
    aggAction: A
  ): D {
    const { type, payload } = aggAction as any;
    const currentReducer = reducers[type];

    const currentState = !isUndefined(currentReducer)
      ? currentReducer(state, payload)
      : { ...state };

    return currentState;
  }

  performReducers.set(namespace, performReducer);
}
