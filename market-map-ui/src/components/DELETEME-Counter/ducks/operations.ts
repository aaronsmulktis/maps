import { CounterService } from '../../../services';
import { increment as incrementCounter, decrement as decrementCounter, fetchCounterSuccess } from './actions';

export const getCounter = () => async dispatch => {
  const { data } = await CounterService.fetchCounter();
  dispatch(fetchCounterSuccess(data));
};

export const increment = () => (dispatch, getState) => {
  const { counter: { count } } = getState();
  dispatch(incrementCounter(count + 1));
};

export const decrement = () => (dispatch, getState) => {
  const { counter: { count } } = getState();
  dispatch(decrementCounter(count - 1));
};
