import styled from 'styled-components';
import HeaderBar from './Bar';

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 120px;
`;

export const Bar = styled(HeaderBar)`
  display: flex;
  height: 40px;
  padding: 5px 20px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  color: ${props => props.theme.carvana.blue.dark};
  margin-left: 30px;
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.34px;
`;
