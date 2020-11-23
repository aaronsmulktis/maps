import React from 'react';
import PropTypes from 'prop-types';
import { BarWrapper } from './Bar.styles';

const Bar = ({ className, children }) => (
  <BarWrapper className={className}>
    {children}
  </BarWrapper>
);

Bar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Bar.defaultProps = {
  className: ''
};

export default Bar;
