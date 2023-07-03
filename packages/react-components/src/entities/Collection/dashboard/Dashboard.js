import { jsx, css } from '@emotion/react';
import React from 'react';
import { OccurrenceMap } from '../../../components';
import { OccurrenceSummary, DataQuality, Datasets, Taxa, Iucn, Preparations, Months, Licenses, BasisOfRecord, OccurrenceIssue } from '../../../widgets/dashboard';
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
        <OccurrenceIssue predicate={predicate} detailsRoute={'/specimens'} />
      </DashboardSection>
      <DashboardSection>
        <BasisOfRecord predicate={predicate} detailsRoute={'/specimens'} />
      </DashboardSection>
      <DashboardSection>
        <Licenses predicate={predicate} detailsRoute={'/specimens'} />
      </DashboardSection>
      <DashboardSection>
        <Months predicate={predicate} detailsRoute={'/specimens'} currentFilter={{
          must: {
            taxonKey: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          }
        }} />
      </DashboardSection>
      <DashboardSection>
        <OccurrenceSummary predicate={predicate} />
      </DashboardSection>
      <DashboardSection>
        <OccurrenceMap rootPredicate={predicate} />
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

  const childrenArray = Array.isArray(children) ? children : [children];

  return <div css={css`
    display: flex; margin: -6px; padding-bottom: 200px; flex-wrap: wrap;
    > div {
      flex: 0 1 calc(50% - 12px); margin: 6px;
    }
  `}>
    <div>
      {childrenArray
        .filter((x, i) => i % 2 === 0)
        .map(x => x)}
    </div>
    <div>
      {childrenArray
        .filter((x, i) => i % 2 !== 0)
        .map(x => x)}
    </div>
  </div>

}
