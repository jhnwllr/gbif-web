
import { jsx } from '@emotion/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../../styles';
import * as sharedCss from '../../../shared/styles';
import { Row, Col, Switch, Tag } from '../../../../components';
import { Groups } from '../Groups';
import { HashLink } from 'react-router-hash-link';

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
  const [showAll, setShowAll] = useState(false);
  const [toc, setToc] = useState({});

  useEffect(() => {
    setToc({});
  }, [data]);

  const addSection = useCallback((section) => {
    // console.log(toc);
    // if (!toc[section]) {
    //   const newToc = {...toc, [section]: true};
    //   debugger;
    //   setToc(newToc)
    // }
  }, []);

  const { occurrence } = data;
  if (loading || !occurrence) return <h2>Loading</h2>;//TODO replace with proper skeleton loader

  return <Row direction="row" wrap="nowrap" style={{ maxHeight: '100%', paddingBottom: 24 }}>
    <div css={sharedCss.sideNavWrapper({offset: stickyOffset})}>
      {occurrence?.coordinates && <div css={css.mapThumb()}>
        <img src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},5,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`} />
        {/* <img
          style={{ display: "block", maxWidth: "100%", marginBottom: 12, position: 'absolute', top: 0 }}
          src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},9,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
        /> */}
        <img className="gb-on-hover"
          src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},11,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
        />
        <HashLink to="#location" replace></HashLink>
      </div>}
      <nav css={sharedCss.sideNav()}>
        <ul>
          <Li to="#summary">Summary</Li>
          <Separator />
          <Li toc={toc} to="#record">Record</Li>
          <Li toc={toc} to="#taxon">Taxon</Li>
          <Li toc={toc} to="#location">Location</Li>
          <Li toc={toc} to="#occurrence">Occurrence</Li>
          <Li toc={toc} to="#event">Event</Li>
          <Li toc={toc} to="#identification">Identification</Li>
          <Li toc={toc} to="#other">Other</Li>
          <Separator />
          <Li style={{ color: '#888', fontSize: '85%' }}>Extensions</Li>
          <Li toc={toc} to="#identification">Identification</Li>
          <Li toc={toc} to="#gel-image">Gel Image</Li>
          <Li toc={toc} to="#loan">Loan <Tag type="light">3</Tag></Li>
          <li style={{ borderBottom: '1px solid #eee' }}></li>
          <Li to="#citation">Citation</Li>
        </ul>
        {/* <div onClick={() => setShowAll(!showAll)}>Toggle debug view</div> */}
      </nav>
    </div>
    <div>
      <Groups updateToc={addSection} termMap={termMap} showAll={showAll} occurrence={occurrence} setActiveImage={setActiveImage} />
    </div>
  </Row>
};

function Li({to, toc, children, ...props}) {
  if (to) {
    // if (toc && !toc[to.substr(1)]) {
    //   return null;
    // }
    return <li css={sharedCss.sideNavItem()} {...props}>
      <HashLink to={to} replace>{children}</HashLink>
    </li>
  }
  return <li css={sharedCss.sideNavItem()} {...props} children={children} />
}

function Separator(props) {
  return <li style={{ borderBottom: '1px solid #eee' }}></li>
}