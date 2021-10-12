
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../../styles';
import * as sharedCss from '../../../shared/styles';
import { Row, Col, Switch, Tag } from "../../../../components";
import { Groups } from '../Groups';
import { HashLink } from "react-router-hash-link";

export function Core({
  data = {},
  termMap,
  isSpecimen,
  loading,
  fieldGroups,
  setActiveImage,
  error,
  className,
  stickyOffset,
  ...props
}) {
  const theme = useContext(ThemeContext);

  const { occurrence } = data;
  if (loading || !occurrence) return <h2>Loading</h2>;//TODO replace with proper skeleton loader

  return <Row direction="row" wrap="nowrap" style={{ maxHeight: '100%', paddingBottom: 24 }}>
    <div css={sharedCss.sideNavWrapper({offset: stickyOffset})}>
      {occurrence?.coordinates && <div css={css.mapThumb()}>
        <img
          src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},6,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
        />
        {/* <img
          style={{ display: "block", maxWidth: "100%", marginBottom: 12, position: 'absolute', top: 0 }}
          src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},9,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
        /> */}
        <img className="gb-on-hover"
          src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},12,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
        />
        <HashLink to="#location" replace></HashLink>
      </div>}
      <nav css={sharedCss.sideNav()}>
        <ul>
          <Li to="#summary">Summary</Li>
          <Separator />
          <Li to="#record">Record</Li>
          <Li to="#taxon">Taxon</Li>
          <Li to="#location">Location</Li>
          <Li to="#occurrence">Occurrence</Li>
          <Li to="#event">Event</Li>
          <Li to="#identification">Identification</Li>
          <Li to="#other">Other</Li>
          <Separator />
          <Li style={{ color: '#888', fontSize: '85%' }}>Extensions</Li>
          <Li to="#identification">Identification</Li>
          <Li to="#gel-image">Gel Image</Li>
          <Li to="#loan">Loan <Tag type="light">3</Tag></Li>
          <li style={{ borderBottom: '1px solid #eee' }}></li>
          <Li to="#citation">Citation</Li>
        </ul>
      </nav>
    </div>
    <div>
      <Sequence sequence={occurrence?.extensions?.['http://rs.gbif.org/terms/1.0/DNADerivedData']?.[0]?.['http://rs.gbif.org/terms/dna_sequence']} />
      <Groups termMap={termMap} occurrence={occurrence} setActiveImage={setActiveImage} />
    </div>
  </Row>
};

function Li({to, children, ...props}) {
  if (to) {
    return <li css={sharedCss.sideNavItem()} {...props}>
      <HashLink to={to} replace>{children}</HashLink>
    </li>
  }
  return <li css={sharedCss.sideNavItem()} {...props} children={children} />
}

function Separator(props) {
  return <li style={{ borderBottom: '1px solid #eee' }}></li>
}

function Sequence({sequence, ...props}) {
  if (!sequence) return null;
  const parts = sequence.split('');
  return <div style={{display: 'flex'}}>
    {parts.map(x => {
      <div style={{flex: '0 0 10px', background: 'tomato', margin: 1}}>&nbsp;</div>
    })}
  </div>
}