
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../../styles';
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

  return <Row direction="column" wrap="nowrap" style={{ maxHeight: '100%', overflow: 'hidden' }}>
    <Groups occurrence={occurrence} showAll={showAll} setActiveImage={setActiveImage} />
  </Row>
};