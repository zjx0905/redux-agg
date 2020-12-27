import { defineModel } from 'redux-agg';
import { SHOW_ALL } from '../constants/TodoFilters';

export const visibilityFilterModel = defineModel({
  namespace: 'visibilityFilter',
  defaultState: SHOW_ALL,
  reducers: {
    set(_, filter) {
      return filter;
    },
  },
});
