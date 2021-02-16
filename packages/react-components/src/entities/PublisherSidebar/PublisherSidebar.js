/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from '../DatasetSidebar/styles';
import { Row, Col, Tabs } from "../../components";
import { useQuery } from '../../dataManagement/api';
//import { Intro } from './details/Intro';
import { Header } from './details/Header';
import { Location } from './details/Location';

import { Contacts } from './details/Contacts'
// import { BibliographicCitations } from './details/BibliographicCitations'
// import { SamplingDescription } from './details/SamplingDescription'
// import { Citation } from './details/Citation'

const { TabList, Tab, TabPanel } = Tabs;

export function PublisherSidebar({
  onImageChange,
  id,
  defaultTab,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(PUBLISHER, { lazyLoad: true });
  const [activeId, setTab] = useState(defaultTab || 'details');
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof id !== 'undefined') {
      load({ variables: { key: id } });
    }
  }, [id]);

  return <Tabs activeId={activeId} onChange={id => setTab(id)}>
    <Row wrap="nowrap" style={style} css={css.sideBar({ theme })}>
      <Col shrink={false} grow={false} css={css.detailDrawerBar({ theme })}>
        <TabList style={{ paddingTop: '12px' }} vertical>
          <Tab tabId="details" direction="left">
            <MdInfo />
          </Tab>
        </TabList>
      </Col>
      <Col shrink={false} grow={false} css={css.detailDrawerContent({ theme })} >
        <TabPanel tabId='details'>
          <Row direction="column">
            <Col style={{ padding: '12px 16px', paddingBottom: 50 }} grow>
              <Header data={data} error={error} />
            <Location data={data}/>
{/*               <Intro data={data} loading={loading} error={error} />
              <SamplingDescription data={data} />
              <BibliographicCitations data={data} /> */}
              <Contacts data={data} />
            </Col>
          </Row>
        </TabPanel>
      </Col>
    </Row>
  </Tabs>
};

const PUBLISHER = `
query organization($key: String!){
    organization(key: $key) {
        abbreviation
        address
        city
        contacts {
            firstName
            lastName
            position
            organization
            address
            userId
            type
            _highlighted
            roles
          }
        country
        created
        description
        email
        endorsingNodeKey
        homepage
        language
        latitude
        logoUrl
        longitude
        numPublishedDatasets
        phone
        postalCode
        province
        title
      }
    }
`;

