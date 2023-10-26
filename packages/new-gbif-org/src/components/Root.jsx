import React from 'react';
import { ConfigProvider } from '../config';
import { Helmet, HelmetProvider } from 'react-helmet-async';

export function Root({ config, helmetContext, children }) {
  return (
    <React.StrictMode>
      <ConfigProvider config={config}>
        <HelmetProvider context={helmetContext}>
          <Helmet>
            <title>{config.defaultTitle}</title>
          </Helmet>
          {children}
        </HelmetProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}
