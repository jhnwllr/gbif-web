import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { OccurrenceSummary, DataQuality, Datasets, Taxa } from '../../../widgets/dashboard';

export function Dashboard({
  data = {},
  loading,
  error,
  collection,
  occurrenceSearch,
  className,
  ...props
}) {
  const predicate = {
    type: "equals",
    key: "collectionKey",
    value: collection.key
  };
  return <div>
    <div css={css`
      display: flex; margin: -6px; padding-bottom: 200px; flex-wrap: wrap;
      > div {
        flex: 0 1 calc(50% - 12px); margin: 6px;
      }
      `}>
      <div>
        <OccurrenceSummary predicate={predicate} />
      </div>
      <div>
        <DataQuality predicate={predicate} />
      </div>
      <div>
        <Datasets predicate={predicate} />
      </div>
      <div>
        <Taxa predicate={predicate} />
      </div>
    </div>
  </div>
};
