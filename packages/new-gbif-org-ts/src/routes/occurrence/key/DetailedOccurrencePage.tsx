import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/contexts/i18n';
import { LoaderArgs } from '@/types';
const Map = React.lazy(() => import('@/components/Map'));

export function DetailedOccurrencePage() {
  const data = useLoaderData() as any;
  const { locale } = useI18n();

  return (
    <>
      <Helmet>
        <title>{data.scientificName}</title>
      </Helmet>

      <p>Current language: {locale.code}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {data.coordinates && (
        <React.Suspense fallback={<div>Loading map...</div>}>
          <Map coordinates={data.coordinates} />
        </React.Suspense>
      )}
    </>
  );
}

export async function loader({ request, params, config }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  const response = await fetch(config.graphqlEndpoint, {
    signal: request.signal,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query Occurrence($key: ID!) {
            occurrence(key: $key) {
            eventDate
            scientificName
            coordinates
            }
        }
      `,
      variables: { key },
      oprationName: 'Occurrence',
    }),
  });

  const data = await response.json();

  return data.data.occurrence;
}
