import React from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../../../i18n';
import { LocalizedLink } from '../../../components/LocalizedLink';
import { LoaderArgs } from '../../../types';

export function OccurrenceSearchPage(): React.ReactElement {
  const data = useLoaderData() as any;
  const [searchParams] = useSearchParams();
  const from = parseInt(searchParams.get('from') ?? '0');
  const { locale } = useI18n();

  return (
    <>
      <Helmet>
        <title>Occurrence search</title>
      </Helmet>

      <p>Current language: {locale.code}</p>
      <ul>
        {data.documents.results.map((occurrence: any) => (
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

export async function loader({ request, config }: LoaderArgs) {
  const url = new URL(request.url);
  const from = parseInt(url.searchParams.get('from') ?? '0');

  const response = await fetch(config.graphqlEndpoint, {
    signal: request.signal,
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
      variables: { from, predicate: config.occurrencePredicate },
      oprationName: 'OccurrenceSearch',
    }),
  });

  const data = await response.json();

  return data.data.occurrenceSearch;
}
