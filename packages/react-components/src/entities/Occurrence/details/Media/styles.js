import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const mediaList = css`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -6px;
  >li {
    display: block;
    flex: 0 1 calc(50%);
    padding: 12px 6px;
  }
`;

export const mediaArea = ({ ...props }) => css`
  border-bottom: 1px solid #ddd;
  > div, a {
    margin-top: 8px;
    color: inherit;
    text-decoration: none;
    text-align: center;
  }
  audio, video {
    width: 100%;
  }
`;

export const downloadMedia = ({ ...props }) => css`
  text-align: center;
  display: block;
  width: 300px;
  margin: auto;
  background: #ebebeb;
  border-radius: 4px;
  padding: 12px;
  .gb-download-icon {
    font-size: 30px;
  }
`;

export const mediaCard = ({ ...props }) => css`
  background: white;
  img {
    width: 100%;
  }
  figure {
    margin: 0;
    padding: 0;
  }
  >div {
    padding: 12px;
  }
  figcaption {
    padding: 12px;
  }
`;

