import { jsx, css } from '@emotion/react';
import React from 'react';
import { Skeleton } from '../../components';
import { FormattedNumber as Number } from 'react-intl';

export function Card({ padded = true, ...props }) {
  return <div
    css={css`
      background: var(--paperBackground);
      ${padded ? paddedContent : null}
      border: 1px solid var(--paperBorderColor);
      border-radius: var(--borderRadiusPx);
      padding: 18px;
      display: block !important;
      overflow: hidden;
    `}
    {...props}>
  </div>
}

export function CardTitle({ padded = true, ...props }) {
  return <div
    css={css`
      margin-bottom: 1.2rem;
      font-weight: 500;
      line-height: 1.2;
      font-size: 1em;
    `}
    {...props}>
  </div>
}

export function Table({ padded = true, removeBorder, ...props }) {
  return <table
    css={css`
      width: 100%;
      margin-bottom: 1rem;
      border-collapse: separate;
      border-spacing: 0;
      /* tbody > tr {
        border-top: 1px solid #dee2e6;
      } */
      td {
        padding: 6px 12px;
        border-top: ${removeBorder ? 'none' : '1px solid #dee2e6'};
        
      }
      td:first-of-type {
        padding-inline-start: 0;
      }
      td:last-of-type {
        padding-inline-end: 0;
      }
    `}
    {...props}>
  </table>
}

const paddedContent = css`
  padding: 24px 48px;
`;

export function BarItem({ children, percent = 0, ...props }) {
  return <div css={css`position: relative;`}>
    <div css={css`
  position: absolute; 
  left: 0; 
  width: ${percent}%;
  height: 1.6em;
  border-radius: var(--borderRadiusPx);
  background: var(--primary);
  opacity: .2;
  `} {...props}></div>
    <div css={css`z-index: 1; margin-left: 6px;`}>{children}</div>
  </div>;
}

export function FormattedNumber(props) {
  if (typeof props?.value === 'undefined') return <Skeleton width="70px" />
  return <Number {...props} />
}