import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/contexts/i18n';
import { LocalizedLink } from '@/components/LocalizedLink';
import { ExtractPaginatedResult, LoaderArgs } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/routes/occurrence/search/columns';
import { notNull } from '@/utils/notNull';
import { OccurrenceSearchQuery, OccurrenceSearchQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  OccurrenceSearchQuery,
  OccurrenceSearchQueryVariables
>(/* GraphQL */ `
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
          coordinates
          county
          basisOfRecord
          datasetName
          publisherTitle
        }
      }
    }
  }
`);

export type SingleOccurrenceSearchResult = ExtractPaginatedResult<
  OccurrenceSearchQuery['occurrenceSearch']
>;

export function OccurrenceSearchPage(): React.ReactElement {
  const { data } = useTypedLoaderData();
  const [searchParams] = useSearchParams();
  const from = parseInt(searchParams.get('from') ?? '0');
  const { locale } = useI18n();

  if (data.occurrenceSearch?.documents == null) throw new Error('No data');
  const occurrences = data.occurrenceSearch?.documents.results.filter(notNull) ?? [];

  return (
    <>
      <Helmet>
        <title>Occurrence search</title>
      </Helmet>

      <p>Current language: {locale.code}</p>

      <DataTable columns={columns} data={occurrences} />

      {from >= 20 && <LocalizedLink to={`?from=${from - 20}`}>Prev</LocalizedLink>}
      <LocalizedLink to={`?from=${from + 20}`}>Next</LocalizedLink>
    </>
  );
}

export async function loader({ request, config }: LoaderArgs) {
  const url = new URL(request.url);
  const from = parseInt(url.searchParams.get('from') ?? '0');

  return load({
    endpoint: config.graphqlEndpoint,
    request,
    variables: {
      from,
      predicate: config.occurrencePredicate,
    },
  });
}
