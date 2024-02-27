
import { jsx, css } from '@emotion/react';
import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { keyCodes } from '../../../../utils/util';
import { Button, ButtonGroup, Checkbox } from '../../../../components';
import { WKT, GeoJSON } from 'ol/format';
import turfSimplify from '@turf/simplify';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfBbox from '@turf/bbox';
import turfKinks from '@turf/kinks';

const wktFormat = new WKT();
const geojsonFormat = new GeoJSON();

export const GeometryInput = ({ onApply, initialValue, ...props }) => {
  const [inputValue, setValue] = useState(initialValue || '');

  // if initialValue changes, then update inputValue. This could be useful if we allow the user to edit an existing geoemtry as text
  useEffect(() => {
    setValue(JSON.stringify(exampleGeojson));
  }, [initialValue]);

  const handleAdd = (value) => {
    // check if it is a wkt or a geojson. If neither tell the user that it is invalid
    const result = parseStringToWKTs(value);
    console.log('result', result);
    debugger;
    // If GeoJSON, then convert to wkt
    // validate that it is a valid WKT geometry, if not tell the user
    // secondly check that it is winded the correct way (counter clockwise for polygons) - if not tell the user and offer to reverse it
    // check size of geometry, if too large, tell the user and offer to simplify it
    // if above checks pass, then add the geometry to the list of geometries
    onApply({ wkt: result.geometry });
  };

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
      onChange={e => setValue(e.target.value)}
    // onChange={e => {
    //   const value = e.target.value;
    //   if (pattern) {
    //     if (value.match(pattern) !== null) {
    //       setValue(value);
    //     }
    //   } else {
    //     setValue(value);
    //   }
    // }}
    // placeholder={formattedPlaceholder}
    // onKeyPress={e => {
    //   const value = e.target.value;
    //   if (e.which === keyCodes.ENTER) {
    //     if (value === '') {
    //       onApply({ filter, hide });
    //     } else if (singleSelect) {
    //       setOptions([value]);
    //       const params = isNegated ? [filterHandle, [], [value]] : [filterHandle, [value], []];
    //       setFullField(...params)
    //         .then(responseFilter => onApply({ filter: responseFilter, hide }))
    //         .catch(err => console.log(err));
    //     } else {
    //       setValue('');
    //       const allOptions = [...new Set([value, ...options])]
    //       setOptions(allOptions);
    //       toggle(filterHandle, value, !isNegated);
    //     }
    //   }
    // }}
    />
    <div css={css`
    display: flex;
    justify-content: flex-end;
    padding: 6px;
    font-size: 0.85em;
  `}>
      <Button look="primaryOutline" onClick={_ => handleAdd(inputValue)}>Add</Button>
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
      let testGeoJSon = geojsonFormat.writeFeature(feature, {rightHanded: true});
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
          return {failed: true};
      }
      return {
          failed: false,
          isSimplified: simplifiedWkt !== testWkt,
          orderChanged: counterClockwiseWkt !== simplifiedWkt,
          selfIntersecting: intersectionTest.selfIntersecting,
          wkt: counterClockwiseWkt,
      };
  } catch (err) {
      return {failed: true};
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
  return wktFormat.writeFeature(f, {decimals: 5});
}

function getRightHandCorrectedWKT(wktStr) {
  let f = wktFormat.readFeature(wktStr);
  let asGeoJson = geojsonFormat.writeFeature(f, {rightHanded: true});
  let rightHandCorrectedFeature = geojsonFormat.readFeature(asGeoJson);
  let newWkt = wktFormat.writeFeature(rightHandCorrectedFeature, {
      rightHanded: true, 
      decimals: 5
  });
  return newWkt;
}


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