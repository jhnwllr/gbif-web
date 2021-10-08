import { jsx } from '@emotion/react';
// import ThemeContext from '../../style/themes/ThemeContext';
import React from 'react';
import PropTypes from 'prop-types';

export function HostnameLink({
  href,
  ...props
}) {
  try {
    const hostname = new URL(href).hostname;
    return <a href={href} {...props}>{hostname}</a>;
  } catch (err) {
    return <span {...props}>{href}</span>;
  }
};

HostnameLink.propTypes = {
  href: PropTypes.string.isRequired
};
