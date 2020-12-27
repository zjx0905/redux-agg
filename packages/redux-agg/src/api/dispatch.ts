import { isPromise } from '../helpers/type';
import { createContext } from '../model/context';
import { tryHitSideEffects } from '../model/effect';
import { Action, Payload } from './action';
import { State } from './model';
import { Store } from './store';

export interface Dispatch {
  <P = Payload>(action: Action<P>): Promise<Action<P>> | Action<P>;
}

export function createDispatch<S extends State = State>(store: Store<S>): void {
  const { dispatch: _dispatch } = store;
  store.dispatch = function dispatch<P = Payload>(
    action: Action<P>
  ): Promise<Action<P>> | Action<P> {
    try {
      const context = createContext(store, action);
      _dispatch(context);
      const promise = tryHitSideEffects(context);
      return isPromise(promise) ? promise.then(() => action) : action;
    } catch (err) {
      console.error(err);
      return action;
    }
  };
}
