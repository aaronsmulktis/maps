import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export const fetchCounter = () => {
  // FIXME: remove the mock lines
  const mockAdapter = new MockAdapter(axios);
  mockAdapter.onGet('process.env.RETRIEVE_COUNTER_API').reply(200, { initialCount: 15 });
  // END FIXME:

  return axios.get('process.env.RETRIEVE_COUNTER_API');
};

export const saveCounter = () => {};
