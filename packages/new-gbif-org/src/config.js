export const config = Object.freeze({
  GRAPHQL_API: 'http://localhost:4001/graphql',
  LANGUAGES: [
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
  OCCURRENCE_PREDICATE: {
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
});
