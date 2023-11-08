import { Config } from '@/contexts/config';

const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT;
if (typeof graphqlEndpoint !== 'string') {
  throw new Error('Missing VITE_GRAPHQL_ENDPOINT env variable');
}

export const gbifConfig: Config = {
  defaultTitle: 'GBIF',
  graphqlEndpoint,
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
