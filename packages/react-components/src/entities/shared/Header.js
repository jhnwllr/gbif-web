
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';

export function Header(props) {
  const theme = useContext(ThemeContext);

  return <div css={css.headerWrapper({ theme })}>
    <div css={css.proseWrapper({ theme })} {...props} />
  </div>
};
