import React from 'react';
import {
  OccurrenceSearchPage,
  loader as occurrenceSearchLoader,
} from './routes/OccurrenceSearchPage';
import {
  DetailedOccurencePage,
  loader as detailedOccurenceLoader,
} from './routes/DetailedOccurencePage';
import { NotFound } from './routes/NotFound';
import { localizeRoutes } from './i18n';
import { HomePage } from './routes/HomePage';
import { RootLayout } from './components/RootLayout';
import { RootErrorPage } from './routes/RootErrorPage';

export const routes = localizeRoutes([
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
            loader: detailedOccurenceLoader,
            element: <DetailedOccurencePage />,
          },
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);
