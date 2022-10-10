import { jsx, css } from '@emotion/react';
import React from 'react';
import { OccurrenceSummary, DataQuality, Datasets } from '../../../widgets/dashboard';

export function Dashboard({
  data = {},
  loading,
  error,
  collection,
  occurrenceSearch,
  className,
  ...props
}) {
  return <div>
    <div css={css`
      display: flex; margin: -6px; padding-bottom: 200px; flex-wrap: wrap;
      > div {
        flex: 0 1 calc(50% - 12px); margin: 6px;
      }
      `}>
      <div>
        <OccurrenceSummary predicate={{
          type: "equals",
          key: "collectionKey",
          value: collection.key
        }} />
      </div>
      <div>
        <DataQuality predicate={{
          type: "equals",
          key: "collectionKey",
          value: collection.key
        }} />
      </div>
      <div>
        <Datasets predicate={{
          type: "equals",
          key: "collectionKey",
          value: collection.key
        }} />
      </div>
    </div>
  </div>
};
