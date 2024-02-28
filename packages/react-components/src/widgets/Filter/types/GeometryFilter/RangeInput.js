
import { jsx, css } from '@emotion/react';
import React, { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from '../../../../components';
import { toast } from 'react-toast';
import { ApiContext } from '../../../../dataManagement/api';

export const RangeInput = ({ onApply, initialValue, ...props }) => {
  const [minLatitude, setMinLatitude] = useState(-50);
  const [maxLatitude, setMaxLatitude] = useState(50);
  const [minLongitude, setMinLongitude] = useState(-150);
  const [maxLongitude, setMaxLongitude] = useState(150);
  const apiClient = useContext(ApiContext);

  const handleAdd = () => {
    try {
      let N = Number.parseFloat(maxLatitude ?? 0);
      let S = Number.parseFloat(minLatitude ?? 0);
      let W = Number.parseFloat(minLongitude ?? 0);
      let E = Number.parseFloat(maxLongitude ?? 0);

      // cap north and south to 90 and -90
      if (N > 90) {
        N = 90;
      }
      if (S < -90) {
        S = -90;
      }
      if (W < -360) {
        W = -360;
      }
      if (E > 360) {
        E = 360;
      }


      // accept west values down to -359 and north up to 359, but the range can never be above 360
      if (Math.abs(E - W) >= 360) {
        W = -180;
        E = 180;
      }

      // require that North is larger than South and that East is larger than West
      if (N < S || E < W) {
        toast.error('Invalid range');
        return;
      }


      const wkt = 'POLYGON' + '((W S,E S,E N,W N,W S))'
        .replace(/N/g, +N.toFixed(3))
        .replace(/S/g, +S.toFixed(3))
        .replace(/W/g, +W.toFixed(3))
        .replace(/E/g, +E.toFixed(3));

      // update lat and lon values with new nsew values
      setMinLatitude(S);
      setMaxLatitude(N);
      setMinLongitude(W);
      setMaxLongitude(E);

      onApply({ wkt: [wkt] });
    } catch (e) {
      console.error(e);
      toast.error('Invalid range');
    }
  };

  // provide 2 rows. one with latitude from-to and one with longitude from-to. And then an add button
  return <div css={css`
    border: 1px solid #ccc;
  `}>
    <div>
      <label>
        <FormattedMessage id="latitude" defaultMessage="Latitude" />
      </label>
      <input type="number" value={minLatitude} onChange={event => setMinLatitude(event.target.value)} placeholder="-90" />
      <input type="number" value={maxLatitude} onChange={event => setMaxLatitude(event.target.value)} placeholder="90" />
    </div>
    <div>
      <label>
        <FormattedMessage id="longitude" defaultMessage="Longitude" />
      </label>
      <input type="number" value={minLongitude} onChange={event => setMinLongitude(event.target.value)} placeholder="-180" />
      <input type="number" value={maxLongitude} onChange={event => setMaxLongitude(event.target.value)} placeholder="180" />
    </div>
    <Button onClick={handleAdd}>
      <FormattedMessage id="add" defaultMessage="Add" />
    </Button>

  </div>
};

RangeInput.propTypes = {
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
