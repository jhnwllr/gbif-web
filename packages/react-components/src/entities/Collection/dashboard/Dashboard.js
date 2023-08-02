import { jsx, css } from '@emotion/react';
import React, { useCallback, useContext, useEffect } from 'react';
import { OccurrenceMap } from '../../../components';
import * as charts from '../../../widgets/dashboard';
import useBelow from '../../../utils/useBelow';
import RouteContext from '../../../dataManagement/RouteContext';

export function Dashboard({
  data = {},
  loading,
  error,
  collection,
  occurrenceSearch,
  className,
  ...props
}) {
  const routeContext = useContext(RouteContext);
  const [count, setCount] = React.useState(0);
  const predicate = {
    type: "equals",
    key: "taxonKey",
    value: count
  };
  const specimenSearchRoute = routeContext.collectionKeySpecimens.route.replace(':key', collection.key);
  return <div>
    <button onClick={() => setCount(count + 1)}>counter: {count}</button>
    <DashBoardLayout>
      <charts.CollectionCodes predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.InstitutionCodes predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.StateProvince predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.IdentifiedBy predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.RecordedBy predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.Preparations predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="PIE" />
      <charts.EstablishmentMeans predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="PIE" />
      <charts.Months predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="COLUMN" currentFilter={{
        must: {
          taxonKey: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        }
      }} />
      {/* <charts.Preparations2 predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="TABLE" /> */}
      
      {/* <Datasets predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <Publishers predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <HostingOrganizations predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <Collections predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <Institutions predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <Networks predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="TABLE" /> */}

      {/* <OccurrenceIssue predicate={predicate} detailsRoute={specimenSearchRoute} />
      <BasisOfRecord predicate={predicate} detailsRoute={specimenSearchRoute} />
      <Licenses predicate={predicate} detailsRoute={specimenSearchRoute} />
      <Months predicate={predicate} detailsRoute={specimenSearchRoute} defaultOption="COLUMN" currentFilter={{
        must: {
          taxonKey: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        }
      }} />
      <OccurrenceSummary predicate={predicate} />
      <OccurrenceMap rootPredicate={predicate} />
      <DataQuality predicate={predicate} />
      <Preparations predicate={predicate} />
      <Taxa predicate={predicate} />
      <Iucn predicate={predicate} /> */}
    </DashBoardLayout>
  </div>
};

function DashboardSection({ children, ...props }) {
  return <div css={css`margin-bottom: 12px;`} {...props}>{children}</div>
}
function DashBoardLayout({ children, predicate, queueUpdates = false, ...props }) {
  const isBelow800 = useBelow(1000);

  const childrenArray = (Array.isArray(children) ? children : [children]).map((child, index) => <DashboardSection>{child}</DashboardSection>);
  if (isBelow800) {
    return <div css={css`padding-bottom: 200px;`}>{childrenArray}</div>
  }

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
