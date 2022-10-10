import { jsx, css } from '@emotion/react';
import React from 'react';
import { useDeepCompareEffect } from 'react-use';
import { useQuery } from '../../dataManagement/api';
import { Progress } from '../../components';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Card, CardTitle, Table } from './shared';
import { MdChevronRight } from 'react-icons/md';
import { summary } from '../../components/Accordion/styles';
import { resultList } from '../../components/OccurrenceMap/test/map.styles';

export function GroupByTable({
  predicate,
  columnTitle,
  columnCount = 'records',
  total = 800,
  ...props
}) {
  const results = [
    {
      key: '123',
      title: 'Norwegian Species Observation Service',
      desc: 'A collective enterprise that takes a novel approach to citizen science by developing cooperative partnerships among experts in a wide ...',
      count: 123
    },
    {
      key: '123',
      title: 'sdfgsdfg',
      desc: 'aa bb cc',
      count: 50
    },
    {
      key: '123',
      title: 'sdfgsdfg',
      desc: 'aa bb cc',
      count: 70
    },
    {
      key: '123',
      title: 'sdfgsdfg',
      desc: 'aa bb cc',
      count: 20
    }
  ];

  const totalPage = results.reduce((a,c) => a + (c.count || 0), 0);

  return <Table>
    {columnTitle && <thead>
      <tr>
        <th>{columnTitle}</th>
        <th>{columnCount}</th>
        <th></th>
      </tr>
    </thead>}
    <tbody css={css`
          tr {
            td {
              vertical-align: initial;
            }
            td:last-of-type {
              width: 80px;
            }
          }
          `}>
      {results.map((e, i) => {
        return <tr key={e.key}>
          <td>
            <div>{e.title}</div>
            <div css={css`color: var(--color400); font-size: 13px; margin-top: 4px;`}>{e.desc}</div>
          </td>
          <td css={css`text-align: end;`}><FormattedNumber value={e.count} /></td>
          <td>
            <Progress color="var(--primary200)" overlays={[{percent: 100 * e.count / total, color: 'var(--primary)'}]} percent={100 * e.count / totalPage} style={{ height: '1em', marginLeft: 'auto' }} />
          </td>
        </tr>
      })}
    </tbody>
  </Table>
};

const OCCURRENCE_STATS = `
query summary($predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      speciesKey
      taxonKey
      datasetKey
    }

    stats {
      year {
        min
        max
      }
    }
  }
}
`;
