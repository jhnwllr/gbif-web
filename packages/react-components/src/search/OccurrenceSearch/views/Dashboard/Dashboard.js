import { jsx, css } from '@emotion/react';
import React from 'react';
import useBelow from '../../../../utils/useBelow';
import DashboardBuilder from './DashboardBuilder';
import { useQueryParam } from 'use-query-params';
import Base64JsonParam from '../../../../dataManagement/state/base64JsonParam';
import { useLocalStorage } from 'react-use';
import { Button } from '../../../../components';
import { FormattedMessage } from 'react-intl';

export function Dashboard({
  predicate,
  ...props
}) {
  const [urlLayout, setUrlLayout] = useQueryParam('layout', Base64JsonParam);
  const [layout = [[]], setLayoutState, removeLayoutState] = useLocalStorage('occurrenceDashboardLayout', false);

  const isUrlLayoutDifferent = urlLayout && JSON.stringify(urlLayout) !== JSON.stringify(layout);

  return <div>
    {isUrlLayoutDifferent && <div css={css`margin-bottom: 12px;`}><FormattedMessage id="dashboard.sharedLayout" /> <Button css={css`margin-inline-start: 12px;`} onClick={() => setUrlLayout()}><FormattedMessage id="phrases.discard" /></Button> <Button look="primaryOutline" css={css`margin-inline-start: 12px;`} onClick={() => {setLayoutState(urlLayout); setUrlLayout();}}><FormattedMessage id="phrases.keep" /></Button></div>}
    <DashboardBuilder predicate={predicate} setState={(value, useUrl) => {
      if (useUrl) {
        setUrlLayout(value);
      } else {
        setLayoutState(value);
        setUrlLayout();
      }
    }} state={urlLayout ?? layout} {...{lockedLayout: isUrlLayoutDifferent}}/>
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
