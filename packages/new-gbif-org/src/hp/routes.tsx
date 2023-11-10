import { SourceRouteObject } from '@/types';
import { configureRoutes } from '@/utils/configureRoutes';
import { HomePage } from '@/routes/HomePage';
import { NotFound } from '@/routes/NotFound';
import { RootErrorPage } from '@/routes/RootErrorPage';
import {
  DetailedOccurrencePage,
  loader as detailedOccurrenceLoader,
} from '@/routes/occurrence/key/DetailedOccurrencePage';
import {
  OccurrenceSearchPage,
  loader as occurrenceSearchLoader,
} from '@/routes/occurrence/search/OccurrenceSearchPage';
import { Config } from '@/contexts/config';
import { DatasetPage, datasetLoader } from '@/routes/dataset/key/DatasetPage';

const baseRoutes: SourceRouteObject[] = [
  {
    errorElement: <RootErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        key: 'occurrence-search-page',
        path: 'occurrence/search',
        loader: occurrenceSearchLoader,
        element: <OccurrenceSearchPage />,
      },
      {
        key: 'occurrence-page',
        path: 'occurrence/:key',
        loader: detailedOccurrenceLoader,
        element: <DetailedOccurrencePage />,
      },
      {
        key: 'dataset-page',
        gbifRedirect: (params) => {
          if (typeof params.key !== 'string') throw new Error('Invalid key');
          return `https://www.gbif.org/dataset/${params.key}`;
        },
        path: 'dataset/:key',
        loader: datasetLoader,
        element: <DatasetPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export const configureHostedPortalRoutes = (hostedPortalConfig: Config) =>
  configureRoutes(baseRoutes, hostedPortalConfig);
