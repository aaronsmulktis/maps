import { combineReducers } from 'redux';
import counterDucks from '../components/DELETEME-Counter/ducks';

const rootReducer = combineReducers({
  counter: counterDucks.reducer
});

export default rootReducer;
