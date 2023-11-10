import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/contexts/i18n';
import { LoaderArgs } from '@/types';
import { NewsQuery, NewsQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
const Map = React.lazy(() => import('@/components/Map'));

const { load, useTypedLoaderData } = createGraphQLHelpers<
  NewsQuery,
  NewsQueryVariables
>(/* GraphQL */ `
  query News($key: String!) {
    news(id: $key) {
      id
      title
      summary
      body
      primaryImage {
        file {
          url
          thumbor(width: 1200, height: 500)
        }
        description
        title
      }
      primaryLink {
        label
        url
      }
      secondaryLinks {
        label
        url
      }
      countriesOfCoverage
      topics
      purposes
      audiences
      citation
      createdAt
    }
  }
`);

export function News() {
  const { data } = useTypedLoaderData();
  const { locale } = useI18n();

  if (data.news == null) throw new Error('404');
  const resource = data.news;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <div className="p-8 pt-16">
        <div className="max-w-3xl m-auto mt-2 mb-10">
          <div>
            {/* I need a way to access a theme color here */}
            <p className="mb-2 text-sm leading-6 font-semibold text-sky-500 dark:text-sky-400">News</p>
            <h1 className="text-3xl inline-block sm:text-4xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">{resource.title}</h1>
            {resource.summary && <div className="mt-2 text-lg text-slate-700" dangerouslySetInnerHTML={{ __html: resource.summary }}></div>}
          </div>
        </div>
        <div className="max-w-6xl m-auto mt-2">
          {resource.primaryImage?.file?.url && (
            <figure className="mt-8 mb-6">
              <picture>
                <img className="rounded-md" src={resource.primaryImage?.file?.url} 
                alt="" />
              </picture>
              {resource.primaryImage?.description && <figcaption className="text-slate-600 [&>a]:underline-offset-1 [&>a]:underline" dangerouslySetInnerHTML={{ __html: resource.primaryImage.description}}></figcaption>}
            </figure>
          )}
        </div>
        {resource.body && <div className="max-w-3xl m-auto mt-2 prose">
          <div dangerouslySetInnerHTML={{ __html: resource.body }}></div>
        </div>}
      </div>
    </>
  );
}

export async function newsLoader({ request, params, config }: LoaderArgs) {
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
