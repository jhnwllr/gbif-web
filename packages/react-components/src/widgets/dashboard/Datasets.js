import { jsx, css } from '@emotion/react';
import React from 'react';
import { Card, CardTitle } from './shared';
import { GroupByTable } from './GroupByTable';
import { Button } from '../../components';

export function Datasets({
  predicate,
  columnTitle,
  columnCount = 'records',
  ...props
}) {
  return <Card {...props}>
    <CardTitle>Datasets</CardTitle>
    <div css={css`font-size: 13px; color: #888; margin-bottom: 8px;`}>14.243 results</div>
    <GroupByTable />
    <div css={css`margin-left: auto; font-size: 12px;`}>
      <Button look="ghost" css={css`margin-right: 8px; `} disabled>Previous</Button>
      <Button look="ghost">Next</Button>
    </div>
  </Card>
};