import React from 'react';
import {
  OccurrenceSearchPage,
  loader as occurrenceSearchLoader,
} from './routes/OccurrenceSearchPage';
import {
  DetailedOccurrencePage,
  loader as detailedOccurrenceLoader,
} from './routes/DetailedOccurrencePage';
import { NotFound } from './routes/NotFound';
import { I18nProvider } from './i18n';
import { HomePage } from './routes/HomePage';
import { RootLayout } from './components/RootLayout';
import { RootErrorPage } from './routes/RootErrorPage';
import { Outlet } from 'react-router-dom';

export function createRoutes(config) {
  const baseRoutes = [
    {
      element: <RootLayout />,
      errorElement: <RootErrorPage />,
      children: [
        {
          errorElement: <RootErrorPage />,
          children: [
            {
              index: true,
              element: <HomePage />,
            },
            {
              path: 'occurrence/search',
              loader: occurrenceSearchLoader,
              element: <OccurrenceSearchPage />,
            },
            {
              path: 'occurrence/:key',
              loader: detailedOccurrenceLoader,
              element: <DetailedOccurrencePage />,
            },
            {
              path: '*',
              element: <NotFound />,
            },
          ],
        },
      ],
    },
  ];

  return configureRoutes({ config, routes: baseRoutes });
}

// This function will change the routes based on the provided config
// It will do the following:
// - Duplicate the routes for each language with a specific path prefix.
// - Wrap root routes with the I18nProvider making the locale available to the route and its children.
// - Inject the config into the loaders
// - Inject the selected locale into the loaders
function configureRoutes({ config, routes }) {
  return config.languages.map((locale) => ({
    path: locale.default ? '/' : locale.code,
    element: <I18nProvider locale={locale} children={<Outlet />} />,
    children: recursivelyTransformRoutes(routes, (route) => {
      const clone = { ...route };

      // Inject the config and locale into the loader
      if (typeof route.loader === 'function') {
        clone.loader = (args) => route.loader({ ...args, config, locale });
      }

      return clone;
    }),
  }));
}

function recursivelyTransformRoutes(routes, transformFn) {
  return routes.map((route) => {
    const clone = { ...route };

    // Recurse into children
    if (Array.isArray(route.children)) {
      clone.children = recursivelyTransformRoutes(route.children, transformFn);
    }

    return transformFn(clone);
  });
}
