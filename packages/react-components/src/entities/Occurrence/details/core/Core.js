
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../../styles';
import * as sharedCss from '../../../shared/styles';
import { Row, Col, Switch, Tag } from "../../../../components";
import { Groups } from '../Groups';

export function Core({
  data = {},
  termMap,
  isSpecimen,
  loading,
  fieldGroups,
  setActiveImage,
  error,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [showAll, setShowAll] = useState(false);

  const { occurrence } = data;
  if (loading || !occurrence) return <h2>Loading</h2>;//TODO replace with proper skeleton loader

  return <Row direction="row" wrap="nowrap" style={{ maxHeight: '100%' }}>
    <div css={sharedCss.sideNavWrapper()}>
      {occurrence?.coordinates && <img
        style={{ display: "block", maxWidth: "100%", marginBottom: 12 }}
        src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},11,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
      />}
      <nav css={sharedCss.sideNav()}>
        <ul>
          <Li>Summary</Li>
          <li style={{borderBottom: '1px solid #eee'}}></li>
          <Li>Record</Li>
          <Li>Taxon</Li>
          <Li>Location</Li>
          <Li>Occurrence</Li>
          <Li>Event</Li>
          <Li>Identification</Li>
          <Li>Other</Li>
          <li style={{borderBottom: '1px solid #eee'}}></li>
          <Li style={{color: '#888', fontSize: '85%'}}>Extensions</Li>
          <Li>Identification</Li>
          <Li>Gel Image</Li>
          <Li>Loan <Tag type="light">3</Tag></Li>
          <li style={{borderBottom: '1px solid #eee'}}></li>
          <Li>Citation</Li>
        </ul>
      </nav>
    </div>
    <div>
      <Groups termMap={termMap} occurrence={occurrence} showAll={showAll} setActiveImage={setActiveImage} />
    </div>
  </Row>
};

function Li(props) {
  return <li css={sharedCss.sideNnvItem()} {...props} />
}