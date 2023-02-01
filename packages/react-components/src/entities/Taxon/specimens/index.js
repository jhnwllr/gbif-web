import React from 'react';
import PredicateDataFetcher from '../../../search/PredicateDataFetcher';
import { SpecimensTable } from './SpecimensTable';
import { ErrorBoundary } from '../../../components';
import StandaloneSearch from '../../../search/Search';

// Config
import defaultFilterConfig from './config/filterConf';
import predicateConfig from './config/predicateConfig';
import defaultTableConfig from './config/defaultTableConfig';
import { useIntl } from 'react-intl';

const QUERY = `
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
        occurrenceCount
        speciesCount
        eventTypeHierarchyJoined
      }
    }
  }
}
`;

function Table() {
  const intl = useIntl();
  return (
    <PredicateDataFetcher
      queryProps={{ throwAllErrors: true }}
      graphQuery={QUERY}
      graph='EVENT'
      queryTag='table'
      limit={50}
      componentProps={{
        defaultTableConfig: defaultTableConfig(intl),
      }}
      presentation={SpecimensTable}
    />
  );
}

export default ({ config }) => (
  <ErrorBoundary>
    <StandaloneSearch
      {...{ config, defaultFilterConfig, predicateConfig, Table }}
    />
  </ErrorBoundary>
);
