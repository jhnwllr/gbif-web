
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import { root as rootStyle, appRoot as appRootStyle } from './styles';

export const Root = React.forwardRef(({
  as: Rt = 'div',
  appRoot = false,
  style,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  const { cssVariables = {} } = theme;
  return <Rt ref={ref} {...props} style={{...cssVariables, ...style}} css={appRoot ? appRootStyle : rootStyle} />
});

Root.displayName = 'Root';

Root.propTypes = {
  as: PropTypes.node
};
