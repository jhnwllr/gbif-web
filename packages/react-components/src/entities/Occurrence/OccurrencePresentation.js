
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { Header } from './details/Header';
import { Tabs } from '../../components';
// import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
// import { iconFeature, countFeature } from '../../components/IconFeatures/styles';
// import { About } from './about/About';
// import { Activity } from './activity/Activity';
// import { DownloadOptions } from './DownloadOptions';
import { join } from '../../utils/util';
// import get from 'lodash/get';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Core } from './details/core/Core';
import * as sharedCss from '../shared/styles';

const { TabList, RouterTab } = Tabs;

export function OccurrencePresentation({
  id,
  data,
  error,
  loading,
  ...props
}) {
  let { url, path } = useRouteMatch();
  const theme = useContext(ThemeContext);

  if (loading) return <div>loading</div>
  const { occurrence } = data;
  const { terms } = occurrence;
  const termMap = terms.reduce((map, term) => { map[term.simpleName] = term; return map; }, {});

  if (error || !occurrence) {
    // TODO a generic component for failures is needed
    return <div>Failed to retrieve item</div>
  }

  return <div style={{background: '#F0F4F8'}}>
    <Header {...{ data, error, loading, termMap }}>
      <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
        <RouterTab to={url} exact label="Core" />
        <RouterTab to={join(url, 'people')} css={sharedCss.tab({ theme })} label="People" />
        <RouterTab to={join(url, 'literature')} css={sharedCss.tab({ theme })} label="Literature" />
        <RouterTab to={join(url, 'related')} css={sharedCss.tab({ theme })} label="Related" />
        <RouterTab to={join(url, 'media')} css={sharedCss.tab({ theme })} label="Media" />
        <RouterTab to={join(url, 'sequences')} css={sharedCss.tab({ theme })} label="Sequences" />
      </TabList>
    </Header>
    <section style={{ borderTop: '1px solid #dedede' }}>
      <Switch>
        <Route path={join(path, 'people')}>
          <div css={sharedCss.proseWrapper({ theme })}>
            <h1>people</h1>
          </div>
        </Route>
        <Route path={join(path, 'literature')}>
          <div css={sharedCss.proseWrapper({ theme })}>
            <h1>Literature</h1>
          </div>
        </Route>
        <Route path={path}>
          <div css={sharedCss.proseWrapper({ theme })}>
            <Core {...{data, loading, error, termMap}}/>
          </div>
        </Route>
      </Switch>
    </section>
  </div>
};