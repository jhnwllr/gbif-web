import { jsx, css } from '@emotion/react';
import React from 'react';
import { ResourceLink } from '../../../components';
import { MdLink } from 'react-icons/md';
import { OneDimensionalChart } from './OneDimensionalChart';
import { ChartWrapper } from './enumCharts';

export function KeyChartGenerator({
  predicate,
  detailsRoute,
  fieldName,
  translationTemplate, // will fallback to "enums.{fieldName}.{key}"
  facetSize,
  disableOther,
  disableUnknown,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  const GQL_QUERY = `
    query summary($predicate: Predicate${!disableUnknown ? ', $hasPredicate: Predicate' : ''}, $size: Int, $from: Int){
      occurrenceSearch(predicate: $predicate) {
        documents(size: 0) {
          total
        }
        cardinality {
          total: ${fieldName}
        }
        facet {
          results: ${fieldName}(size: $size, from: $from) {
            key
            count
          }
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
    translationTemplate: translationTemplate ?? `enums.${fieldName}.{key}`,
    disableOther,
    disableUnknown,
    predicateKey: fieldName,
    facetSize,
  }} {...props} />
}

export function Datasets({
  predicate,
  detailsRoute,
  translationTemplate,
  predicateKey,
  facetSize,
  disableOther,
  disableUnknown,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  const GQL_QUERY = `
    query summary($predicate: Predicate, $size: Int, $from: Int){
      occurrenceSearch(predicate: $predicate) {
        documents(size: 0) {
          total
        }
        cardinality {
          total: datasetKey
        }
        facet {
          results: datasetKey(size: $size, from: $from) {
            key
            count
            entity: dataset {
              title
            }
          }
        }
      }
    }
  `;

  const facetQuery = {
    size: facetSize,
    translationTemplate,
    predicate,
    query: GQL_QUERY
  };

  return <OneDimensionalChart {...{
    facetQuery,
    detailsRoute,
    disableOther: false,
    disableUnknown: true,
    predicateKey: 'datasetKey',
    title: 'Datasets',
    subtitleKey: 'dashboard.numberOfOccurrences',
    options: ['PIE', 'TABLE', 'COLUMN'],
    transform: data => {
      return data?.occurrenceSearch?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: <span>{x?.entity?.title} <ResourceLink discreet type="datasetKey" id={x.key}><MdLink /></ResourceLink></span>,
          count: x.count,
          description: x.entity.description,
          filter: { must: { datasetKey: [x.key] } },
        }
      });
    }
  }} {...props} />
}