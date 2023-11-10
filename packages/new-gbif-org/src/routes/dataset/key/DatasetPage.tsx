import { DatasetQuery, DatasetQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/types';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { Helmet } from 'react-helmet-async';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  DatasetQuery,
  DatasetQueryVariables
>(/* GraphQL */ `
  query Dataset($key: ID!) {
    dataset(key: $key) {
      title
    }
  }
`);

export function DatasetPage() {
  const { data } = useTypedLoaderData();

  if (data.dataset == null) throw new Error('404');
  const dataset = data.dataset;

  return (
    <>
      <Helmet>
        <title>{dataset.title}</title>
      </Helmet>

      <h1>{dataset.title}</h1>
    </>
  );
}

export async function datasetLoader({ request, params, config }: LoaderArgs) {
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
