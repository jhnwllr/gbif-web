import { jsx, css } from '@emotion/react';
import React from 'react';
import { Progress } from '../../components';
import { FormattedNumber } from 'react-intl';
import { Table } from './shared';

export function GroupByTable({
  predicate,
  columnTitle,
  columnCount = 'Records',
  results = [],
  total = 800,
  ...props
}) {
  const totalPage = results.reduce((a, c) => a + (c.count || 0), 0);

  return <Table>
    {columnTitle && <thead css={css`
      th {
        text-align: start;
        font-size: 0.95em;
        font-weight: 400;
        padding: 8px 0;
      }
    `}>
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
            <div css={css`color: var(--color400); font-size: 13px; margin-top: 4px;`}>{e.description}</div>
          </td>
          <td css={css`text-align: end;`}><FormattedNumber value={e.count} /></td>
          <td>
            <Progress color="var(--primary200)" overlays={[{ percent: 100 * e.count / total, color: 'var(--primary)' }]} percent={100 * e.count / totalPage} style={{ height: '1em', marginLeft: 'auto' }} />
          </td>
        </tr>
      })}
    </tbody>
  </Table>
};