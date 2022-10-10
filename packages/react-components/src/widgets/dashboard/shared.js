import { jsx, css } from '@emotion/react';
import React from 'react';

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

export function Table({ padded = true, ...props }) {
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
        border-top: 1px solid #dee2e6;
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