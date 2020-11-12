import { isPromise } from '../helpers/type';
import { createContext } from '../model/context';
import { tryHitSideEffect } from '../model/effect';
import { Action, Payload } from './action';
import { State } from './model';
import { Store } from './store';

export interface Dispatch {
  <P = Payload>(action: Action<P>): Promise<Action<P>> | Action<P>;
}

export function createDispatch<S extends State = State>(store: Store<S>): void {
  const { dispatch: reduxDispatch } = store;
  store.dispatch = function dispatch<P = Payload>(
    action: Action<P>
  ): Promise<Action<P>> | Action<P> {
    try {
      const context = createContext(store, action);
      reduxDispatch(context);
      const promise = tryHitSideEffect(context);
      return isPromise(promise) ? promise.then(() => action) : action;
    } catch (err) {
      console.error(err);
      return action;
    }
  };
}
