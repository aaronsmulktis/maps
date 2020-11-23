import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import initialState from './initialState';
import { FETCH_COUNTER_SUCCESS } from './types';
import * as actions from './operations';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Counter actions', () => {
  it('fetches the counter', () => {
    const expectedActions = [
      { type: FETCH_COUNTER_SUCCESS, payload: { initialCount: 15 } }
    ];
    const store = mockStore(initialState);

    return store.dispatch(actions.getCounter()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
