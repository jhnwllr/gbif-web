import { jsx, css } from '@emotion/react';
import React, { useCallback, useState } from 'react';
import { Card, CardTitle } from '../shared';
import { Button, ResourceLink } from '../../../components';
import { formatAsPercentage } from '../../../utils/util';
import qs from 'query-string';
import Highcharts from './highcharts';
import HighchartsReact from 'highcharts-react-official'
import { getPieOptions } from './pie';
import { FormattedMessage } from 'react-intl';
import { getColumnOptions } from './column';
import { GroupBy, Pagging, useFacets } from './GroupByTable';
import { MdLink, MdViewStream } from 'react-icons/md';
import { BsFillBarChartFill, BsPieChartFill } from 'react-icons/bs';
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
    {options.map(option => <Button key={option} look="text" className={view === option ? 'active' : 'inactive'} onClick={() => setView(option)}>
      {iconMap[option]}
    </Button>)}
  </div>
}

export function OneDimensionalChart({
  facetQuery,
  predicateKey,
  detailsRoute,
  disableOther,
  options = ['PIE', 'COLUMN', 'TABLE'],
  defaultOption,
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
  const [view, setView] = useState(defaultOption ?? options?.[0] ?? 'TABLE');
  const [redirect, setRedirect] = useState();

  const handleRedirect = useCallback(({ filter }) => {
    if (!filter) return;
    const f = filter.must || filter.must_not ? { filter: btoa(JSON.stringify(mergeDeep({}, currentFilter, filter))) } : filter;
    setRedirect({
      pathname: detailsRoute || location.pathname,
      search: `?${qs.stringify(f)}`
    });
  }, []);

  if (redirect) {
    return <Redirect to={redirect} />
  }

  const showChart = facetResults?.results?.length > 0;
  const { otherCount, emptyCount, distinct } = facetResults;

  facetResults?.forEach?.map(x => x.filter = { must: { [predicateKey]: [x.key] } });
  const data = facetResults?.results?.map(x => {
    return {
      y: x.count,
      name: x.title,
      key: x.key,
      filter: { [predicateKey]: [x.key] },
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
    messages.push(<div>{formatAsPercentage(filledPercentage)}% of all records have a value</div>);
  }
  const renderedView = singleValue ? 'TABLE' : view;

  return <Card {...props} loading={facetResults.loading} error={facetResults.error}>
    <CardTitle options={(singleValue || distinct === 0) ? null : <ViewOptions options={options} view={view} setView={setView} />}>
      {title && <div css={css`font-weight: bold;`}>{title}</div>}
      {subtitleKey && <div css={css`color: #888; font-size: 13px;`}><FormattedMessage id={subtitleKey} defaultMessage="Number of occurrences" /></div>}
    </CardTitle>

    {distinct === 0 && <div css={css`text-align: center; color: #aaa;`}>
      <FormattedMessage id="dashboard.noData" defaultMessage="No data" />
    </div>}

    {distinct > 0 && <>
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
        {messages.map((message, i) => <div key={i}>
          {typeof message === 'string' && <FormattedMessage id={message} />}
          {typeof message !== 'string' && message}
        </div>)}
      </div>}
    </>}
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