/*
Map options
it would be nice to be able to support overlays at some point. With an opacity setting I imagine
Other than that we need 4 projections
satellite map (hp participants will have to register to get a token themselves - to avoid overloading the service)
mercator maps will support both OL and MB
and some default styles for OL and MB to choose from, possibly an option to add ones own.
And probably the point overlays will have to be dependent on the basemap as well?

*/
import { jsx, css } from '@emotion/react';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import React, { useContext, useState, useEffect, useCallback } from "react";
import { DetailsDrawer, Menu, MenuAction, Button, Popover } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { useDialogState } from "reakit/Dialog";
import ListBox from './ListBox';
import { MdOutlineLayers, MdZoomIn, MdZoomOut, MdLanguage, MdMyLocation, MdLegendToggle, MdVisibility, MdVisibilityOff, MdDragHandle } from 'react-icons/md'
import { ViewHeader } from '../ViewHeader';
import MapComponentMB from './MapboxMap';
import MapComponentOL from './OpenlayersMap';
import * as styles from './map.styles';
import env from '../../../../../.env.json';
import SiteContext from '../../../../dataManagement/SiteContext';
import { FormattedMessage } from 'react-intl';
import { getMapStyles } from './standardMapStyles';
import { toast } from 'react-toast'

const pixelRatio = parseInt(window.devicePixelRatio) || 1;
const hasGeoLocation = "geolocation" in navigator;

let colorPool = [
  '#a6cee3',
  '#1f78b4',
  '#b2df8a',
  '#33a02c',
  '#fb9a99',
  '#e31a1c',
  '#fdbf6f',
  '#ff7f00',
  '#cab2d6',
  '#6a3d9a',
  '#ffff99',
  '#b15928',
];
const preferedColors = JSON.parse(JSON.stringify(colorPool));

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`.padEnd(7, 8);

function getColor() {
  const optionsLeft = colorPool.length;
  if (optionsLeft === 0) return randomColor();
  const randomIndex = Math.floor(Math.random() * optionsLeft);
  const c = colorPool.splice(randomIndex, 1)[0];
  return c;
}

function dropColor(c) {
  if (preferedColors.indexOf(c) > -1) {
    colorPool.push(c);
  }
}

const defaultLayerOptions = {
  // ARCTIC: ['NATURAL', 'BRIGHT', 'DARK'],
  // PLATE_CAREE: ['NATURAL', 'BRIGHT', 'DARK'],
  MERCATOR: ['BRIGHT', 'NATURAL'],
  // ANTARCTIC: ['NATURAL', 'BRIGHT', 'DARK']
};

function getStyle({ styles = {}, projection, type, lookup = {}, layerOptions }) {
  const fallbackStyleName = `${layerOptions?.[projection]?.[0]}_${projection}`
  const styleKey = lookup?.[projection]?.[type] || `${type}_${projection}`;
  let style = styles[styleKey] ? styles[styleKey] : styles[fallbackStyleName];
  return style;
}

function Map({ labelMap, query, q, pointData, pointError, pointLoading, loading, total, predicateHash, registerPredicate, loadPointData, defaultMapSettings, facets, breakdownField, setBreakdownField, ...props }) {
  const dialog = useDialogState({ animated: true, modal: false });
  const theme = useContext(ThemeContext);
  const siteContext = useContext(SiteContext);
  const userLocationEnabled = siteContext?.occurrence?.mapSettings?.userLocationEnabled;
  const [occLayers, setOccLayers] = useState([]);
  const [activeMenu, setActiveMenu] = useState();

  useEffect(() => {
    if (facets) {
      // compare the keys in facets with the keys in occLayers. If they are not the same, update occLayers
      // if they are the same, update the other values in occLayers (e.g. count, title, etc.)
      if (keysHaveChanged(occLayers, facets)) {
        const layers = facets.map(f => ({ ...f, color: getColor() }));
        setOccLayers(layers);
      }
    } else {
      setOccLayers();
    }
  }, [facets, occLayers]);

  const onSortEnd = useCallback(({ items, oldIndex, newIndex }) => {
    // clone array, and move item from oldIndex to newIndex
    const newLayers = [...items];
    const [removed] = newLayers.splice(oldIndex, 1);
    newLayers.splice(newIndex, 0, removed);
    setOccLayers(newLayers);
  }, []);

  const updateColor = useCallback(({ node, color, occLayers }) => {
    // update the color of the node in occLayers
    const newLayers = occLayers.map(layer => {
      if (layer.key === node.key) {
        return { ...layer, color };
      }
      return layer;
    });
    setOccLayers(newLayers);
  }, []);

  const updateVisiblity = useCallback(({ item }) => {
    // update the visibility of the node in occLayers
    debugger;
    const newLayers = occLayers.map(layer => {
      if (layer.key === item.key) {
        return { ...layer, visible: item.visible };
      }
      return layer;
    });
    setOccLayers(newLayers);
  }, [occLayers]);

  const styleLookup = siteContext?.maps?.styleLookup || {};

  const mapStyles = siteContext?.maps?.mapStyles || defaultLayerOptions;
  const supportedProjections = Object.keys(mapStyles);
  const [projectionOptions, setProjectionOptions] = useState(supportedProjections);
  let defaultProjection = sessionStorage.getItem('defaultOccurrenceProjection') || siteContext?.maps?.defaultProjection || supportedProjections[0];
  if (!supportedProjections.includes(defaultProjection)) {
    defaultProjection = supportedProjections[0];
  }
  const [projection, setProjection] = useState(defaultProjection);

  let defaultStyle = sessionStorage.getItem('defaultOccurrenceLayer') || siteContext?.maps?.defaultMapStyle || 'BRIGHT';
  if (!mapStyles?.[defaultProjection]?.includes(defaultStyle)) {
    defaultStyle = mapStyles?.[defaultProjection]?.[0];
  }

  const [layerOptions, setLayerOptions] = useState(mapStyles);
  const [layerId, setLayerId] = useState(defaultStyle);
  const [latestEvent, broadcastEvent] = useState();
  const [searchingLocation, setLocationSearch] = useState();
  const [basemapOptions, setBasemapOptions] = useState();
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const [listVisible, showList] = useState(false);

  const items = pointData?.occurrenceSearch?.documents?.results || [];

  useEffect(() => {
    const mapStyles = getMapStyles({ apiKeys: siteContext.apiKeys, language: siteContext?.maps?.locale || 'en', });
    let mapStyleOverwrites = {};
    if (siteContext?.maps?.addMapStyles) {
      mapStyleOverwrites = siteContext.maps.addMapStyles({
        apiKeys: siteContext.apiKeys,
        mapStyleServer: env.MAP_STYLES,
        pixelRatio,
        language: siteContext?.maps?.locale || 'en',
        mapComponents: {
          OpenlayersMap: MapComponentOL,
          MapboxMap: MapComponentMB,
        }
      });
    }
    setBasemapOptions(Object.assign({}, mapStyles, mapStyleOverwrites));
  },
    [siteContext],
  );

  useEffect(() => {
    setActiveItem(items[activeId]);
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [items, activeId]);

  const getUserLocation = useCallback(() => {
    if (hasGeoLocation) {
      setLocationSearch(true);
      navigator.geolocation.getCurrentPosition((position) => {
        setLocationSearch(false);
        const { latitude, longitude } = position.coords;
        broadcastEvent({ type: 'ZOOM_TO', lat: latitude, lng: longitude, zoom: 11 });
      }, err => {
        toast.error(<div>
          <h3><FormattedMessage id='map.failedToGetUserLocation.title' defaultMessage="Unable to get location." /></h3>
          <FormattedMessage id='map.failedToGetUserLocation.message' defaultMessage="Check browser settings." />
        </div>, {
          backgroundColor: 'tomato',
          color: '#ffffff',
        });
        setLocationSearch(false);
      });
    }
  }, []);

  const menuLayerOptions = menuState => layerOptions?.[projection].map((layerId) => {
    const layerStyle = getStyle({ styles: basemapOptions, projection, type: layerId, lookup: styleLookup });
    const labelKey = layerStyle.labelKey;
    return <MenuAction key={layerId} onClick={() => {
      setLayerId(layerId);
      sessionStorage.setItem('defaultOccurrenceLayer', layerId);
    }}>
      <FormattedMessage id={labelKey || 'unknown'} defaultMessage={labelKey} />
    </MenuAction>
  });

  const projectionMenuOptions = menuState => projectionOptions.map((proj, i) => <MenuAction key={proj} onClick={() => {
    setProjection(proj);
    sessionStorage.setItem('defaultOccurrenceProjection', proj);
  }}>
    <FormattedMessage id={`map.projections.${proj}`} defaultMessage={proj} />
  </MenuAction>);

  const mapConfiguration = getStyle({
    styles: basemapOptions,
    projection,
    type: layerId,
    lookup: styleLookup,
    layerOptions
  });

  if (!basemapOptions || !mapConfiguration) return null;
  const MapComponent = mapConfiguration.component || MapComponentOL;

  return <>
    <DetailsDrawer href={`https://www.gbif.org/occurrence/${activeItem?.key}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeItem?.key} defaultTab='details' style={{ maxWidth: '100%', width: 700, height: '100%' }} onCloseRequest={() => dialog.setVisible(false)} />
    </DetailsDrawer>
    <div css={styles.mapArea({ theme })}>
      <ViewHeader message="counts.nResultsWithCoordinates" loading={loading} total={total} />
      <div style={{ position: 'relative', height: '200px', flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
        {listVisible && <ListBox onCloseRequest={e => showList(false)}
          labelMap={labelMap}
          onClick={({ index }) => { dialog.show(); setActive(index) }}
          data={pointData} error={pointError}
          loading={pointLoading}
          css={styles.resultList({})}
        />}
        <div css={styles.mapControls}>
          <div css={styles.mapControlsOptions}>
            <div>
              <Button appearance="text" css={styles.mapControlsButton()} onClick={() => broadcastEvent({ type: 'ZOOM_IN' })}><MdZoomIn /></Button>
              <Button appearance="text" css={styles.mapControlsButton()} onClick={() => broadcastEvent({ type: 'ZOOM_OUT' })}><MdZoomOut /></Button>
              {projectionOptions.length > 1 && <Menu style={{ display: 'inline-block' }}
                aria-label="Select projection"
                trigger={<Button appearance="text" css={styles.mapControlsButton()}><MdLanguage /></Button>}
                items={projectionMenuOptions}
              />}
              {layerOptions?.[projection]?.length > 1 && <Menu style={{ display: 'inline-block' }}
                aria-label="Select layers"
                trigger={<Button appearance="text" css={styles.mapControlsButton()} ><MdOutlineLayers /></Button>}
                items={menuLayerOptions}
              />}
              <Button appearance="text" css={styles.mapControlsButton({ active: activeMenu === 'LEGEND' })} onClick={() => setActiveMenu(activeMenu !== 'LEGEND' ? 'LEGEND' : null)}><MdLegendToggle /></Button>
              {userLocationEnabled && <Button loading={searchingLocation} appearance="text" css={styles.mapControlsButton()} onClick={getUserLocation}><MdMyLocation /></Button>}
            </div>
          </div>
          {activeMenu === 'LEGEND' && <div css={styles.mapControlsContent}>
            <div>
              <SortableList updateVisiblity={updateVisiblity} updateColor={props => updateColor({...props, occLayers})} items={occLayers ?? []} onSortEnd={props => onSortEnd({ ...props, items: occLayers })} useDragHandle />
            </div>
          </div>}
        </div>
        <MapComponent
          mapConfig={mapConfiguration.mapConfig}
          latestEvent={latestEvent}
          defaultMapSettings={defaultMapSettings}
          predicateHash={predicateHash}
          occurrenceLayers={occLayers}
          q={q}
          css={styles.mapComponent({ theme })}
          theme={theme}
          query={query}
          onMapClick={e => showList(false)}
          onPointClick={data => { showList(true); loadPointData(data) }}
          registerPredicate={registerPredicate} />
      </div>
    </div>
  </>;
}

const SortableList = SortableContainer(({ items, updateVisiblity, updateColor }) => {
  return (
    <ul css={styles.legendList}>
      {items.map((value, index) => (
        <SortableItem key={`item-${value.key}`} index={index} value={value} updateVisiblity={updateVisiblity} updateColor={updateColor} />
      ))}
    </ul>
  );
});

const SortableItem = SortableElement(({ value, updateVisiblity, updateColor }) => {
  const [color, setColor] = useState(value.color);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      if (color !== value.color)
        updateColor({ node: value, color });
    }, 200);
    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debounced value from updating if value is changed ...
    // .. within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler);
    };
  },
    [value, updateColor, color] // Only re-call effect if value or delay changes
  );

  const title = value.title ?? 'Unknown';

  return <li css={styles.legendItem}>
    <DragHandle />
    <input type="color" onChange={e => setColor(e.target.value)} value={color} />
    <div>
      {!value.visible && <MdVisibilityOff onClick={e => updateVisiblity({ item: { ...value, visible: true } })} />}
      {value.visible && <MdVisibility onClick={e => updateVisiblity({ item: { ...value, visible: false } })} />}
    </div>
    <div css={styles.legendText} dangerouslySetInnerHTML={{ __html: title }} style={{ flex: '1 1 auto' }}></div>
  </li>
});

const DragHandle = sortableHandle(() => <MdDragHandle style={{ display: 'inline-block', cursor: 'grab', color: '#aaa', marginRight: 12 }} />);

function keysHaveChanged(obj1, obj2) {
  if (!obj1 || !obj2) return true;
  const obj1Keys = new Set(obj1.map(x => x.key));
  const obj2Keys = new Set(obj2.map(x => x.key));

  if (obj1Keys.size !== obj2Keys.size) {
    return true;
  }

  for (let key of obj1Keys) {
    if (!obj2Keys.has(key)) {
      return true;
    }
  }

  return false;
}

export default Map;
