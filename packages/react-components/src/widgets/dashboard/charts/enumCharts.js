import { jsx, css } from '@emotion/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import monthEnum from '../../../enums/basic/month.json';
import { OneDimensionalChart } from './OneDimensionalChart';

export function EnumChartGenerator({
  predicate,
  detailsRoute,
  fieldName,
  enumKeys,
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
    enumKeys,
    disableOther,
    disableUnknown,
    predicateKey: fieldName,
    facetSize,
  }} {...props} />
}

export function Licenses({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    // enumKeys: licenseEnum,
    translationTemplate: 'enums.license.{key}',
    fieldName: 'license',
    disableUnknown: true,
    disableOther: true,
    facetSize: 10,
    title: <FormattedMessage id="filters.license.name" defaultMessage="Licenses" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    messages: ['dashboard.notVocabularyWarning']
  }} {...props} />
}

export function BasisOfRecord({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    // enumKeys: basisOfRecordEnum,
    fieldName: 'basisOfRecord',
    disableUnknown: true,
    disableOther: true,
    facetSize: 10,
    title: <FormattedMessage id="filters.basisOfRecord.name" defaultMessage="Basis of record" />,
    subtitleKey: "dashboard.numberOfOccurrences"
  }} {...props} />
}

export function Months({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    enumKeys: monthEnum,
    fieldName: 'month',
    facetSize: 12,
    disableUnknown: false,
    hideUnknownInChart: false,
    disableOther: true,
    title: <FormattedMessage id="filters.month.name" defaultMessage="Month" />,
    subtitleKey: "dashboard.numberOfOccurrences"
  }} {...props} />
}

export function OccurrenceIssue({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'issue',
    translationTemplate: 'enums.occurrenceIssue.{key}',
    facetSize: 10,
    disableOther: true,
    disableUnknown: true,
    options: ['TABLE'],
    title: <FormattedMessage id="filters.occurrenceIssue.name" defaultMessage="Issues" />,
    subtitleKey: "dashboard.numberOfOccurrences",
  }} {...props} />
}

export function ChartWrapper({
  predicate,
  translationTemplate,
  gqlQuery,
  enumKeys,
  predicateKey,
  facetSize,
  disableOther,
  disableUnknown,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  const facetQuery = {
    size: facetSize,
    keys: enumKeys,
    translationTemplate,
    predicate,
    query: gqlQuery,
    otherVariables: {
      hasPredicate: {
        type: 'and',
        predicates: [
          predicate,
          {
            type: 'isNotNull',
            key: predicateKey
          }
        ]
      }
    }
  };

  return <OneDimensionalChart {...{ facetQuery, disableOther, disableUnknown, predicateKey }} {...props} />
}