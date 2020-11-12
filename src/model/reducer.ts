import { isFunction } from '../helpers/type';
import { Model, State } from '../api/model';
import { Context } from './context';
import { Action, Payload } from '../api/action';

export interface Reducer<SS = any, P = Payload> {
  (state: SS, payload: Action<P>['payload']): SS;
}

export interface ReducersObject<SS = any, P = Payload> {
  [key: string]: Reducer<SS, P>;
}

export interface Respond<SS = any, S extends State = State, P = Payload> {
  (state: SS, context: Context<SS, S, P>): SS;
}

const respondsMap = new Map();

export function reaction<SS = any, S extends State = State, P = Payload>(
  state: S = Object.create(null),
  context: Context<SS, S, P>
) {
  const currentState = Object.create(null);
  respondsMap.forEach((respond, key): void => {
    currentState[key] = respond(state[key], context);
  });
  return currentState;
}

export function enhance<SS = any, S extends State = State, P = Payload>(
  model: Model<SS, S, P>
) {
  const { namespace, defaultState, reducers } = model;

  function respond(state: SS = defaultState, context: Context<SS, S, P>): SS {
    const { namespace: _namespace, method, payload } = context;
    const reducer = reducers[method];
    return _namespace === namespace && isFunction(reducer)
      ? reducer(state, payload)
      : state;
  }

  respondsMap.set(namespace, respond);
}

export function recede(namespace: string): void {
  if (respondsMap.has(namespace)) {
    respondsMap.delete(namespace);
  }
}
