import * as types from './types';

export const increment = payload => ({
  type: types.INCREMENT,
  payload,
  meta: {
    analytics: {
      type: 'event',
      name: 'increment counter'
    }
  }
});

export const decrement = payload => ({
  type: types.DECREMENT,
  payload,
  meta: {
    analytics: {
      type: 'event',
      name: 'decrement counter'
    }
  }
});

export const fetchCounterSuccess = payload => ({
  type: types.FETCH_COUNTER_SUCCESS,
  payload
});
