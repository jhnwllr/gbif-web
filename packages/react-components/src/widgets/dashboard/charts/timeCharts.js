import { jsx } from '@emotion/react';
import React from 'react';
import { ChartWrapper } from './EnumChartGenerator';

// this is for generating charts for fields that are foreign keys like taxonKey, collectionKey, datasetKey, etc.
// for some fields there will always be a value like datasetKey, but e.g. collectionKey is only sparsely filled.
export function Year({
  predicate,
  detailsRoute,
  fieldName,
  translationTemplate, // will fallback to "enums.{fieldName}.{key}"
  facetSize,
  disableOther,
  disableUnknown,
  currentFilter = {}, // excluding root predicate
  gqlEntity, // e.g. `dataset {title}`
  ...props
}) {
  const GQL_QUERY = `
    query summary($predicate: Predicate${!disableUnknown ? ', $hasPredicate: Predicate' : ''}){
      occurrenceSearch(predicate: $predicate) {
        documents(size: 0) {
          total
        }
        facet: autoDateHistogram {
          results: eventDate(buckets: 10)
        }
      }
      ${!disableUnknown ? `isNotNull: occurrenceSearch(predicate: $hasPredicate) {
        documents(size: 0) {
          total
        }
      }` : ''}
    }
  `;
  return <ChartWrapper {...{
    predicate, detailsRoute, gqlQuery: GQL_QUERY, currentFilter,
    disableOther,
    disableUnknown,
    predicateKey: 'eventDate',
    facetSize,
    transform: data => {
      return data?.occurrenceSearch?.facet?.results?.buckets?.map(x => {
        return {
          ...x,
          title: 'h2j',
        }
      });
    }
  }} {...props} />
}