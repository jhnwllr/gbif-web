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
  color: ${noData ? '#888' : null};
`;

export const sideNavWrapper = ({ ...props }) => css`
  flex: 0 0 250px;
  padding-top: 12px;
  margin: 0;
  margin-right: 12px;
  font-size: 14px;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100%;
`;

export const sideNav = ({ ...props }) => css`
  background: white;
  margin-bottom: 12px;
  border-radius: 4px;
  overflow: hidden;
  padding: 4px;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

export const sideNnvItem = ({ ...props }) => css`
  padding: 8px 12px;
  line-height: 1em;
  display: block;
  color: inherit;
  width: 100%;
  text-align: left;
  text-decoration: none;
  &.isActive {
    background: #e0e7ee;
    font-weight: 500;
  }
`;