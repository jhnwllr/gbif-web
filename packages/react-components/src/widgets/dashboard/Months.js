import { jsx, css } from '@emotion/react';
import React, { useState, useCallback } from 'react';
import { Card, CardTitle } from './shared';
import { GroupByTable } from './GroupByTable';
import { Button, ResourceLink, Classification, DropdownButton, Tooltip, Skeleton } from '../../components';
import { formatAsPercentage } from '../../utils/util';

import Highcharts from './highcharts'
import HighchartsReact from 'highcharts-react-official'
import { getPieOptions } from './charts/pie';
import { FormattedMessage } from 'react-intl';
import { GroupBy, useFacets } from './Datasets';
import { getColumnOptions } from './charts/column';
import monthEnum from '../../enums/basic/month.json';
import { MdBarChart, MdPieChart, MdTableRows, MdViewStream } from 'react-icons/md';
import { BsFillBarChartFill, BsPieChartFill } from 'react-icons/bs';

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
  const [view, setView] = useState('COLUMN');

  const showChart = !facetResults.loading && facetResults?.results?.length > 0;

  const data = facetResults?.results?.map(x => {
    return {
      y: x.count,
      name: x.title,
    }
  });
  const serie = {
    name: 'Occurrences',
    data
  };

  const pieOptions = getPieOptions({ serie, clickCallback: ({ filter } = {}) => console.log(filter), interactive: true });
  const columnOptions = getColumnOptions({ serie, clickCallback: ({ filter } = {}) => console.log(filter), interactive: true });

  const filledPercentage = facetResults?.data?.isFilled?.documents?.total / facetResults?.data?.occurrenceSearch?.documents?.total;
  return <Card {...props}>
    <CardTitle options={<ViewOptions view={view} setView={setView} />}>
      Months
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
    facet {
      results: month(size: $size, from: $from) {
        key
        count
      }
    }
  }
  isFilled: occurrenceSearch(predicate: $hasPredicate) {
    documents(size: 0) {
      total
    }
  }
}
`;