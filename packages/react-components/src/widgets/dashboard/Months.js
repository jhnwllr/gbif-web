import { jsx, css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import { Card, CardTitle } from './shared';
import { Button, resourceAction } from '../../components';
import { formatAsPercentage } from '../../utils/util';
import qs from 'query-string';
import Highcharts from './highcharts';
import HighchartsReact from 'highcharts-react-official'
import { getPieOptions } from './charts/pie';
import { FormattedMessage } from 'react-intl';
import { GroupBy, Pagging, useFacets } from './Datasets';
import { getColumnOptions } from './charts/column';
import monthEnum from '../../enums/basic/month.json';
import { MdViewStream } from 'react-icons/md';
import { BsFillBarChartFill, BsPieChartFill } from 'react-icons/bs';
import LocaleContext from '../../dataManagement/LocaleProvider/LocaleContext';
import RouteContext from '../../dataManagement/RouteContext';
import { useHistory } from 'react-router-dom';

// Component to control the view options: table, pie chart, bar chart
function ViewOptions({ view, setView }) {
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
    <Button look="text" className={view === 'COLUMN' ? 'active' : 'inactive'} onClick={() => setView('COLUMN')}>
      <BsFillBarChartFill />
    </Button>
    <Button look="text" className={view === 'PIE' ? 'active' : 'inactive'} onClick={() => setView('PIE')}>
      <BsPieChartFill />
    </Button>
    <Button look="text" className={view === 'TABLE' ? 'active' : 'inactive'} onClick={() => setView('TABLE')}>
      <MdViewStream />
    </Button>
  </div>
}

export function Months({
  predicate,
  ...props
}) {
  const facetResults = useFacets({
    size: 12,
    keys: monthEnum,
    translationTemplate: 'enums.month.{key}',
    predicate,
    query: MONTHS_FACETS,
    otherVariables: {
      hasPredicate: {
        type: 'and',
        predicates: [
          predicate,
          {
            type: 'isNotNull',
            key: 'month'
          }
        ]
      }
    }
  });
  const [view, setView] = useState('PIE');
  const history = useHistory();
  const localeSettings = useContext(LocaleContext);
  const routeContext = useContext(RouteContext);

  const showChart = facetResults?.results?.length > 0;
  const { otherCount, emptyCount } = facetResults;

  const data = facetResults?.results?.map(x => {
    return {
      y: x.count,
      name: x.title,
    }
  });
  if (view === 'PIE') {
    if (otherCount) {
      data.push({
        y: otherCount,
        name: 'Other',
        color: "url(#other1)",
        visible: true
      });
    }
    if (emptyCount) {
      data.push({
        y: emptyCount,
        name: 'Unknown',
        visible: true,
        color: "url(#unknown2)"
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
    onClick: ({filter}) => {
      resourceAction({ 
        type: 'collectionKeySpecimens', 
        queryString: qs.stringify({taxonKey: 5}),
        history,
        localeSettings,
        routeContext,
      })
    },
    interactive: true
  });
  const columnOptions = getColumnOptions({ serie, clickCallback: ({ filter } = {}) => console.log(filter), interactive: true });

  const filledPercentage = facetResults?.data?.isNotNull?.documents?.total / facetResults?.data?.occurrenceSearch?.documents?.total;

  return <Card {...props} loading={facetResults.loading}>
    <CardTitle options={<ViewOptions view={view} setView={setView} />}>
      Months
      <div style={{color: '#888'}}>Event date for digitized specimens per month</div>
      <div css={css`font-weight: 400; color: var(--color300); font-size: 0.95em;`}>
        <div>{formatAsPercentage(filledPercentage)}% filled</div>
      </div>

    </CardTitle>

    {showChart && <div style={{ margin: '24px auto' }}>
      {view === 'PIE' && <HighchartsReact
        highcharts={Highcharts}
        options={pieOptions}
      />}
      {view === 'COLUMN' && <HighchartsReact
        highcharts={Highcharts}
        options={columnOptions}
      />}
    </div>}
    {view === 'TABLE' && <GroupBy facetResults={facetResults} />}
    <Pagging facetResults={facetResults} />

    {/* <div css={css`font-weight: 400; color: var(--color300); font-size: 0.95em;`}>
      <p>Non-interpreted values - same concept might appear with different names.</p>
    </div> */}
  </Card>
};
const MONTHS_FACETS = `
query summary($predicate: Predicate, $hasPredicate: Predicate, $size: Int, $from: Int){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: month
    }
    facet {
      results: month(size: $size, from: $from) {
        key
        count
      }
    }
  }
  isNotNull: occurrenceSearch(predicate: $hasPredicate) {
    documents(size: 0) {
      total
    }
  }
}
`;