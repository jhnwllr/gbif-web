import { jsx, css } from '@emotion/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Card, CardTitle } from '../shared';
import { Button, ResourceLink } from '../../../components';
import { formatAsPercentage, mergeDeep } from '../../../utils/util';
import qs from 'query-string';
import Highcharts from './highcharts';
import HighchartsReact from 'highcharts-react-official'
import { getPieOptions } from './pie';
import { FormattedMessage } from 'react-intl';
import { getColumnOptions } from './column';
// import { getTimeSeriesOptions } from './area';
import { GroupBy, Pagging, useFacets } from './GroupByTable';
import { MdLink, MdViewStream } from 'react-icons/md';
import { BsFillBarChartFill, BsPieChartFill } from 'react-icons/bs';
import { useLocation, useHistory } from 'react-router-dom';
import { FilterContext } from '../../Filter/state';

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
  showUnknownInChart,
  messages = [],
  title,
  subtitleKey,
  transform,
  currentFilter = {}, //excluding root predicate
  filterKey,
  handleRedirect,
  ...props
}) {
  const facetResults = useFacets(facetQuery);
  const [view, setView] = useState(defaultOption ?? options?.[0] ?? 'TABLE');

  // const location = useLocation();
  // const history = useHistory();
  // const { filter: filterContext, setFilter } = useContext(FilterContext);
  // const handleRedirect = useCallback(({ filter }) => {
  //   if (!filter) return;

  //   const mergedFilter = mergeDeep({}, filterContext, { must: filter });
  //   if (detailsRoute) {
  //     const newLocation = `${detailsRoute || location.pathname}?${qs.stringify(filter)}`;
  //     history.push(newLocation);
  //   } else {
  //     setFilter(mergedFilter);
  //   }
  // }, [detailsRoute, location.pathname, filterContext, currentFilter]);

  const showChart = facetResults?.results?.length > 0;
  const { otherCount, emptyCount, distinct } = facetResults;

  facetResults?.results?.forEach(x => x.filter = { [filterKey ?? predicateKey]: [x.key] });
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
    if (showUnknownInChart && emptyCount) {
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
  const columnOptions = getColumnOptions({ serie, onClick: handleRedirect, interactive: true });

  // if time series then create the area chart options
  // let timeSeriesOptions;
  // if (view === 'TIME') {
  //   timeSeriesOptions = getTimeSeriesOptions({ serie, clickCallback: ({ filter } = {}) => console.log(filter), interactive: true });
  // }

  const filledPercentage = facetResults?.data?.isNotNull?.documents?.total / facetResults?.data?.occurrenceSearch?.documents?.total;

  if (!disableUnknown) {
    messages.push(<div>{formatAsPercentage(filledPercentage)}% of all records have a value</div>);
  }
  const renderedView = view;
  // the idea with this was that it looks odd with a pie chart with only one value, but it looks even worse with a table with only one value. Similar for column charts. But in reality it was also confusing changing the layout when changing filters, so we removed this.
  // const singleValue = notEmptyResults?.length === 1 ? notEmptyResults[0] : null;
  // const renderedView = singleValue ? 'TABLE' : view;

  return <Card {...props} loading={facetResults.loading} error={facetResults.error}>
    {/* <CardTitle options={(singleValue || (distinct === 0)) ? null : <ViewOptions options={options} view={view} setView={setView} />}> */}
    <CardTitle options={<ViewOptions options={options} view={view} setView={setView} />}>
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
        {renderedView === 'TIME' && <HighchartsReact
          highcharts={Highcharts}
          options={timeSeriesOptions}
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

