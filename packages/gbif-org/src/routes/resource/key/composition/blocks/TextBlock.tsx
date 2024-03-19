import { TextBlockDetailsFragment } from '@/gql/graphql';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { ArticleBody } from '../../components/ArticleBody';
import { fragmentManager } from '@/services/FragmentManager';
import { BlockContainer, backgroundColorMap } from './_shared';
import { ArticleTitle } from '../../components/ArticleTitle';

fragmentManager.register(/* GraphQL */ `
  fragment TextBlockDetails on TextBlock {
    title
    body
    hideTitle
    id
    backgroundColour
  }
`);

type Props = {
  resource: TextBlockDetailsFragment;
};

export function TextBlock({ resource }: Props) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  return (
    <BlockContainer className={backgroundColor}>
      <ArticleTextContainer>
        {!resource.hideTitle && resource.title && (
          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />
        )}
        {resource.body && (
          <ArticleBody dangerouslySetBody={{ __html: resource.body }} className="mt-2 mb-10" />
        )}
      </ArticleTextContainer>
    </BlockContainer>
  );
}
