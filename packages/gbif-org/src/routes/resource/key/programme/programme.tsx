import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ProgrammeQuery, ProgrammeQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { Blocks } from '../composition/blocks';

export const ProgrammeSkeleton = ArticleSkeleton;

const { load, useTypedLoaderData } = createGraphQLHelpers<
  ProgrammeQuery,
  ProgrammeQueryVariables
>(/* GraphQL */ `
  query Programme($key: String!) {
    programme(id: $key) {
      title
      excerpt
      blocks {
        __typename
        ... on HeaderBlock {
          title
          __typename
          summary
          primaryImage {
            file {
              url
              normal: thumbor(width: 1200, height: 500)
              mobile: thumbor(width: 800, height: 400)
            }
            description
            title
          }
        }
        ... on FeatureBlock {
          __typename
          maxPerRow
          title
          body
          backgroundColour
          features {
            __typename
            ... on Feature {
              id
              title
              url
              primaryImage {
                file {
                  mobile: thumbor(width: 500, height: 400)
                }
              }
            }
            ... on News {
              id
              title
              excerpt
              optionalImg: primaryImage {
                file {
                  mobile: thumbor(width: 500, height: 400)
                }
              }
            }
            ... on DataUse {
              id
              title
              excerpt
              optionalImg: primaryImage {
                file {
                  mobile: thumbor(width: 500, height: 400)
                }
              }
            }
            ... on Event {
              id
              title
              excerpt
              start
              end
              optionalImg: primaryImage {
                file {
                  mobile: thumbor(width: 500, height: 400)
                }
              }
            }
          }
        }
        ... on FeaturedTextBlock {
          __typename
          id
          title
          body
          backgroundColour
        }
        ... on CarouselBlock {
          __typename
          id
          title
          body
          backgroundColour
          features {
            __typename
            ... on MediaBlock {
              ...mediaFields
            }
            ... on MediaCountBlock {
              ...mediaCountFields
            }
          }
        }
        ... on MediaBlock {
          ...mediaFields
        }
        ... on MediaCountBlock {
          ...mediaCountFields
        }
        ... on CustomComponentBlock {
          id
          componentType
          title
          width
          backgroundColour
          settings
        }
        ... on TextBlock {
          title
          body
          hideTitle
          id
          backgroundColour
        }
      }
    }
  }

  fragment mediaFields on MediaBlock {
    __typename
    id
    mediaTitle: title
    body
    reverse
    subtitle
    backgroundColour
    roundImage
    callToAction {
      label
      url
    }
    optionalImg: primaryImage {
      file {
        mobile: thumbor(width: 500, height: 400)
      }
    }
  }

  fragment mediaCountFields on MediaCountBlock {
    __typename
    id
    mediaTitle: title
    body
    optionalImg: primaryImage {
      file {
        mobile: thumbor(width: 500, height: 400)
      }
    }
    reverse
    subtitle
    titleCountPart
    backgroundColour
    roundImage
    callToAction {
      label
      url
    }
  }
`);

export function Programme() {
  const { data } = useTypedLoaderData();

  if (data.programme == null) throw new Error('404');
  const resource = data.programme;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      {resource.blocks && <Blocks blocks={resource.blocks} />}

      <ArticleContainer>Funding should go here, similar to project pages</ArticleContainer>
    </>
  );
}

export async function programmeLoader({ request, params, config, locale }: LoaderArgs) {
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
