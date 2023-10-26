import './index.css';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from './config';
import { createRoutes } from './routes';

export function HostedPortalApp({ config }) {
  const routes = createRoutes(config);
  const router = createBrowserRouter(routes);

  return (
    <React.StrictMode>
      <ConfigProvider config={config}>
        <HelmetProvider>
          <RouterProvider router={router} fallbackElement={null} />
        </HelmetProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}
