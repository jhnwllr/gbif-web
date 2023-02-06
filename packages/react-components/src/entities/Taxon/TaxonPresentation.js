import { jsx, css } from '@emotion/react';
import React from 'react';
import { GrGithub as Github } from 'react-icons/gr';
import { MdPerson } from 'react-icons/md';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { join } from '../../utils/util';

// Local Components
import { Classification, Tag, Tabs, Tooltip } from '../../components';
import {
  Homepage,
  FeatureList,
  GenericFeature,
} from '../../components/IconFeatures/IconFeatures';
import {
  DataHeader,
  HeaderWrapper,
  ContentWrapper,
  Headline,
  HeaderInfoWrapper,
  HeaderInfoMain,
  HeaderInfoEdit,
} from '../shared/header';
import { PageError, Page404, PageLoader } from '../shared';
import HeaderImage from './components/HeaderImage';

// Tab pages
import About from './about';
import Collections from './collections';
import Media from './media';

const { TabList, RouterTab, Tab } = Tabs;

export function TaxonPresentation({ id, data, error, loading, config }) {
  let { path, url } = useRouteMatch();

  if (loading || !data) return <PageLoader />;
  const { taxon } = data;

  if (error || !taxon) {
    // TODO a generic component for failures is needed
    return (
      <>
        <DataHeader searchType='taxonSearch' messageId='catalogues.taxa' />
        <Page404 />
      </>
    );
  }

  const feedbackTemplate = `Please provide you feedback here, but leave content below for context

---
Relating to ${location.href}
  `;

  return (
    <>
      <DataHeader searchType='taxonSearch' messageId='catalogues.taxa' />
      <HeaderWrapper>
        {/* <Eyebrow prefix='Taxon code' suffix='Something here' /> */}
        <Classification style={{ marginBottom: 16 }}>
          {['kingdom', 'phylum', 'class', 'order', 'family'].map((rank) =>
            taxon[rank] ? (
              <span key={rank} style={{ color: '#aaa', fontSize: 14 }}>
                {taxon[rank]}
              </span>
            ) : null
          )}
        </Classification>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Headline
              css={css`
                display: inline;
                margin-right: 12px;
              `}
            >
              {taxon.scientificName}
            </Headline>
            <div style={{ marginTop: 12 }}>
              {taxon.vernacularName && (
                <span style={{ marginRight: 12 }}>{taxon.vernacularName}</span>
              )}
              <Tag type='info'>{taxon.rank}</Tag>
            </div>
          </div>
          <HeaderImage guid={id} width={100} height={100} radius={8} />
        </div>
        <HeaderInfoWrapper>
          <HeaderInfoMain>
            <FeatureList>
              {taxon.authorship && (
                <GenericFeature>
                  <MdPerson />
                  <span>{taxon.authorship}</span>
                </GenericFeature>
              )}
              <Homepage href={id} style={{ marginBottom: 8 }} />
            </FeatureList>
          </HeaderInfoMain>
          <HeaderInfoEdit>
            <Tooltip
              title='Leave a comment - requires a free Github account'
              placement='bottom'
            >
              <a
                style={{ marginLeft: 8, fontSize: 24, color: 'var(--primary)' }}
                target='_blank'
                href={`https://github.com/gbif/portal-feedback/issues/new?title=${encodeURIComponent(
                  `Taxon Page: ${id}`
                )}&body=${encodeURIComponent(feedbackTemplate)}`}
              >
                <Github />
              </a>
            </Tooltip>
          </HeaderInfoEdit>
        </HeaderInfoWrapper>
        <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
          <RouterTab to={url} exact label='About' />
          <RouterTab to={join(url, '/collections')} label='Collections' />
          <RouterTab to={join(url, '/map')} label='Map' />
          <RouterTab to={join(url, '/media')} label='Media' />
        </TabList>
      </HeaderWrapper>

      <section>
        <Switch>
          <Route path={join(path, '/collections')}>
            <ContentWrapper>
              <Collections id={id} config={config} />
            </ContentWrapper>
          </Route>
          <Route path={join(path, '/map')}>
            <ContentWrapper>
              <div>Map</div>
            </ContentWrapper>
          </Route>
          {/* <Route path={join(path, '/occurrences')}>
            <ContentWrapper>
              <div>Occurrences</div>
            </ContentWrapper>
          </Route> */}
          <Route path={join(path, '/media')}>
            <ContentWrapper>
              <Media id={id} />
            </ContentWrapper>
          </Route>
          <Route path={path}>
            <ContentWrapper>
              <About taxon={taxon} />
            </ContentWrapper>
          </Route>
        </Switch>
      </section>
    </>
  );
}