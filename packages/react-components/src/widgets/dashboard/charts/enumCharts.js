import { jsx, css } from '@emotion/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import monthEnum from '../../../enums/basic/month.json';
import { EnumChartGenerator } from './EnumChartGenerator';

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