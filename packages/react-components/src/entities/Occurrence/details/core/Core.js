
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../../styles';
import * as sharedCss from '../../../shared/styles';
import { Row, Col, Switch } from "../../../../components";
import { Groups } from '../Groups';

export function Core({
  data = {},
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
          <Li>Citation</Li>
        </ul>
      </nav>
    </div>
    <div>
      <Groups occurrence={occurrence} showAll={showAll} setActiveImage={setActiveImage} />
    </div>
  </Row>
};

function Li(props) {
  return <li css={sharedCss.sideNnvItem()} {...props} />
}