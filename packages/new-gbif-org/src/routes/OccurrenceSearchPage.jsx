import React from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { config } from '../config';
import { useI18n, LocalizedLink } from '../i18n';
import { Helmet } from 'react-helmet-async';

export function OccurrenceSearchPage() {
  const data = useLoaderData();
  const [searchParams] = useSearchParams();
  const from = parseInt(searchParams.get('from') ?? 0);
  const { locale } = useI18n();

  return (
    <>
      <Helmet>
        <title>Occurrence search</title>
      </Helmet>

      <p>Current language: {locale.code}</p>
      <ul>
        {data.documents.results.map((occurrence) => (
          <li key={occurrence.key}>
            <LocalizedLink to={`/occurrence/${occurrence.key}`}>
              {occurrence.scientificName} - {occurrence.eventDate}
            </LocalizedLink>
          </li>
        ))}
      </ul>
      {from >= 20 && <LocalizedLink to={`?from=${from - 20}`}>Prev</LocalizedLink>}
      <LocalizedLink to={`?from=${from + 20}`}>Next</LocalizedLink>
    </>
  );
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const from = parseInt(url.searchParams.get('from') ?? 0);

  const response = await fetch(config.GRAPHQL_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query OccurrenceSearch($from: Int, $predicate: Predicate) {
          occurrenceSearch(predicate: $predicate) {
            documents(from: $from) {
              from
              size
              total
              results {
                key
                scientificName
                eventDate
              }
            }
          }
        }
      `,
      variables: { from, predicate: config.OCCURRENCE_PREDICATE },
      oprationName: 'OccurrenceSearch',
    }),
  });

  const data = await response.json();

  return data.data.occurrenceSearch;
}
