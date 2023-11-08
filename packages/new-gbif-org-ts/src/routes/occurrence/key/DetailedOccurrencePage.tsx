import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/contexts/i18n';
import { LoaderArgs } from '@/types';
import { OccurrenceQuery, OccurrenceQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
const Map = React.lazy(() => import('@/components/Map'));

const { load, useTypedLoaderData } = createGraphQLHelpers<
  OccurrenceQuery,
  OccurrenceQueryVariables
>(/* GraphQL */ `
  query Occurrence($key: ID!) {
    occurrence(key: $key) {
      eventDate
      scientificName
      coordinates
    }
  }
`);

export function DetailedOccurrencePage() {
  const { data } = useTypedLoaderData();
  const { locale } = useI18n();

  if (data.occurrence == null) throw new Error('404');
  const occurrence = data.occurrence;

  return (
    <>
      <Helmet>
        <title>{occurrence.scientificName}</title>
      </Helmet>

      <p>Current language: {locale.code}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {occurrence.coordinates && (
        <React.Suspense fallback={<div>Loading map...</div>}>
          <Map coordinates={occurrence.coordinates} />
        </React.Suspense>
      )}
    </>
  );
}

export async function loader({ request, params, config }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return load({
    endpoint: config.graphqlEndpoint,
    request,
    variables: {
      key,
    },
  });
}
