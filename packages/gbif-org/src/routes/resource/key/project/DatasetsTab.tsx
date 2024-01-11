import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ProjectDatasetsQuery, ProjectDatasetsQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { ArticleTags } from '../components/ArticleTags';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';
import { SecondaryLinks } from '../components/SecondaryLinks';
import { Documents } from '../components/Documents';


const { load, useTypedLoaderData } = createGraphQLHelpers<
  ProjectDatasetsQuery,
  ProjectDatasetsQueryVariables
>(/* GraphQL */ `
  query ProjectDatasets($key: ID!) {
    datasetSearch(projectId: [$key], limit: 500) {
      count
      limit
      results {
        key
        title
        description
        type
        publishingOrganizationTitle
        recordCount
        license
      }
  	}
  }
`);

export function DatasetsTab() {
  const { data } = useTypedLoaderData();
  const datasetSearch = data?.datasetSearch?.results;

  return (
    <>
      datasets
    </>
  );
}

export async function projectDatasetsLoader({ request, params, config, locale }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return load({
    endpoint: config.graphqlEndpoint,
    signal: request.signal,
    variables: {
      key,
    },
    locale: locale.cmsLocale || locale.code,
  });
}
