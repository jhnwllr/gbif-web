import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { useI18n } from '../i18n';
import { Map } from '../components/Map';
import { Helmet } from 'react-helmet-async';

export function DetailedOccurrencePage() {
  const data = useLoaderData();
  const { locale } = useI18n();

  return (
    <>
      <Helmet>
        <title>{data.scientificName}</title>
      </Helmet>

      <p>Current language: {locale.code}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {data.coordinates && <Map coordinates={data.coordinates} />}
    </>
  );
}

export async function loader({ request, params, config }) {
  const key = params.key;

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
