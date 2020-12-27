import { isFunction } from '../helpers/type';
import { Payload } from './action';
import { State } from './model';
import { Store } from './store';

export interface Plugin<S extends State = State, P = Payload> {
  (store: Store<S, P>): void;
}

export function initPlugin<S extends State = State, P = Payload>(
  store: Store<S, P>,
  plugins?: Plugin<S, P>[]
): void {
  if (!plugins || plugins.length === 0) {
    return;
  }

  plugins.forEach((plugin) => {
    if (!isFunction(plugin)) {
      return;
    }

    plugin(store);
  });
}
