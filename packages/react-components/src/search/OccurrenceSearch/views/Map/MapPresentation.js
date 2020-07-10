/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useEffect, useCallback } from "react";
import { DetailsDrawer } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import ListBox from './ListBox';
import { ViewHeader } from '../ViewHeader';
import MapboxMap from './MapboxMap';
import * as css from './map.styles';

function Map({ labelMap, query, pointData, pointError, pointLoading, loading, total, loadPointData, ...props }) {
  const dialog = useDialogState({ animated: true });
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const [listVisible, showList] = useState(false);

  const items = pointData?.occurrenceSearch?.documents?.results || [];

  useEffect(() => {
    setActiveItem(items[activeId]);
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [items, activeId]);

  return <>
    <DetailsDrawer dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeItem?.gbifId} defaultTab='details' style={{ width: 700, height: '100%' }} />
    </DetailsDrawer>
    <div css={css.mapArea({})}>
      <ViewHeader loading={loading} total={total} />
      <div style={{position: 'relative', height: '100%'}}>
        {listVisible && <ListBox  onCloseRequest={e => showList(false)} 
                                  labelMap={labelMap}
                                  onClick={({ index }) => { dialog.show(); setActive(index) }} 
                                  data={pointData} error={pointError} 
                                  loading={pointLoading} 
                                  css={css.resultList({})} 
                                  />}
        <MapboxMap css={css.mapComponent({})} query={query} onMapClick={data => { showList(true); loadPointData(data) }} />
      </div>
    </div>
  </>;
}

export default Map;
