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
      publishingOrganizationKey
      publishingOrganizationTitle
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

      <h1 className="text-3xl">{dataset.title}</h1>
      {dataset.publishingOrganizationTitle && (
        <p>
          Published by <a className="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700" href={`/publisher/${dataset.publishingOrganizationKey}`}>{dataset?.publishingOrganizationTitle}</a> - <span className="text-red-500">TODO phrase should be translated. If
          it links to a publisher page on the site or 2 gbif.org or somewhere else depends on the hp. And it should take color and rounding from the theme
          config</span>
        </p>
      )}
      <div className="text-red-500 mt-4 mb-4">
        <p>
          TODO have tabs that are accessible and can be used as either state push, href links or not
          url linkable tabs (simple react state only) For the dataset page the tabs would have state
          in the url and work as state push
        </p>
        <p>Notice that occurrence search lives in one of the tabs.</p>
        <p>The fonts should be themed as well. It is fine that the hp owner have to add the fonts themselves to the site head</p>
      </div>
      <ul className="border-b border-slate-200 space-x-6 flex whitespace-nowrap dark:border-slate-200/5 mb-px">
        <li>
          <h2>
            <a
              className="flex text-sm leading-6 font-semibold pt-3 pb-2.5 border-b-2 -mb-px text-sky-500 border-current"
              href="."
            >
              About
            </a>
          </h2>
        </li>
        <li>
          <h2>
            <a
              className="flex text-sm leading-6 font-semibold pt-3 pb-2.5 border-b-2 -mb-px text-slate-900 border-transparent hover:border-slate-300 dark:text-slate-200 dark:hover:border-slate-700"
              href="./dashboard"
            >
              Dashboard
            </a>
          </h2>
        </li>
        <li>
          <h2>
            <a
              className="flex text-sm leading-6 font-semibold pt-3 pb-2.5 border-b-2 -mb-px text-slate-900 border-transparent hover:border-slate-300 dark:text-slate-200 dark:hover:border-slate-700"
              href="./occurrences"
            >
              Occurrences
            </a>
          </h2>
        </li>
        <li>
          <h2>
            <a
              className="flex text-sm leading-6 font-semibold pt-3 pb-2.5 border-b-2 -mb-px text-slate-900 border-transparent hover:border-slate-300 dark:text-slate-200 dark:hover:border-slate-700"
              href="./download"
            >
              Download
            </a>
          </h2>
        </li>
      </ul>
      <div>Tab content</div>
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
