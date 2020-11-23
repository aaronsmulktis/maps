import styled from 'styled-components';

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-image: url(${process.env.CARVANA_APP_ASSETS_BASE_URL}/dotcom-assets/homepage-only/hp-banner.jpg);
`;

export const Title = styled.div`
  box-sizing: border-box;
  color: ${props => props.theme.carvana.white.primary};
  font-size: 40px;
  font-weight: 300;
  text-align: center;
  padding: 40px 0 15px;
`;

export const ContentWrapper = styled.div`
  background: ${props => props.theme.carvana.white.primary};
  width: 90%;
  margin: 5% auto;
  opacity: 0.95;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
`;

export const IncrementButton = styled.button`
  background-color: ${props => props.theme.carvana.blue.primary};
  border: medium none;
  border-radius: 3px;
  color: ${props => props.theme.carvana.gray.jet};
  cursor: pointer;
  display: inline-block;
  font-size: ${props => props.theme.typography.fontSize};
  font-weight: 400;
  line-height: 14px;
  padding: 19px 0;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  width: 300px;
  margin: 10px;
`;

export const DecrementButton = styled.button`
  background-color: ${props => props.theme.carvana.yellow.primary};
  border: medium none;
  border-radius: 3px;
  color: ${props => props.theme.carvana.gray.jet};
  cursor: pointer;
  display: inline-block;
  font-size: ${props => props.theme.typography.fontSize};
  font-weight: 400;
  line-height: 14px;
  padding: 19px 0;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  -moz-appearance: none;
  width: 300px;
  margin: 10px;
`;
