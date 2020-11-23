import { connect } from 'react-redux';
import Count from './Count';
import { getCountState } from '../ducks/selectors';

const mapStateToProps = state => ({
  count: getCountState(state)
});

export default connect(mapStateToProps)(Count);
