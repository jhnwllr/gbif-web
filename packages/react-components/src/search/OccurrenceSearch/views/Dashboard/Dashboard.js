import { jsx, css } from '@emotion/react';
import React, { useCallback, useContext, useEffect } from 'react';
import * as charts from '../../../../widgets/dashboard';
import useBelow from '../../../../utils/useBelow';
import RouteContext from '../../../../dataManagement/RouteContext';
import Map from '../Map';
import Table from '../Table';
import Gallery from '../Gallery';
import { Resizable } from 're-resizable';

export function Dashboard({
  predicate,
  ...props
}) {
  return <div>
    <DashBoardLayout>
      {/* <charts.Taxa interactive predicate={predicate} />
      <charts.Iucn interactive predicate={predicate} />
      <charts.Synonyms interactive predicate={predicate} />
      <charts.IucnCounts interactive predicate={predicate} /> */}

      {/* <charts.Country interactive predicate={predicate} defaultOption="TABLE" />
      <charts.CollectionCodes interactive predicate={predicate} defaultOption="TABLE" />
      <charts.InstitutionCodes interactive predicate={predicate} defaultOption="TABLE" />
      <charts.StateProvince interactive predicate={predicate} defaultOption="TABLE" />
      <charts.IdentifiedBy interactive predicate={predicate} defaultOption="TABLE" />
      <charts.RecordedBy interactive predicate={predicate} defaultOption="TABLE" />
      <charts.EstablishmentMeans interactive predicate={predicate} defaultOption="PIE" />
      <charts.Months interactive predicate={predicate} defaultOption="COLUMN" />
      <charts.Preparations predicate={predicate} defaultOption="PIE" /> */}

      {/* <charts.Datasets interactive predicate={predicate} defaultOption="TABLE" />
      <charts.Publishers interactive predicate={predicate} defaultOption="TABLE" />
      <charts.HostingOrganizations interactive predicate={predicate} defaultOption="TABLE" />
      <charts.Collections interactive predicate={predicate} defaultOption="TABLE" />
      <charts.Institutions interactive predicate={predicate} defaultOption="TABLE" />
      <charts.Networks interactive predicate={predicate} defaultOption="TABLE" /> */}

      {/* <charts.OccurrenceIssue interactive predicate={predicate} />
      <charts.BasisOfRecord interactive predicate={predicate} />
      <charts.Licenses interactive predicate={predicate} />
      <charts.Months interactive predicate={predicate} defaultOption="COLUMN" /> */}
      {/* <charts.OccurrenceSummary predicate={predicate} />
      <charts.DataQuality predicate={predicate} />
      <div style={{height: 500}}><Map/></div> */}
      <Resizable
        enable={{ top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
        defaultSize={{
          height: 500,
        }}
      >
        <Map />
      </Resizable>
      <Resizable
        enable={{ top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
        defaultSize={{
          height: 500,
        }}
      >
        <Table />
      </Resizable>
      {/* <div style={{ height: 500 }}><Map /></div>
      <div style={{ height: 500 }}><Table style={{ height: 500 }} /></div> */}
      <charts.Months interactive predicate={predicate} defaultOption="COLUMN" />
      {/* <div><Gallery style={{overflow:  'auto', paddingBottom: 48}} size={10} /></div> */}
      {/* <charts.Preparations predicate={predicate} /> */}
      {/* <charts.Country interactive predicate={predicate} defaultOption="TABLE" />
      <charts.CollectionCodes interactive predicate={predicate} defaultOption="TABLE" />
      <charts.InstitutionCodes interactive predicate={predicate} defaultOption="TABLE" />
      <charts.StateProvince interactive predicate={predicate} defaultOption="TABLE" />
      <charts.IdentifiedBy interactive predicate={predicate} defaultOption="TABLE" />
      <charts.RecordedBy interactive predicate={predicate} defaultOption="TABLE" />
      <charts.EstablishmentMeans interactive predicate={predicate} defaultOption="PIE" />
      <charts.Months interactive predicate={predicate} defaultOption="COLUMN" />
      <charts.Preparations predicate={predicate} defaultOption="PIE" /> */}
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
      flex: 0 1 calc(50% - 12px); 
      margin: 6px;
      width: calc(50% - 12px);
    }
  `}>
    <div>
      {childrenArray
        .filter((x, i) => i % 2 === 0)
        .map((x, i) => <React.Fragment key={i}>{x}</React.Fragment>)}
    </div>
    <div>
      {childrenArray
        .filter((x, i) => i % 2 !== 0)
        .map((x, i) => <React.Fragment key={i}>{x}</React.Fragment>)}
    </div>
  </div>

}
