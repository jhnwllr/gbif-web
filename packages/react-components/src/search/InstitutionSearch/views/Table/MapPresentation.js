import { jsx, css } from '@emotion/react';
import React, { useContext, useState, useEffect, useCallback } from "react";
import { Button } from '../../../../components';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { MdZoomIn, MdZoomOut } from 'react-icons/md'

import * as mapCss from '../../../OccurrenceSearch/views/Map/map.styles';
import env from '../../../../../.env.json';
import SiteContext from '../../../../dataManagement/SiteContext';
import { ViewHeader } from '../../../OccurrenceSearch/views/ViewHeader';
import MercatorPointMap from './MercatorPointMap';
import { ResourceAction } from '../../../../components/resourceLinks/resourceLinks';
const pixelRatio = parseInt(window.devicePixelRatio) || 1;

const defaultLayerOptions = {
  // ARCTIC: ['NATURAL', 'BRIGHT', 'DARK'],
  // PLATE_CAREE: ['NATURAL', 'BRIGHT', 'DARK'],
  MERCATOR: ['BRIGHT', 'NATURAL'],
  // ANTARCTIC: ['NATURAL', 'BRIGHT', 'DARK']
};

function Map({ labelMap, query, q, pointData, pointError, pointLoading, loading, total, predicateHash, registerPredicate, loadPointData, defaultMapSettings, ...props }) {
  const theme = useContext(ThemeContext);
  const [latestEvent, broadcastEvent] = useState();
  const [listVisible, showList] = useState(false);
  const [items, setItems] = useState(false);

  return <>
    <div css={mapCss.mapArea({ theme })}>
      <ViewHeader message="counts.nResultsWithCoordinates" loading={loading} total={total} />
      <div style={{ position: 'relative', height: '200px', flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
        {listVisible && <InstitutionList institutions={items} onCloseRequest={e => showList(false)} />}
        <div css={mapCss.mapControls({ theme })}>
          <Button appearance="text" onClick={() => broadcastEvent({ type: 'ZOOM_IN' })}><MdZoomIn /></Button>
          <Button appearance="text" onClick={() => broadcastEvent({ type: 'ZOOM_OUT' })}><MdZoomOut /></Button>
        </div>
        <MercatorPointMap
          latestEvent={latestEvent}
          onPointClick={items => {
            showList(true); 
            setItems(items); 
          }}
          style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  </>;
}

export default Map;

function InstitutionList({ institutions = [] }) {
  if (!institutions?.length) return null;
  if (institutions.length === 1) return <ResourceAction type='institutionKey' id={institutions[0].key} />
  return <ul css={css`
    position: absolute;
    margin: 12px;
    z-index: 10;
    background: white;
    padding: 0;
    list-style: none;
    `}>
    {institutions.map(i => <li
      css={css`
        padding: 8px 12px;
        border-bottom: 1px solid #ccc;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      `}
      key={i.key}>
      <ResourceAction type='institutionKey' id={i.key} />
    </li>)}
  </ul>
}