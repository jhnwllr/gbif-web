import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const headerWrapper = ({ ...props }) => css`
  background: white;
  padding: 1rem 1rem 0 1rem;
  h1 {
    margin-top: 0.25rem;
    margin-bottom: .25em;
    font-size: 1.75rem;
    font-weight: 700;
  }
  a {
    color: #1393D8;
  }
`;

export const proseWrapper = ({ ...props }) => css`
  margin: 0 auto;
  width: 1000px;
  max-width: 100%;
`;

export const tab = ({ noData, ...props }) => css`
  color: ${noData ? '#888' : null}
`;
