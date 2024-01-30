import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import * as charts from '../../../../widgets/dashboard';
import useBelow from '../../../../utils/useBelow';
import Map from '../Map';
import { Resizable } from 're-resizable';
import DashboardBuilder from './DashboardBuilder';
import { useQueryParam } from 'use-query-params';
import Base64JsonParam from '../../../../dataManagement/state/base64JsonParam';

const chartsTypes = {
  Taxa: charts.Taxa,
  Iucn: charts.Iucn,
  Synonyms: charts.Synonyms,
  IucnCounts: charts.IucnCounts,
  Country: charts.Country,
  CollectionCodes: charts.CollectionCodes,
  InstitutionCodes: charts.InstitutionCodes,
  StateProvince: charts.StateProvince,
  IdentifiedBy: charts.IdentifiedBy,
  RecordedBy: charts.RecordedBy,
  EstablishmentMeans: charts.EstablishmentMeans,
  Months: charts.Months,
  Preparations: charts.Preparations,
  Datasets: charts.Datasets,
  Publishers: charts.Publishers,
  HostingOrganizations: charts.HostingOrganizations,
  Collections: charts.Collections,
  Institutions: charts.Institutions,
  Networks: charts.Networks,
  OccurrenceIssue: charts.OccurrenceIssue,
  BasisOfRecord: charts.BasisOfRecord,
  Licenses: charts.Licenses,
  OccurrenceSummary: charts.OccurrenceSummary,
  DataQuality: charts.DataQuality,
  Map: props => {
    return <Resizable
      enable={{ top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
      defaultSize={{
        height: 500,
      }}
    >
      <Map />
    </Resizable>
  },
  // Table: Table,
  // Gallery: Gallery,
}

export function Dashboard({
  predicate,
  ...props
}) {
  const [items, setItems] = useState([]);
  const [view, setView] = React.useState('COLUMN');
  // const [state, setState] = React.useState([[],[],[]]);
  const [state = [[], []], setState] = useQueryParam('state', Base64JsonParam);
  console.log(state);
  // const sections = charts.map((chart, index) => {
  //   const Chart = chartsTypes[chart.type];
  //   return <Chart key={index} interactive predicate={predicate} defaultOption="TABLE" />
  // });

  const sections = items.map((chart, index) => {
    const Chart = chartsTypes[chart.type];
    return (
      <React.Fragment key={index}>
        <Chart interactive predicate={predicate} defaultOption="TABLE" options={['PIE', 'TABLE']}/>
      </React.Fragment>
    );
  });

  return <div>
    <DashboardBuilder predicate={predicate} {...{state, setState}}/>
    {/* <DashBoardLayout> */}
      {/* <charts.Months interactive predicate={predicate} defaultOption="COLUMN" {...{view, setView}} /> */}
      {/* {sections}
      <div>
        <Button onClick={_ => { setItems([...items, { type: 'Taxa' }]) }}>Add new</Button>
        <Button onClick={_ => { setItems([...items, { type: 'Taxa' }]) }}>Taxa</Button>
        <Button onClick={_ => { setItems([...items, { type: 'Iucn' }]) }}>Iucn</Button>
        <Button onClick={_ => { setItems([...items, { type: 'Synonyms' }]) }}>Synonyms</Button>
        <Button onClick={_ => { setItems([...items, { type: 'IucnCounts' }]) }}>IucnCounts</Button>
        <Button onClick={_ => { setItems([...items, { type: 'Country' }]) }}>Country</Button>
        <Button onClick={_ => { setItems([...items, { type: 'CollectionCodes' }]) }}>CollectionCodes</Button>
        <Button onClick={_ => { setItems([...items, { type: 'Map' }]) }}>Map</Button>
      </div> */}
      {/* <charts.Taxa interactive predicate={predicate} />
      <charts.Iucn interactive predicate={predicate} />
      <charts.Synonyms interactive predicate={predicate} />
      <charts.IucnCounts interactive predicate={predicate} />

      <charts.Country interactive predicate={predicate} defaultOption="TABLE" />
      <charts.CollectionCodes interactive predicate={predicate} defaultOption="TABLE" />
      <charts.InstitutionCodes interactive predicate={predicate} defaultOption="TABLE" />
      <charts.StateProvince interactive predicate={predicate} defaultOption="TABLE" />
      <charts.IdentifiedBy interactive predicate={predicate} defaultOption="TABLE" />
      <charts.RecordedBy interactive predicate={predicate} defaultOption="TABLE" />
      <charts.EstablishmentMeans interactive predicate={predicate} defaultOption="PIE" />
      <charts.Months interactive predicate={predicate} defaultOption="COLUMN" />
      <charts.Preparations predicate={predicate} defaultOption="PIE" />

      <charts.Datasets interactive predicate={predicate} defaultOption="TABLE" />
      <charts.Publishers interactive predicate={predicate} defaultOption="TABLE" />
      <charts.HostingOrganizations interactive predicate={predicate} defaultOption="TABLE" />
      <charts.Collections interactive predicate={predicate} defaultOption="TABLE" />
      <charts.Institutions interactive predicate={predicate} defaultOption="TABLE" />
      <charts.Networks interactive predicate={predicate} defaultOption="TABLE" />

      <charts.OccurrenceIssue interactive predicate={predicate} />
      <charts.BasisOfRecord interactive predicate={predicate} />
      <charts.Licenses interactive predicate={predicate} />
      <charts.OccurrenceSummary predicate={predicate} />
      <charts.DataQuality predicate={predicate} />
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
      <charts.Months interactive predicate={predicate} defaultOption="COLUMN" />
      <div><Gallery style={{overflow:  'auto', paddingBottom: 48}} size={10} /></div> */}
    {/* </DashBoardLayout> */}
  </div>
};

function DashboardSection({ children, ...props }) {
  return <div css={css`margin-bottom: 12px;`} {...props}>{children}</div>
}
function DashBoardLayout({ children, predicate, queueUpdates = false, ...props }) {
  const isSingleColumn = useBelow(900);
  const isdoubleColumn = useBelow(1200);
  const flattenedChildren = React.Children.toArray(children);

  const childrenArray = (Array.isArray(flattenedChildren) ? flattenedChildren : [flattenedChildren]).map((child, index) => <DashboardSection>{child}</DashboardSection>);
  if (isSingleColumn) {
    return <div css={css`padding-bottom: 50px;`}>{childrenArray}</div>
  }

  let width = '33%';
  if (isSingleColumn) {
    width = '100%';
  }
  if (isdoubleColumn) {
    width = '50%';
  }


  return <div css={css`
    display: flex; margin: -6px; padding-bottom: 50px; flex-wrap: wrap;
    > div {
      flex: 0 1 calc(${width} - 12px); 
      margin: 6px;
      width: calc(${width} - 12px);
    }
  `}>
    <div>
      {childrenArray
        .filter((x, i) => i % 3 === 0)
        .map((x, i) => <React.Fragment key={i}>{x}</React.Fragment>)}
    </div>
    <div>
      {childrenArray
        .filter((x, i) => i % 3 === 1)
        .map((x, i) => <React.Fragment key={i}>{x}</React.Fragment>)}
    </div>
    <div>
      {childrenArray
        .filter((x, i) => i % 3 === 2)
        .map((x, i) => <React.Fragment key={i}>{x}</React.Fragment>)}
    </div>
  </div>

}
