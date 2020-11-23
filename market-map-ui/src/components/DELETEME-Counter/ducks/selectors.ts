import { createSelector } from 'reselect';

const getCount = state => state?.counter?.count;
const getCountState = createSelector([getCount], count => count);

const getCounter = state => state?.counter;
const getCounterState = createSelector([getCounter], counter => counter);

export { getCountState, getCounterState };
