
import { jsx, css } from '@emotion/react';
import React, { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonGroup } from '../../../../components';
import { WKT, GeoJSON } from 'ol/format';
import turfSimplify from '@turf/simplify';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfBbox from '@turf/bbox';
import turfKinks from '@turf/kinks';
import { toast } from 'react-toast';
import parseGeometry from 'wellknown';
import { ApiContext } from '../../../../dataManagement/api';

const wktSizeLimit = 5000;
const wktFormat = new WKT();
const geojsonFormat = new GeoJSON();

export const GeometryInput = ({ onApply, initialValue, ...props }) => {
  const [inputValue, setValue] = useState(initialValue || '');
  const [offerSimplification, setSimplificationOffer] = useState(false);
  const apiClient = useContext(ApiContext);

  // if initialValue changes, then update inputValue. This could be useful if we allow the user to edit an existing geoemtry as text
  useEffect(() => {
    setValue(JSON.stringify(exampleGeojson));
  }, [initialValue]);

  const checkWktAgainstAPI = async (wkt) => {
    const response = await apiClient
      .v1Get(`/occurrence/search`, { params: { hasCoordinate: false, geometry: wkt } }).promise;
    return response.data;
  };

  const handleAdd = (value) => {
    if (value === '') {
      return;
    }
    // check if it is a wkt or a geojson. If neither tell the user that it is invalid
    const result = parseStringToWKTs(value);

    if (result.error) {
      if (result.error === 'NOT_VALID_WKT') {
        toast.error('Invalid WKT geometry');
      } else if (result.error === 'FAILED_PARSING') {
        toast.error('Failed to parse geometry');
      }
      return;
    }

    if (result.selfIntersecting) {
      toast.error('Self intersecting geometry');
      return;
    }

    if (result.isSimplified) {
      toast.warn('Geometry was simplified');
    }

    if (result.orderChanged) {
      toast.warn('The ordering of the coordinates was reversed as it was not counter clockwise');
    }

    if (JSON.stringify(result?.geometry).length > wktSizeLimit) {
      toast.error('Geometry is too large');
      if (result?.geometry?.length === 1) {
        setSimplificationOffer(true);
      }
      return;
    }

    // check each geometry against the API
    // if any fail, then tell the user and offer to remove the invalid geometries
    // if all pass, then add the geometries to the list of geometries
    if (result.geometry.length > 0) {
      const promises = result.geometry.map(wkt => checkWktAgainstAPI(wkt));
      Promise.all(promises)
        .then(res => {
          onApply({ wkt: result.geometry });
          setValue('');
        })
        .catch(err => {
          toast.error(err?.response?.data?.toString());
        });
    }
  };

  const bbox = () => {
    const wkt = useBBox(inputValue);
    toast.info('Geometry was reduced to its bounding box');
    setValue(wkt);
  }

  const simplify = () => {
    const wkt = useSimplified(inputValue);
    if (wkt) {
      toast.info('Geometry was simplified');
      setValue(wkt);
    } else {
      toast.error('Failed to simplify geometry');
    }
  }

  return <div css={css`
    border: 1px solid #ccc;
  `}>
    <textarea
      css={css`
      font-size: 13px;
      resize: none;
      width: 100%;
      height: 156px;
      border: none;
      background: 0 0;
      padding: 6px;
    `}
      value={inputValue}
      onChange={e => {
        setValue(e.target.value);
        setSimplificationOffer(false);
      }}
    />
    <div css={css`
    display: flex;
    justify-content: flex-end;
    padding: 6px;
    font-size: 0.85em;
  `}>
      {offerSimplification && <Button look="primaryOutline" onClick={_ => simplify(inputValue)} css={css`margin-inline-end: 6px;`}>Simplify</Button>}
      {offerSimplification && <Button look="primaryOutline" onClick={_ => bbox(inputValue)}>Use bounding box</Button>}
      {!offerSimplification && <Button look="primaryOutline" onClick={_ => handleAdd(inputValue)}>Add</Button>}
    </div>
  </div>
};

GeometryInput.propTypes = {
  onApply: PropTypes.func,
  initialValue: PropTypes.string,
};

export const inputStyle = css`
  margin: 10px;
  z-index: 10;
  display: inline-block;
  position: relative;
  & + div {
    margin-top: 0;
    >div {
      margin-top: 0;
    }
  }
`;

function parseStringToWKTs(str) {
  let i, geojson, feature, isSimplified, selfIntersecting, orderChanged, wktGeom, wktGeometries = [];
  // assume geojson
  try {
    let geojsonGeometry = JSON.parse(str);
    geojson = geojsonFormat.readFeatures(geojsonGeometry);
    for (i = 0; i < geojson.length; i++) {
      feature = geojson[i].getGeometry();
      wktGeom = wktFormat.writeGeometry(feature);
      wktGeom = getRightHandCorrectedWKT(wktGeom, true);
      let parsedWkt = getAsValidWKT(wktGeom);
      if (!parsedWkt.failed) {
        isSimplified = parsedWkt.isSimplified;
        orderChanged = parsedWkt.orderChanged;
        wktGeometries.push(parsedWkt.wkt);
      } else {
        return {
          error: 'NOT_VALID_WKT'
        };
      }
    }
  } catch (e) {
    // not a json object. try to parse as wkt
    try {
      let parsedWkt = getAsValidWKT(str);
      if (!parsedWkt.failed) {
        isSimplified = parsedWkt.isSimplified;
        orderChanged = parsedWkt.orderChanged;
        selfIntersecting = parsedWkt.selfIntersecting,
          wktGeometries.push(parsedWkt.wkt);
      } else {
        return {
          error: 'NOT_VALID_WKT'
        };
      }
    } catch (err) {
      return {
        error: 'FAILED_PARSING'
      };
    }
  }
  return {
    geometry: wktGeometries,
    isSimplified: isSimplified,
    orderChanged: orderChanged,
    selfIntersecting: selfIntersecting
  };
}


function testWktForIntersections(str) {
  try {
    // check for kinks, if not empty then throw error
    let feature = wktFormat.readFeature(str);
    let testGeoJSon = geojsonFormat.writeFeature(feature, { rightHanded: true });
    let kinks = turfKinks(JSON.parse(testGeoJSon));
    if (kinks.features.length > 0) {
      return {
        selfIntersecting: true
      };
    }
  } catch (err) {
    debugger;
    return {
      error: 'FAILED_PARSING',
    };
  }
  return {
    selfIntersecting: false
  };
}

function getAsValidWKT(testWkt) {
  try {
    const simplifiedWkt = formatWkt(testWkt);
    const counterClockwiseWkt = getRightHandCorrectedWKT(simplifiedWkt);
    const intersectionTest = testWktForIntersections(counterClockwiseWkt);
    // if starting with GEOMETRYCOLLECTION then fail
    if (counterClockwiseWkt.indexOf('GEOMETRYCOLLECTION') === 0) {
      // if (toastService) {
      //     toastService.warning({translate: 'occurrenceSearch.geometryCollectionNotSupported'});
      // }
      return { failed: true };
    }
    return {
      failed: false,
      isSimplified: simplifiedWkt !== testWkt,
      orderChanged: counterClockwiseWkt !== simplifiedWkt,
      selfIntersecting: intersectionTest.selfIntersecting,
      wkt: counterClockwiseWkt,
    };
  } catch (err) {
    return { failed: true };
  }
}

function isValidWKT(testWKT) {
  try {
    testWKT = formatWkt(testWKT);
    let newWkt = getRightHandCorrectedWKT(testWKT);
    return testWKT === newWkt;
  } catch (err) {
    return false;
  }
}

function formatWkt(wktStr) {
  let f = wktFormat.readFeature(wktStr);
  return wktFormat.writeFeature(f, { decimals: 5 });
}

function getRightHandCorrectedWKT(wktStr) {
  let f = wktFormat.readFeature(wktStr);
  let asGeoJson = geojsonFormat.writeFeature(f, { rightHanded: true });
  let rightHandCorrectedFeature = geojsonFormat.readFeature(asGeoJson);
  let newWkt = wktFormat.writeFeature(rightHandCorrectedFeature, {
    rightHanded: true,
    decimals: 5
  });
  return newWkt;
}

function useSimplified(geometryString, tolerance) {
  tolerance = tolerance || 0.001;
  var parsingResult = parseStringToWKTs(geometryString);
  if (parsingResult.error) {
    return;
  }
  var geojson = parseGeometry(parsingResult.geometry[0]);
  var options = { tolerance: tolerance, highQuality: true };
  var simplified = turfSimplify(geojson, options);
  var wkt = parseGeometry.stringify(simplified);

  // test that wkt is not self intersecting. If so add a toast warning, but still use the simplified geometry
  var intersectionTest = testWktForIntersections(wkt);
  if (intersectionTest.selfIntersecting) {
    // toastService.warning({translate: 'occurrenceSearch.simplificationCausedSelfIntersection'});
  }
  if (wkt.length > wktSizeLimit && tolerance <= 10) {
    return useSimplified(wkt, tolerance * 4);
  } else {
    return wkt;
    // toastService.info({translate: 'occurrenceSearch.polygonSimplifiedToFewerPoints'});
  }
};

function useBBox(str) {
  var parsingResult = parseStringToWKTs(str);
  var geom = parseGeometry(parsingResult.geometry[0]);
  var bbox = turfBbox(geom);
  var bboxPolygon = turfBboxPolygon(bbox);
  var wkt = parseGeometry.stringify(bboxPolygon);
  return wkt;
};

const exampleGeojson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              11.983220547726518,
              56.982198626840045
            ],
            [
              4.904981655508237,
              51.624842726001305
            ],
            [
              17.879151214288527,
              49.326293052019565
            ],
            [
              11.983220547726518,
              56.982198626840045
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
};