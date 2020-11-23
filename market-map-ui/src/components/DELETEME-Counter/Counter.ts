import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Description from './Description';
import Count from './Count';
import {
  MainWrapper,
  Title,
  IncrementButton,
  DecrementButton,
  ContentWrapper
} from './Counter.styles';

const Counter = ({ getCounter, increment, decrement }) => {
  useEffect(() => {
    getCounter();
  });

  return (
    <MainWrapper>
      <Title>Carvana (React) UI Template</Title>
      <ContentWrapper>
        <Description />
        <Count />
        <IncrementButton onClick={increment}>Increment</IncrementButton>
        <DecrementButton onClick={decrement}>Decrement</DecrementButton>
      </ContentWrapper>
    </MainWrapper>
  );
};

Counter.propTypes = {
  getCounter: PropTypes.func.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired
};

export default Counter;
