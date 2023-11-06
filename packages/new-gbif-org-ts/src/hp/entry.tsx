import '../index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from '../components/Root';
import { Config } from '../contexts/config';
import { configureHostedPortalRoutes } from './routes';

type Props = {
  config: Config;
};

function HostedPortalApp({ config }: Props): React.ReactElement {
  const routes = configureHostedPortalRoutes(config);
  const router = createBrowserRouter(routes);

  return (
    <Root config={config}>
      <RouterProvider router={router} fallbackElement={null} />
    </Root>
  );
}

export function render(rootElement: HTMLElement, config: Config) {
  createRoot(rootElement).render(<HostedPortalApp config={config} />);
}
