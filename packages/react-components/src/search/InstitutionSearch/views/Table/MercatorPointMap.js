import React, { useContext, useState, useEffect, Component } from "react";
import mapboxgl from 'mapbox-gl';
import env from '../../../../../.env.json';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { FilterContext } from "../../../../widgets/Filter/state";
import SearchContext from "../../../SearchContext";
import queryString from 'query-string';
import { filter2v1 } from '../../../../dataManagement/filterAdapter';
import axios from "../../../../dataManagement/api/axios";
import uniqBy from 'lodash/uniqBy';

const mapStyles = {

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
    const mapStyle = this.props.theme.darkTheme ? 'dark-v9' : 'light-v9';
    let zoom = sessionStorage.getItem('mapZoom') || this.props.defaultMapSettings?.zoom || 0;
    zoom = Math.min(Math.max(0, zoom), 20);
    zoom -= 1;

    let lng = sessionStorage.getItem('mapLng') || this.props.defaultMapSettings?.lng || 0;
    lng = Math.min(Math.max(-180, lng), 180);

    let lat = sessionStorage.getItem('mapLat') || this.props.defaultMapSettings?.lat || 0;
    lat = Math.min(Math.max(-85, lat), 85);

    mapboxgl.accessToken = env.MAPBOX_KEY;
    this.map = new mapboxgl.Map({
      container: this.myRef.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      // style: 'https://api.mapbox.com/styles/v1/mapbox/light-v9?access_token=pk.eyJ1IjoiZ2JpZiIsImEiOiJja3VmZm50Z3kxcm1vMnBtdnBmeGd5cm9hIn0.M2z2n9QP9fRHZUCw9vbgOA',
      // style: this.getStyle(),
      zoom,
      center: [lng, lat]
    });
    // this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');
    this.map.on("load", this.addLayer);
  }

  componentWillUnmount() {
    if (this.map) this.map.remove();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query && this.mapLoaded) {
      this.updateLayer();
    }
    if (prevProps.theme !== this.props.theme && this.mapLoaded) {
      const mapStyle = this.props.theme.darkTheme ? 'dark-v9' : 'light-v9';
      this.map.setStyle(`mapbox://styles/mapbox/${mapStyle}`);
      this.map.on('style.load', () => {
        this.updateLayer();
      });
    }
    if (prevProps.latestEvent !== this.props.latestEvent && this.mapLoaded) {
      if (this.props.latestEvent?.type === 'ZOOM_IN') {
        this.map.zoomIn();
      } else if (this.props.latestEvent?.type === 'ZOOM_OUT') {
        this.map.zoomOut();
      }
    }
    if (prevProps.mapConfig !== this.props.mapConfig && this.mapLoaded) {
      // seems we do not need to remove the sources when we load the style this way
      // this.map.setStyle(this.getStyle());
      setTimeout(x => this.updateLayer(), 500);// apparently we risk adding the occurrence layer below the layers if we do not wait
    }

    // check filter changes using hash, and if any then refresh the geojson layer
    if (prevProps.filterHash !== this.props.filterHash && this.mapLoaded) {
      // this.updateLayer();
    }

    if (prevProps.geojsonData !== this.props.geojsonData && this.mapLoaded) {
      this.updateGeoJsonData();
    }
  }

  getStyle() {
    const basemapStyle = this.props.mapConfig?.basemapStyle || 'klokantech';
    const layerStyle = mapStyles[basemapStyle];
    return layerStyle || this.props.mapConfig?.basemapStyle;
  }

  updateLayer() {
    const layer = this.map.getLayer('clusters');
    if (layer) {
      this.map.removeLayer("clusters");
      this.addLayer();
    } else {
      this.addLayer();
    }
    // this.addLayer();
  }

  onPointClick(pointData) {
    // this.props.onPointClick(pointData);
  }

  updateGeoJsonData() {
    const map = this.map;
    const geojsonData = this.props.geojsonData;
    const source = map.getSource('markers');
    source.setData(geojsonData);
  }

  addLayer() {
    const map = this.map;
    const geojsonData = this.props.geojsonData;

    const layer = map.getLayer('clusters');
    if (layer) {
      map.removeLayer("clusters");
    }

    console.log('addLayer');


    const source = map.getSource('markers');
    if (!source) {
      map.addSource('markers', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        // data: 'http://localhost:4000/unstable-api/map-styles/3031/institutions.geojson?' + queryString.stringify(filter),
        data: geojsonData,
        cluster: true,
        clusterMaxZoom: 12, // Max zoom to cluster points on
        clusterRadius: 25 // Radius of each cluster when clustering points (defaults to 50)
      });
    }

    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'markers',
      filter: ['has', 'point_count'],
      paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          750,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          12, 5, // radius when point count is less than 100 
          14, 10, // 
          16
        ]
      }
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'markers',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    });

    console.log('addLayer unclustered-point')
    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'markers',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });

    if (!this.mapLoaded) {
      // remember map position
      map.on('zoomend', function () {
        const center = map.getCenter();
        sessionStorage.setItem('mapZoom', map.getZoom() + 1);
        sessionStorage.setItem('mapLng', center.lng);
        sessionStorage.setItem('mapLat', center.lat);
      });
      map.on('moveend', function () {
        const center = map.getCenter();
        sessionStorage.setItem('mapZoom', map.getZoom() + 1);
        sessionStorage.setItem('mapLng', center.lng);
        sessionStorage.setItem('mapLat', center.lat);
      });

      // inspect a cluster on click
      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        
        map.getSource('markers').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // https://github.com/mapbox/mapbox-gl-js/issues/10297
        // it isn't clear why, but features can be duplicated so we have to find the unique using the key. For tiled data it is because they can appear on multiple tiles, but even for geojson sources it appears to be the case
        const features = uniqBy(e.features, x => x.properties.key);
        const institutionContent = features.map(x => `<div id="${x.properties.key}" onClick="">${x.properties.name}</div>`).join(``);
        // new mapboxgl.Popup()
        //   .setLngLat(coordinates)
        //   .setHTML(
        //     `institutions: ${institutionContent}`
        //   )
        //   .addTo(map);
        this.props.onPointClick(features.map(x => x.properties));
      });

      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'default';
      });
      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
      });
    }
    this.mapLoaded = true;
  }

  render() {
    const { query, onMapClick, onPointClick, predicateHash, style, className, ...props } = this.props;
    return <div ref={this.myRef} {...{ style, className }} />
  }
}

export default (props) => {
  const theme = useContext(ThemeContext);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const [filter, setFilter] = useState({});
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    const { v1Filter, error } = filter2v1(currentFilterContext.filter, predicateConfig);
    const filter = { ...v1Filter, ...rootPredicate };
    setFilter(filter);
    const { promise, cancel } = axios.get('http://localhost:4000/unstable-api/map-styles/3031/institutions.geojson', { params: filter });
    promise.then(({ data }) => {
      setGeojsonData(data);
    });
    return cancel;
  }, [currentFilterContext.filterHash, rootPredicate]);

  return <Map geojsonData={geojsonData} filterHash={currentFilterContext.filterHash} {...props} theme={theme} style={{width: '100%', height: '100%'}}/>
}