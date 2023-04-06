import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Tabs } from '../../components';
import { useQuery } from '../../dataManagement/api';
import { Header } from './Header';
import { MdClose, MdInfo, MdScience } from 'react-icons/md';
import { Groups as Details } from './details/Groups';
import { Groups as Trial } from './trial/Groups';

const { TabList, Tab, TapSeperator } = Tabs;
const { TabPanel } = Tabs;

const TRIAL_EVENT = `
query list($predicate: Predicate, $offset: Int, $limit: Int){
  results: eventSearch(
    predicate:$predicate,
    size: $limit, 
    from: $offset
    ) {
    documents {
      size
      from
      total
      results {
        eventID
        samplingProtocol
        eventType {
          concept
        }
        day
        month
        year
        parentEventID
        locationID
        month
        year
        datasetTitle
        datasetKey
        formattedCoordinates
        stateProvince
        countryCode
        measurementOrFactTypes
        locality
        temporalCoverage {
          gte
          lte
        }
        decimalLatitude
        decimalLongitude
        wktConvexHull
        measurementOrFacts {
          measurementID
          measurementType
          measurementUnit
          measurementValue
          measurementMethod
          measurementRemarks
          measurementAccuracy
          measurementDeterminedBy
          measurementDeterminedDate
        }
        extensions {
          seedbank {
            accessionNumber
            seedPerGram
            formInStorage
            sampleWeightInGrams
            sampleSize
            collectionFillRate
            purityDebrisPercentage
            purityPercentage
            dateCollected
            dateInStorage
            storageTemperatureInCelsius
            relativeHumidityPercentage
            publicationDOI
            preStorageTreatmentNotesHistory
            primaryStorageSeedBank
            degreeOfEstablishment
            primaryCollector
            plantForm
            duplicatesReplicates
            collectionPermitNumber
            thousandSeedWeight
            numberPlantsSampled
            storageBehaviour
            embryoType
            dormancyClass

            testDateStarted
            testLengthInDays
            numberGerminated
            germinationRateInDays
            adjustedGerminationPercentage
            viabilityPercentage
            numberFull
            numberEmpty
            numberTested
            preTestProcessingNotes
          }
        }
      }
    }
  }
}
`;

export function AccessionSidebar({
  onCloseRequest,
  eventID,
  trialEventID,
  catalogNumber,
  defaultTab,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(TRIAL_EVENT, {
    lazyLoad: true,
  });
  const [activeId, setTab] = useState(defaultTab || 'details');
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof eventID !== 'undefined') {
      load({
        variables: {
          predicate: {
            type: 'and',
            predicates: [
              {
                type: 'equals',
                key: 'catalogNumber',
                value: catalogNumber,
              },
            ],
          },
        },
        size: 50,
        from: 0,
      });
    }
  }, [catalogNumber]);

  useEffect(() => {
    if (!loading) {
      setTab(defaultTab || 'details');
    }
  }, [data, loading]);

  const isLoading = loading || !data;
  const event = data?.results?.documents?.results?.find(
    ({ eventType }) => eventType.concept === 'Accession'
  );
  const trials = data?.results?.documents?.results?.filter(
    ({ eventType }) => eventType.concept === 'Trial'
  );

  return (
    <Tabs activeId={activeId} onChange={(id) => setTab(id)}>
      <Row wrap='nowrap' style={style} css={css.sideBar({ theme })}>
        <Col shrink={false} grow={false} css={css.detailDrawerBar({ theme })}>
          <TabList style={{ paddingTop: '12px' }} vertical>
            {onCloseRequest && (
              <>
                <Tab direction='left' onClick={onCloseRequest}>
                  <MdClose />
                </Tab>
                <TapSeperator vertical />
              </>
            )}
            <Tab tabId='details' direction='left'>
              <MdInfo />
            </Tab>
            {trialEventID && (
              <Tab tabId='trial' direction='left'>
                <MdScience />
              </Tab>
            )}
          </TabList>
        </Col>
        <Col
          shrink={false}
          grow={false}
          css={css.detailDrawerContent({ theme })}
        >
          {isLoading && (
            <Col
              style={{ padding: '12px', paddingBottom: 50, overflow: 'auto' }}
              grow
            >
              <h2>{catalogNumber} - Loading information...</h2>
            </Col>
          )}
          {!isLoading && (
            <>
              <Header data={{ ...event, catalogNumber }} error={error} />
              <TabPanel tabId='details'>
                <Details event={event} trials={trials} />
              </TabPanel>
              {trialEventID && (
                <TabPanel tabId='trial'>
                  <Trial
                    event={trials.find(
                      ({ eventID }) => eventID === trialEventID
                    )}
                  />
                </TabPanel>
              )}
            </>
          )}
        </Col>
      </Row>
    </Tabs>
  );
}