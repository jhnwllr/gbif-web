import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ProjectAboutQuery, ProjectAboutQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticleTitle } from '../components/ArticleTitle';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { ArticleTags } from '../components/ArticleTags';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';

import { SecondaryLinks } from '../components/SecondaryLinks';
import { Documents } from '../components/Documents';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { Tabs } from '@/components/Tabs';
import { Outlet } from 'react-router-dom';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  ProjectAboutQuery,
  ProjectAboutQueryVariables
>(/* GraphQL */ `
  query ProjectAbout($key: String!) {
    gbifProject(id: $key) {
      summary
      body
      primaryImage {
        file {
          url
          normal: thumbor(width: 1200, height: 500)
          mobile: thumbor(width: 800, height: 400)
        }
        description
        title
      }
      secondaryLinks {
        label
        url
      }
      documents {
        file {
          url
          fileName
          contentType
          volatile_documentType
          details {
            size
          }
        }
        title
      }
      createdAt
    }
  }
`);

export function AboutTab() {
  const { data } = useTypedLoaderData();

  if (data.gbifProject == null) throw new Error('404');
  const resource = data.gbifProject;

  return (
    <>
      <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage ?? null} />
      
      <ArticleTextContainer>
        {resource.body && (
          <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
        )}

        <hr className="mt-8" />

        {resource.secondaryLinks && (
          <ArticleAuxiliary>
            <SecondaryLinks links={resource.secondaryLinks} className="mt-8" />
          </ArticleAuxiliary>
        )}

        {resource.documents && (
          <ArticleAuxiliary>
            <Documents documents={resource.documents} className="mt-8" />
          </ArticleAuxiliary>
        )}

        {resource.citation && (
          <ArticleAuxiliary label="Citation">
            <div dangerouslySetInnerHTML={{ __html: resource.citation }} />
          </ArticleAuxiliary>
        )}

        <ArticleTags resource={resource} className="mt-8" />
      </ArticleTextContainer>
    </>
  );
}

export async function projectAboutLoader({ request, params, config, locale }: LoaderArgs) {
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
