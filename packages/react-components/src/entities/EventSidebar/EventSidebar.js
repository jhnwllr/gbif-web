import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Tabs } from "../../components";
import { useQuery } from '../../dataManagement/api';
import { Intro } from './details/Intro';

const {  TabPanel } = Tabs;

export function EventSidebar({
  onCloseRequest,
  setActiveEventID,
  eventID,
  datasetKey,
  defaultTab,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(EVENT, { lazyLoad: true, graph: 'EVENT' });
  const [activeId, setTab] = useState( 'details');
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof eventID !== 'undefined') {
      load({ variables: { eventID: eventID, datasetKey: datasetKey } });
    }
  }, [eventID, datasetKey]);

  useEffect(() => {
    if (!loading) {
      setTab('details');
    }
  }, [data, loading]);

  return <Tabs activeId={activeId} onChange={id => setTab(id)}>
    <Row wrap="nowrap" style={style} css={css.sideBar({ theme })}>
      <Col shrink={false} grow={false} css={css.detailDrawerContent({ theme })} >
        <TabPanel tabId='details' style={{height: '100%'}}>
          <Intro
              data={data}
              loading={loading}
              error={error}
              setActiveEventID={setActiveEventID}
          />
        </TabPanel>
      </Col>
    </Row>
  </Tabs>
};

const EVENT = `
query event($eventID: String, $datasetKey: String){
  event(eventID: $eventID, datasetKey: $datasetKey) {
    eventID
    parentEventID
    eventType {
      concept
    }
    coordinates
    countryCode
    datasetKey
    datasetTitle
    kingdoms
    phyla
    classes
    orders
    families
    genera
    year
    month
    occurrenceCount
    measurementOrFactTypes
    measurementOrFactCount
    sampleSizeUnit
    sampleSizeValue
    samplingProtocol
    eventTypeHierarchyJoined
    eventHierarchyJoined
    decimalLatitude
    decimalLongitude
    locality
    stateProvince
    locationID
  }
}
`;


