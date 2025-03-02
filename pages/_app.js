import App from '../Components/Layout/App';
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../helpers/theme';
import { Provider } from "react-redux";
import { StylesProvider } from "@material-ui/styles";
import '../styles/Index.scss';
import cartStore from '../reducers/cartStore'; // used in <Provider>

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const getBotParamFromUrl = () => {
  if (typeof window === "object" && (/\b(bot|isBot|fromTest|fromTester)=(true|false|0|1)\b/i).test(window.location.href)) {
    const isBotValue = (RegExp.$2).toLowerCase();
    return (isBotValue === 'true' || isBotValue === '1');
  }
  return null;
};

export default function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    const isBot = getBotParamFromUrl();
    if (isBot !== null) {
      if (isBot) {
        sessionStorage.setItem('isBot', isBot);
        // eslint-disable-next-line no-undef
        coveoua('set', 'custom', { isBot: true, fromTester: true });
      }
      else { sessionStorage.removeItem('isBot'); }
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>{publicRuntimeConfig.title}</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta property="og:site_name" content={publicRuntimeConfig.title} />
      </Head>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Provider store={cartStore}>
            <App>
              <Component {...pageProps} />
            </App>
          </Provider>
        </ThemeProvider>
      </StylesProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
