import { jsx, css } from '@emotion/react';
import React from 'react';
import { OccurrenceSummary, DataQuality, Datasets, Taxa, Iucn, Preparations } from '../../../widgets/dashboard';
import useBelow from '../../../utils/useBelow';

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
    <DashBoardLayout>
      <DashboardSection>
        <OccurrenceSummary predicate={predicate} />
      </DashboardSection>
      <DashboardSection>
        <DataQuality predicate={predicate} />
      </DashboardSection>
      <DashboardSection>
        <Preparations predicate={predicate} />
      </DashboardSection>
      <DashboardSection>
        <Datasets predicate={predicate} />
      </DashboardSection>
      <DashboardSection>
        <Taxa predicate={predicate} />
      </DashboardSection>
      <DashboardSection>
        <Iucn predicate={predicate} />
      </DashboardSection>
    </DashBoardLayout>
  </div>
};

function DashboardSection({ children, ...props }) {
  return <div css={css`margin-bottom: 12px;`} {...props}>{children}</div>
}
function DashBoardLayout({ children, ...props }) {
  const isBelow800 = useBelow(1000);
  if (isBelow800) {
    return <div css={css`padding-bottom: 200px;`}>{children}</div>
  }

  return <div css={css`
    display: flex; margin: -6px; padding-bottom: 200px; flex-wrap: wrap;
    > div {
      flex: 0 1 calc(50% - 12px); margin: 6px;
    }
  `}>
    <div>
      {children
        .filter((x, i) => i % 2 === 0)
        .map(x => x)}
    </div>
    <div>
      {children
        .filter((x, i) => i % 2 !== 0)
        .map(x => x)}
    </div>
  </div>

}
