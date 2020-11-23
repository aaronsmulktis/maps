import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withAnalytics } from '@carvana/analytics';
import * as actions from './ducks/operations';
import Counter from './Counter';

export default compose(
  connect(
    null,
    actions
  ),
  withAnalytics
)(Counter);
