import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, matchRoutes, RouterProvider } from 'react-router-dom';
import { configureGbifRoutes } from '@/gbif/routes';
import { gbifConfig } from '@/gbif/config';
import { Root } from '@/components/Root';

hydrate();

async function hydrate() {
  // Configure the routes
  const gbifRoutes = configureGbifRoutes(gbifConfig);

  // Determine if any of the initial routes are lazy
  const lazyMatches = matchRoutes(gbifRoutes, window.location)?.filter(
    (m) => typeof m.route.lazy === 'function'
  );

  // Load the lazy matches and update the routes before creating your router
  // so we can hydrate the SSR-rendered content synchronously
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        const routeModule = await m.route.lazy!();
        Object.assign(m.route, { ...routeModule, lazy: undefined });
      })
    );
  }

  const router = createBrowserRouter(gbifRoutes);

  const root = document.getElementById('app');
  if (root == null) throw new Error("Couldn't find root element");

  hydrateRoot(
    root,
    <Root config={gbifConfig}>
      <RouterProvider router={router} fallbackElement={null} />
    </Root>
  );
}
