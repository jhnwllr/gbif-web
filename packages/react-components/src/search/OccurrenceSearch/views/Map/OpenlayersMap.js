import React, { Component } from "react";
import { projections } from './openlayers/projections';

import OlMap from 'ol/Map';
import { defaults as olControlDefaults } from 'ol/control';
import * as olInteraction from 'ol/interaction';
import { transform } from 'ol/proj';
import { applyStyle, applyBackground, apply, stylefunction } from 'ol-mapbox-style';
import { VectorTile as VectorTileSource } from 'ol/source';
import { TileImage as TileImageSource } from 'ol/source';
import { MVT as MVTFormat } from 'ol/format';
import TileGrid from 'ol/tilegrid/TileGrid';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Draw, Modify } from 'ol/interaction';
import { Fill, Stroke, Style } from 'ol/style';
import WKT from 'ol/format/WKT.js';
import klokantech from './openlayers/styles/klokantech.json';
import { toast } from "react-toast";
import { getFeatureAsWKT } from "../../../../utils/mapHelpers";

const wktFormatter = new WKT();

var interactions = olInteraction.defaults({ altShiftDragRotate: false, pinchRotate: false, mouseWheelZoom: true });

const mapStyles = {
  klokantech
};

class Map extends Component {
  constructor(props) {
    super(props);

    this.addLayer = this.addLayer.bind(this);
    this.updateLayer = this.updateLayer.bind(this);
    this.onPointClick = this.onPointClick.bind(this);
    this.myRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];

    const mapPos = this.getStoredMapPosition();

    let mapConfig = {
      target: this.myRef.current,
      view: currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom),
      controls: olControlDefaults({ zoom: false, attribution: true }),
      interactions,
    };
    this.map = new OlMap(mapConfig);
    this.updateMapLayers();
    this.mapLoaded = true;
    this.addLayer();
    this.addDrawLayer();
    this.updateFeatures();
  }

  componentWillUnmount() {
    // https://github.com/openlayers/openlayers/issues/9556#issuecomment-493190400
    if (this.map) {
      this.map.setTarget(null);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query && this.mapLoaded) {
      this.updateLayer();
    }

    if (prevProps.mapConfig !== this.props.mapConfig && this.mapLoaded) {
      this.updateMapLayers();
    }

    if (prevProps.latestEvent !== this.props.latestEvent && this.mapLoaded) {
      if (this.props.latestEvent?.type === 'ZOOM_IN') {
        this.zoomIn();
      } else if (this.props.latestEvent?.type === 'ZOOM_OUT') {
        this.zoomOut();
      } else if (this.props.latestEvent?.type === 'ZOOM_TO') {
        const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];
        const newView = currentProjection.getView(this.props.latestEvent.lat, this.props.latestEvent.lng, this.props.latestEvent.zoom);
        this.map.setView(newView);
      } else if (this.props.latestEvent?.type === 'EXPLORE_AREA') {
        this.exploreArea();
      }
    }

    //watch props drawMode and start/stop interactions accordingly
    if (prevProps.drawMode !== this.props.drawMode && this.mapLoaded) {
      if (this.props.drawMode === true) {
        this.startDrawInteraction();
      } else {
        this.stopDrawInteraction();
      }
    }

    //watch deletemode and start/stop interactions accordingly
    if (prevProps.deleteMode !== this.props.deleteMode && this.mapLoaded) {
      if (this.props.deleteMode === true) {
        this.startDeleteInteraction();
      } else {
        this.stopDeleteInteraction();
      }
    }

    // check if polygons prop has changed
    if (prevProps.features !== this.props.features && this.mapLoaded) {
      this.updateFeatures();
    }

    // check if the size of the map container has changed and if so resize the map
    if ((prevProps.height !== this.props.height || prevProps.width !== this.props.width) && this.mapLoaded) {
      this.map.updateSize();
    }
  }

  getStoredMapPosition() {
    const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];

    let zoom = sessionStorage.getItem('mapZoom') || this.props.defaultMapSettings?.zoom || 0;
    zoom = Math.min(Math.max(0, zoom), 20);

    let lng = sessionStorage.getItem('mapLng') || this.props.defaultMapSettings?.lng || 0;
    lng = Math.min(Math.max(-180, lng), 180);

    let lat = sessionStorage.getItem('mapLat') || this.props.defaultMapSettings?.lat || 0;
    lat = Math.min(Math.max(-90, lat), 90);
    // const reprojectedCenter = transform([lng, lat], 'EPSG:4326', currentProjection.srs);
    return {
      lat,//: reprojectedCenter[1], 
      lng,//: reprojectedCenter[0], 
      zoom
    };
  }

  zoomIn() {
    var view = this.map.getView();
    view.setZoom(view.getZoom() + 1);
  };

  zoomOut() {
    var view = this.map.getView();
    view.setZoom(view.getZoom() - 1);
  };

  exploreArea() {
    // get the current view of the map as a bounding box and send it to the parent component
    const { listener } = this.props;
    if (!listener || typeof listener !== 'function') return;
    const view = this.map.getView();
    const extent = view.calculateExtent(this.map.getSize());
    const leftTop = transform([extent[0], extent[3]], view.getProjection(), 'EPSG:4326');
    const rightBottom = transform([extent[2], extent[1]], view.getProjection(), 'EPSG:4326');

    listener({ type: 'EXPLORE_AREA', bbox: { top: leftTop[1], left: leftTop[0], bottom: rightBottom[1], right: rightBottom[0] } });
  }

  removeLayer(name) {
    this.map.getLayers().getArray()
      .filter(layer => layer.get('name') === name)
      .forEach(layer => this.map.removeLayer(layer));
  }

  async updateMapLayers() {
    const epsg = this.props.mapConfig?.projection || 'EPSG_3031';
    const currentProjection = projections[epsg];
    this.setState({ epsg })

    this.map.getLayers().clear();
    // this.updateProjection();

    // update projection
    // const mapPos = this.getStoredMapPosition();
    // const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
    // this.map.setView(newView);

    const basemapStyle = this.props.mapConfig?.basemapStyle || 'klokantech';
    const layerStyle = mapStyles[basemapStyle];
    if (layerStyle) {
      const baseLayer = currentProjection.getBaseLayer();
      const resolutions = baseLayer.getSource().getTileGrid().getResolutions();
      applyBackground(baseLayer, layerStyle, 'openmaptiles');
      applyStyle(baseLayer, layerStyle, 'openmaptiles', undefined, resolutions);
      this.map.addLayer(baseLayer);
    } else if (epsg !== 'EPSG_3857') {

      const styleResponse = await fetch(this.props.mapConfig?.basemapStyle).then(response => response.json());

      if (!styleResponse?.metadata?.['gb:reproject']) {
        const baseLayer = currentProjection.getBaseLayer();
        const resolutions = baseLayer.getSource().getTileGrid().getResolutions();
        applyBackground(baseLayer, styleResponse, 'openmaptiles');
        stylefunction(baseLayer, styleResponse, 'openmaptiles', resolutions);
        this.map.addLayer(baseLayer);
      } else {
        // if this map style is intended to be reprojected then continue
        await apply(this.map, styleResponse);

        const mapPos = this.getStoredMapPosition();
        const map = this.map;

        const mapboxStyle = this.map.get('mapbox-style');
        this.map.getLayers().forEach(function (layer) {
          const mapboxSource = layer.get('mapbox-source');
          if (mapboxSource) {
            const sourceConfig = mapboxStyle.sources[mapboxSource];
            if (sourceConfig.type === 'vector') {
              const source = layer.getSource();
              const sourceConfig = mapboxStyle.sources[mapboxSource];
              layer.setSource(
                new VectorTileSource({
                  format: new MVTFormat(),
                  projection: sourceConfig.projection,
                  urls: source.getUrls(),
                  tileGrid: new TileGrid(sourceConfig.tilegridOptions),
                  wrapX: sourceConfig.wrapX,
                  attributions: [sourceConfig.attribution]
                })
              );

              stylefunction(layer, styleResponse, mapboxSource, sourceConfig.tilegridOptions.resolutions);

              // update the view projection to match the data projection
              const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
              map.setView(newView);
            }
            if (sourceConfig.type === 'raster') {
              const source = layer.getSource();
              layer.setSource(
                new TileImageSource({
                  projection: sourceConfig.projection,
                  urls: sourceConfig.tiles,
                  tileGrid: new TileGrid(sourceConfig.tilegridOptions),
                  tilePixelRatio: 2,
                  wrapX: sourceConfig.wrapX,
                  maxZoom: sourceConfig.maxZoom,
                  attributions: [sourceConfig.attribution]
                })
              );
              if (sourceConfig.extent) {
                layer.setExtent(sourceConfig.extent);
              }

              // update the view projection to match the data projection
              const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
              map.setView(newView);
            }
          }
        });
      }

    } else {
      await apply(this.map, this.props.mapConfig?.basemapStyle || 'http://localhost:3001/map/styles/darkMatter.json');
    }

    // update projection
    const mapPos = this.getStoredMapPosition();
    const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
    this.map.setView(newView);

    this.addLayer();
    this.addDrawLayer();
  }

  // async updateProjection() {
  //   const epsg = this.props.mapConfig?.projection || 'EPSG_3031';
  //   const currentProjection = projections[epsg];

  //   const mapPos = this.getStoredMapPosition();
  //   const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
  //   this.map.setView(newView);
  // }

  updateLayer() {
    this.map.getLayers().getArray()
      .filter(layer => layer.get('name') === 'occurrences')
      .forEach(layer => this.map.removeLayer(layer));
    this.addLayer();
  }

  onPointClick(pointData) {
    this.props.onPointClick(pointData);
  }

  addDrawLayer() {
    const projection = this.props.mapConfig?.projection;
    if (projection === 'EPSG_3031' || projection === 'EPSG_3575') {
      return;
    }
    const map = this.map;
    const that = this;
    const { listener } = this.props;

    if (!this.drawLayer) {
      console.log('create new draw layer');
      const drawSource = new VectorSource({ wrapX: true });
      const drawLayer = new VectorLayer({
        source: drawSource,
        name: 'draw',
        style: new Style({
          fill: new Fill({
            color: '#f1fbff00'
          }),
          stroke: new Stroke({
            color: '#0099ff',
            width: 4
          }),
        }),
      });
      this.map.addLayer(drawLayer);
      this.drawLayer = drawLayer;
      drawLayer.setZIndex(1001);

      let draw = new Draw({
        source: drawSource,
        type: 'Polygon',
        active: false
      });

      let modify = new Modify({ source: drawSource });
      map.addInteraction(draw);
      map.addInteraction(modify);
      draw.setActive(false);
      modify.setActive(false);

      const currentProjection = this.props.mapConfig?.projection;
      modify.on('modifyend', (event) => {
        setTimeout(() => {
          var features = drawLayer.getSource().getFeatures();
          const polygons = features.map(feature => {
            return getFeatureAsWKT(feature, currentProjection);
          });
          listener({ type: 'FEATURES_CHANGED', features: polygons, action: 'MODIFIED'})
        }, 0);
      });

      draw.on('drawend', function (event) {
        var feature = event.feature;
        var newWktPolygon = getFeatureAsWKT(feature, currentProjection);
        const newPolygons = [...(that.props.features || []), newWktPolygon];
        setTimeout(() => listener({ type: 'FEATURES_CHANGED', created: newWktPolygon, features: newPolygons, action: 'NEW'}), 0);
      });

      // add delete interaction for the draw layer. If the user clicks a polygon, then call the onPolygonsChanged prop with the clicked polygon removed
      this.deleteListener = function (event) {
        map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
          drawSource.removeFeature(feature);
          return feature;
        }, {
          layerFilter: function (layer) {
            return layer.get('name') === 'draw';
          }
        });
        setTimeout(() => {
          var features = drawLayer.getSource().getFeatures();
          const polygons = features.map(feature => {
            return getFeatureAsWKT(feature, currentProjection);
          });
          listener({ type: 'FEATURES_CHANGED', features: polygons, action: 'DELETE'})
        }, 0);
        event.stopPropagation();
        event.preventDefault();
        return false;
      };

      this.draw = draw;
      this.modify = modify;
    } else {
      const found = map.getLayers().getArray().find(layer => layer.get('name') == 'draw');
      if (!found) {
        console.log('Add existing drawlayer');
        map.addLayer(this.drawLayer);
      }
    }
    this.updateFeatures();
  }

  // draw polygon layer from list of WKT polygons. Do son the the draw layer
  updateFeatures() {
    if (!this.drawLayer) return;
    // we do not draw polygons in polar projections
    const projection = this.props.mapConfig?.projection;
    if (projection === 'EPSG_3031' || projection === 'EPSG_3575') {
      toast.warn('Drawing polygons is not supported in polar projections'); // toast will fire mutliple times, so disable it.
      return;
    }
    const drawSource = this.drawLayer.getSource();
    drawSource.clear();
    const format = new WKT();
    const features = (this.props.features || []).map(polygon => {
      try {
        const f = format.readFeature(polygon);
        return f;
      } catch (e) {
        return null;
      }
    }).filter(x => x);
    drawSource.addFeatures(features);
  }

  startDrawInteraction() {
    if (!this.drawLayer) return;
    this.draw.setActive(true);
    this.modify.setActive(true);
    this.stopDeleteInteraction();
  }
  stopDrawInteraction() {
    if (!this.drawLayer) return;
    this.draw.setActive(false);
    this.modify.setActive(false);
  }
  startDeleteInteraction() {
    if (!this.drawLayer) return;
    this.stopDrawInteraction();
    this.map.on('click', this.deleteListener);
  }
  stopDeleteInteraction() {
    if (!this.drawLayer) return;
    this.map.un('click', this.deleteListener);
  }

  addLayer() {

    const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];
    const occurrenceLayer = currentProjection.getAdhocLayer({
      style: 'scaled.circles',
      mode: 'GEO_CENTROID',
      squareSize: 512,
      predicateHash: this.props.predicateHash,
      onError: e => {
        // there seem to be no simple way to get the statuscode, so we will just reregister on any type of error
        if (this.props.registerPredicate) {
          this.props.registerPredicate();
        }
      }
    });

    // how to add a layer below e.g. labels on the basemap? // you can insert at specific indices, but the problem is that the basemap are collapsed into one layer
    // occurrenceLayer.setZIndex(0);
    this.map.addLayer(occurrenceLayer);

    const map = this.map

    map.on('moveend', function (e) {
      if (this.refreshingView) return;
      const { center, zoom } = map.getView().getState();
      const reprojectedCenter = transform(center, currentProjection.srs, 'EPSG:4326');
      sessionStorage.setItem('mapZoom', zoom);
      sessionStorage.setItem('mapLng', reprojectedCenter[0]);
      sessionStorage.setItem('mapLat', reprojectedCenter[1]);
    });

    // TODO: find a way to store current extent in a way it can be reused. Should ideallky be the same format as for mapbox: center, zoom
    // const map = this.map
    // if (!this.mapLoaded) {
    //   // remember map position
    //   map.on('zoomend', function () {
    //     const center = map.getCenter();
    //     sessionStorage.setItem('mapZoom', map.getZoom());
    //     sessionStorage.setItem('mapLng', center.lng);
    //     sessionStorage.setItem('mapLat', center.lat);
    //   });

    const pointClickHandler = this.onPointClick;
    const clickHandler = this.props.onMapClick;
    map.on('singleclick', event => {
      // todo : hover and click do not agree on wether there is a point or not
      occurrenceLayer.getFeatures(event.pixel).then(function (features) {
        const feature = features.length ? features[0] : undefined;
        if (feature) {
          const properties = feature.properties_;
          pointClickHandler({ geohash: properties.geohash, count: properties.total });
        } else if (clickHandler) {
          clickHandler();
        }
      });
    });

    map.on('pointermove', function (e) {
      var pixel = map.getEventPixel(e.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel, { layerFilter: l => l.values_.name === 'occurrences' });
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    });
  }

  render() {
    const { query, onMapClick, onPointClick, predicateHash, className, ...props } = this.props;
    return <div ref={this.myRef} className={className} />
  }
}

export default Map;
