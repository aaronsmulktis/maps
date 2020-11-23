import React from 'react';
import PropTypes from 'prop-types';
import LogoSvg from './Logo.svg';
import { LogoWrapper } from './Logo.styles';

const Logo = ({ className }) => (
  <LogoWrapper className={className}>
    <LogoSvg />
  </LogoWrapper>
);

Logo.propTypes = {
  className: PropTypes.string
};

Logo.defaultProps = {
  className: ''
};

export default Logo;
