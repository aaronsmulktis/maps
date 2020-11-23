import React from 'react';
import { Provider } from 'react-redux';
import { Provider as AnalyticsProvider } from '@carvana/analytics';
import ThemeProvider, { createGlobalStyle } from '@carvana/theme';
import store from './store/configureStore';
import configs from './store/configs';
import Layout from './components/DELETEME-Layout/Layout';
import { World, UnitedStates } from './components/Maps'

const GlobalStyle = createGlobalStyle(process.env.NODE_ENV);
export default (
  <Provider store={store}>
    <ThemeProvider>
      <AnalyticsProvider configs={configs} debug>
        <GlobalStyle />
        <Layout>
          <UnitedStates width={window.innerWidth} height={window.innerHeight} />
        </Layout>
      </AnalyticsProvider>
    </ThemeProvider>
  </Provider>
);
