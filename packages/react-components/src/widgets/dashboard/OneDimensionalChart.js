import { jsx, css } from '@emotion/react';
import React, { useCallback, useContext, useState } from 'react';
import { Card, CardTitle } from './shared';
import { Button, ResourceLink, resourceAction } from '../../components';
import { formatAsPercentage } from '../../utils/util';
import qs from 'query-string';
import Highcharts from './highcharts';
import HighchartsReact from 'highcharts-react-official'
import { getPieOptions } from './charts/pie';
import { FormattedMessage } from 'react-intl';
import { GroupBy, Pagging, useFacets } from './Datasets';
import { getColumnOptions } from './charts/column';
import monthEnum from '../../enums/basic/month.json';
// import licenseEnum from '../../enums/basic/license.json';
import basisOfRecordEnum from '../../enums/basic/basisOfRecord.json';
import { MdLink, MdViewStream } from 'react-icons/md';
import { BsFillBarChartFill, BsPieChartFill } from 'react-icons/bs';
import RouteContext from '../../dataManagement/RouteContext';
import { useLocation, Redirect } from 'react-router-dom';

// Component to control the view options: table, pie chart, bar chart
function ViewOptions({ view, setView, options = ['COLUMN', 'PIE', 'TABLE'] }) {
  if (options.length < 2) return null;

  // option to icon component map
  const iconMap = {
    COLUMN: <BsFillBarChartFill />,
    PIE: <BsPieChartFill />,
    TABLE: <MdViewStream />
  }
  return <div css={css`
      button {
        margin: 0 3px;
      }
      .active {
        color: var(--primary);
      }
      .inactive {
        color: var(--color300);
      }
    `}>
    {options.map(option => <Button look="text" className={view === option ? 'active' : 'inactive'} onClick={() => setView(option)}>
      {iconMap[option]}
    </Button>)}
  </div>
}

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
  return <EnumChart {...{
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
    messages: ['Non-interpreted values - same concept might appear with different names.']
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
    enumKeys: basisOfRecordEnum,
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

export function EnumChart({
  predicate,
  detailsRoute,
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

export function Datasets({
  predicate,
  detailsRoute,
  translationTemplate,
  enumKeys,
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
    keys: enumKeys,
    translationTemplate,
    predicate: undefined,
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

export function OneDimensionalChart({
  facetQuery,
  predicateKey,
  detailsRoute,
  disableOther,
  options = ['PIE', 'COLUMN', 'TABLE'],
  disableUnknown,
  hideUnknownInChart,
  messages = [],
  title,
  subtitleKey,
  transform,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  const location = useLocation();
  const facetResults = useFacets(facetQuery);
  const [view, setView] = useState(options?.[0] ?? 'TABLE');
  const [redirect, setRedirect] = useState();

  const handleRedirect = useCallback(({ filter }) => {
    if (!filter) return;
    const f = filter.must || filter.must_not ? { filter: btoa(JSON.stringify(mergeDeep({}, currentFilter, filter))) } : filter;
    setRedirect({
      pathname: detailsRoute || location.pathname,
      state: {
        key: 'fc904fab-a33c-4ca8-bd23-698ddb026f26'
      },
      search: `?${qs.stringify(f)}`
    });
  }, []);

  if (redirect) {
    return <Redirect to={redirect} />
  }

  const showChart = facetResults?.results?.length > 0;
  const { otherCount, emptyCount } = facetResults;

  facetResults?.forEach?.map(x => x.filter = { must: { [predicateKey]: [x.key] } });
  const data = facetResults?.results?.map(x => {
    return {
      y: x.count,
      name: x.title,
      key: x.key,
      filter: { must: { [predicateKey]: [x.key] } },
      visible: x.count > 0
    }
  });

  // count how many results have data
  const notEmptyResults = data?.filter(x => x.y > 0);
  const singleValue = notEmptyResults?.length === 1 ? notEmptyResults[0] : null;

  if (view === 'PIE') {
    // if the series have less than 5 items, then use every 2th color from the default palette Highcharts?.defaultOptions?.colors
    if (data?.length < 5) {
      data.forEach((x, i) => {
        x.color = Highcharts?.defaultOptions?.colors?.[i * 2 + 2];
      });
    }
    if (!disableOther && otherCount) {
      data.push({
        y: otherCount,
        name: 'Other',
        color: "url(#other1)",
        visible: true
      });
    }
    if (!hideUnknownInChart && emptyCount) {
      data.push({
        y: emptyCount,
        name: 'Unknown',
        visible: true,
        color: "url(#unknown2)",
        filter: { must_not: { [predicateKey]: [{ "type": "isNotNull" }] } },
      });
    }
  }

  const serie = {
    innerSize: '25%',
    name: 'Occurrences',
    data,
  };

  const pieOptions = getPieOptions({
    serie,
    onClick: handleRedirect,
    interactive: true
  });
  const columnOptions = getColumnOptions({ serie, clickCallback: ({ filter } = {}) => console.log(filter), interactive: true });

  const filledPercentage = facetResults?.data?.isNotNull?.documents?.total / facetResults?.data?.occurrenceSearch?.documents?.total;

  if (!disableUnknown) {
    messages.push(<p>{formatAsPercentage(filledPercentage)}% of all records have this field filled</p>);
  }
  const renderedView = singleValue ? 'TABLE' : view;

  return <Card {...props} loading={facetResults.loading} error={facetResults.error}>
    <CardTitle options={singleValue ? null : <ViewOptions options={options} view={view} setView={setView} />}>
      {title && <div css={css`font-weight: bold;`}>{title}</div>}
      {subtitleKey && <div css={css`color: #888; font-size: 13px;`}><FormattedMessage id={subtitleKey} defaultMessage="Number of occurrences" /></div>}
    </CardTitle>

    {/* {facetResults?.results?.length}
    {singleValue && <div>
      <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{singleValue.y} occurrences where {predicateKey} equals </div>
      <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{singleValue.name}</div>
    </div>} */}

    {showChart && <div style={{ margin: '0 auto' }}>
      {renderedView === 'PIE' && <HighchartsReact
        highcharts={Highcharts}
        options={pieOptions}
      />}
      {renderedView === 'COLUMN' && <HighchartsReact
        highcharts={Highcharts}
        options={columnOptions}
      />}
    </div>}
    {renderedView === 'TABLE' && <GroupBy facetResults={facetResults} transform={transform} onClick={handleRedirect} />}
    <Pagging facetResults={facetResults} />

    {messages.length > 0 && <div css={css`
      font-weight: 400; color: var(--color300); font-size: 0.90em;
      &:hover {
        color: var(--color800);
      }
      p {
        margin: 0.5em 0;
      }
      transition: color 0.2s ease-in-out;
      `}>
      {messages.map((message, i) => <p key={i}>
        {typeof message === 'string' && <FormattedMessage id={message} />}
        {typeof message !== 'string' && message}
      </p>)}
    </div>}
  </Card>
};


// From https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}