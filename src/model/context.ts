import { Action, Payload } from '../api/action';
import { Store } from '../api/store';
import { State } from '../api/model';

export type Context<SS = any, S extends State = State, P = Payload> = Pick<
  Store<S, P>,
  'getState' | 'dispatch'
> &
  Action<P> & {
    namespace: string;
    method: string;
    extraProps: {
      [extraProps: string]: any;
    };
    getCurrentState(): SS;
  };

export function createContext<SS = any, S extends State = State, P = Payload>(
  store: Store<S, P>,
  action: Action<P>
): Context<SS, S, P> {
  const { type, payload, ...extraProps } = action;
  const [namespace, method] = type.split('/');
  const context = {} as Context<SS, S, P>;

  context.type = type;
  context.namespace = namespace;
  context.method = method;
  context.payload = payload;
  context.extraProps = extraProps;

  context.getState = store.getState;

  context.getCurrentState = function getCurrentState(): SS {
    return context.getState()[namespace];
  };

  context.dispatch = function dispatch<P = Payload>(
    action: Action<P>
  ): Action<P> | Promise<Action<P>> {
    action.type =
      action.type.indexOf('/') !== -1
        ? action.type
        : `${namespace}/${action.type}`;
    return store.dispatch(action);
  };

  return context;
}
