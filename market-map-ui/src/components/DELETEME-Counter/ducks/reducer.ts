import * as types from './types';
import initialState from './initialState';

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
  case types.FETCH_COUNTER_SUCCESS:
    return {
      ...state,
      count: payload.initialCount
    };
  case types.INCREMENT:
    return {
      ...state,
      count: payload
    };
  case types.DECREMENT:
    return {
      ...state,
      count: payload
    };
  default:
    return state;
  }
};
