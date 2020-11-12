import { createStore } from 'redux';
import { createAggStore } from 'redux-agg';
import { todosModel, todosActions } from './todos';
import {
  visibilityFilterModel,
  visibilityFilterActions,
} from './visibilityFilter';

export { todosActions, visibilityFilterActions };

export const store = createAggStore(createStore)
  .register(todosModel)
  .register(visibilityFilterModel);
