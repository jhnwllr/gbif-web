// import { GbifRootLayout } from './components/GbifRootLayout';
import { Config } from './config';

export const gbifConfig: Config = {
  defaultTitle: 'GBIF',
  graphqlEndpoint: 'http://localhost:4001/graphql',
  // rootLayout: GbifRootLayout,
  languages: [
    {
      code: 'en',
      label: 'English',
      default: true,
      textDirection: 'ltr',
    },
    {
      code: 'da',
      label: 'Dansk',
      default: false,
      textDirection: 'ltr',
    },
    {
      code: 'ar',
      label: 'العربية',
      default: false,
      textDirection: 'rtl',
    },
  ],
  occurrencePredicate: {
    type: 'and',
    predicates: [
      {
        type: 'range',
        key: 'year',
        value: {
          gte: '2009',
          lte: '2012',
        },
      },
    ],
  },
};
