import React from 'react';
import { Feature, Map as OpenLayersMap, View } from 'ol/index.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Point } from 'ol/geom.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { useGeographic } from 'ol/proj.js';
import { useOnMountUnsafe } from '../hooks/useOnMountUnsafe';

useGeographic();

export function Map({ coordinates }) {
  const mapRef = React.useRef();

  useOnMountUnsafe(() => {
    const place = [coordinates.lat, coordinates.lon];

    new OpenLayersMap({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [new Feature(new Point(place))],
          }),
          style: {
            'circle-radius': 9,
            'circle-fill-color': 'green',
          },
        }),
      ],
      target: mapRef.current,
      view: new View({
        center: place,
        zoom: 4,
      }),
    });
  });

  return <div style={{ width: 500, height: 500 }} ref={mapRef}></div>;
}
