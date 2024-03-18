import { WKT, GeoJSON } from 'ol/format';

var wktFormatter = new WKT();
var geoJsonFormatter = new GeoJSON();

/**
 * Takes an openlayes feature and transforms it to a WKT string
 * @param {*} feature 
 * @returns 
 */
export function getFeatureAsWKT(feature, projection) {
  const asGeoJson = geoJsonFormatter.writeFeature(feature, { rightHanded: true });
  const rightHandCorrectedFeature = geoJsonFormatter.readFeature(asGeoJson);
  const wkt = wktFormatter.writeFeature(rightHandCorrectedFeature, {
    dataProjection: projection, // input projection. If not provided it will try to guess https://openlayers.org/en/latest/apidoc/module-ol_format_WKT-WKT.html
    featureProjection: 'EPSG:4326', // output projection
    rightHanded: true,
    decimals: 5
  });
  return wkt;
}
