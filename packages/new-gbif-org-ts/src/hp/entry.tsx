import '../index.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from '../components/Root';
import { Config } from '../contexts/config';
import { configureHostedPortalRoutes } from './routes';

type Props = {
  config: Config;
};

export function HostedPortalApp({ config }: Props): React.ReactElement {
  const routes = configureHostedPortalRoutes(config);
  const router = createBrowserRouter(routes);

  return (
    <Root config={config}>
      <RouterProvider router={router} fallbackElement={null} />
    </Root>
  );
}
