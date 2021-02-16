/** @jsx jsx */
import { jsx } from "@emotion/core";
// import ThemeContext from "../../../../style/themes/ThemeContext";

import PropTypes from "prop-types";

// import * as css from './styles';

export function Map({ as: Div = "div", longitude, latitude, ...props }) {


  return (
     <div style={{ maxWidth: "100%", position: "relative" }}>
        <img
          style={{ display: "block", maxWidth: "100%" }}
          src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${longitude},${latitude})/${longitude},${latitude},13,0/600x300@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
        />
        <img
          style={{
            border: "1px solid #aaa",
            width: "30%",
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
          src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+dedede(${longitude},${latitude})/${longitude},${latitude},4,0/200x100@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
        />
      </div>

  );
}

Map.propTypes = {
  as: PropTypes.element,
};
