import styled from 'styled-components';

export const DescriptionWrapper = styled.div`
  box-sizing: border-box;
  color: ${props => props.theme.carvana.gray.dark};
  font-size: 18px;
  font-weight: 300;
  margin-bottom: 20px;
  & > ul {
    text-align: left;
    margin: 0;
  }
`;

export const CountWrapper = styled.h1`
  font-size: 20px;
`;
