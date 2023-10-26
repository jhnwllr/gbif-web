import './index.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoutes } from './routes';
import { Root } from './components/Root';

export function HostedPortalApp({ config }) {
  const routes = createRoutes(config);
  const router = createBrowserRouter(routes);

  return (
    <Root config={config}>
      <RouterProvider router={router} fallbackElement={null} />
    </Root>
  );
}
