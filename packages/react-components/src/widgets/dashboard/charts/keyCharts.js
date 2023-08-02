import { jsx, css } from '@emotion/react';
import React from 'react';
import { ResourceLink } from '../../../components';
import { MdLink } from 'react-icons/md';
import { OneDimensionalChart } from './OneDimensionalChart';
import { FormattedMessage } from 'react-intl';
import { KeyChartGenerator } from './KeyChartGenerator';

export function Datasets({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    // enumKeys: basisOfRecordEnum,
    fieldName: 'datasetKey',
    disableUnknown: true,
    disableOther: false,
    facetSize: 10,
    gqlEntity: `dataset {title}`,
    title: <FormattedMessage id="filters.datasetKey.name" defaultMessage="Dataset" />,
    subtitleKey: "dashboard.numberOfOccurrences",
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

export function Publishers({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'publishingOrg',
    disableUnknown: true,
    disableOther: false,
    facetSize: 10,
    gqlEntity: `publisher {title}`,
    title: <FormattedMessage id="filters.publisherKey.name" defaultMessage="Publisher" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    transform: data => {
      return data?.occurrenceSearch?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: <span>{x?.entity?.title} <ResourceLink discreet type="publisherKey" id={x.key}><MdLink /></ResourceLink></span>,
          count: x.count,
          description: x.entity.description,
          filter: { must: { publishingOrg: [x.key] } },
        }
      });
    }
  }} {...props} />
}

export function Collections({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'collectionKey',
    disableUnknown: false,
    disableOther: false,
    facetSize: 10,
    gqlEntity: `collection {title: name}`,
    title: <FormattedMessage id="filters.collectionKey.name" defaultMessage="Dataset" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    transform: data => {
      return data?.occurrenceSearch?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: <span>{x?.entity?.title} <ResourceLink discreet type="collectionKey" id={x.key}><MdLink /></ResourceLink></span>,
          count: x.count,
          description: x.entity.description,
          filter: { must: { collectionKey: [x.key] } },
        }
      });
    }
  }} {...props} />
}

export function Institutions({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'institutionKey',
    disableUnknown: false,
    disableOther: false,
    facetSize: 10,
    gqlEntity: `institution {title: name}`,
    title: <FormattedMessage id="filters.institutionKey.name" defaultMessage="Institution" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    transform: data => {
      return data?.occurrenceSearch?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: <span>{x?.entity?.title} <ResourceLink discreet type="institutionKey" id={x.key}><MdLink /></ResourceLink></span>,
          count: x.count,
          description: x.entity.description,
          filter: { must: { institutionKey: [x.key] } },
        }
      });
    }
  }} {...props} />
}

export function Networks({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'networkKey',
    disableUnknown: false,
    disableOther: false,
    facetSize: 10,
    gqlEntity: `network {title}`,
    title: <FormattedMessage id="filters.networkKey.name" defaultMessage="Network" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    transform: data => {
      return data?.occurrenceSearch?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: <span>{x?.entity?.title} <ResourceLink discreet type="networkKey" id={x.key}><MdLink /></ResourceLink></span>,
          count: x.count,
          description: x.entity.description,
          filter: { must: { networkKey: [x.key] } },
        }
      });
    }
  }} {...props} />
}


// export function Datasets2({
//   predicate,
//   detailsRoute,
//   translationTemplate,
//   predicateKey,
//   facetSize,
//   disableOther,
//   disableUnknown,
//   currentFilter = {}, //excluding root predicate
//   ...props
// }) {
//   const GQL_QUERY = `
//     query summary($predicate: Predicate, $size: Int, $from: Int){
//       occurrenceSearch(predicate: $predicate) {
//         documents(size: 0) {
//           total
//         }
//         cardinality {
//           total: datasetKey
//         }
//         facet {
//           results: datasetKey(size: $size, from: $from) {
//             key
//             count
//             entity: dataset {
//               title
//             }
//           }
//         }
//       }
//     }
//   `;

//   const facetQuery = {
//     size: facetSize,
//     translationTemplate,
//     predicate,
//     query: GQL_QUERY
//   };

//   return <OneDimensionalChart {...{
//     facetQuery,
//     detailsRoute,
//     disableOther: false,
//     disableUnknown: true,
//     predicateKey: 'datasetKey',
//     title: 'Datasets',
//     subtitleKey: 'dashboard.numberOfOccurrences',
//     options: ['PIE', 'TABLE', 'COLUMN'],
//     transform: data => {
//       return data?.occurrenceSearch?.facet?.results?.map(x => {
//         return {
//           key: x.key,
//           title: <span>{x?.entity?.title} <ResourceLink discreet type="datasetKey" id={x.key}><MdLink /></ResourceLink></span>,
//           count: x.count,
//           description: x.entity.description,
//           filter: { must: { datasetKey: [x.key] } },
//         }
//       });
//     }
//   }} {...props} />
// }