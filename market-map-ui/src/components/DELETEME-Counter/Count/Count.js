import React from 'react';
import PropTypes from 'prop-types';
import { DescriptionWrapper, CountWrapper } from './Count.styles';

const Count = ({ count }) => (
  <DescriptionWrapper>
    <CountWrapper>Count: {count}</CountWrapper>
  </DescriptionWrapper>
);

Count.propTypes = {
  count: PropTypes.number.isRequired
};

export default Count;
