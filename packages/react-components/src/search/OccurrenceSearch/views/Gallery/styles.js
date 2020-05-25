import { css } from '@emotion/core';


export const itemDetails = ({padding}) => css`
  padding: ${padding}px;
`;

export const speciesName = ({fontSize}) => css`
font-size: ${fontSize}px;
`;

export default {
    itemDetails: itemDetails,
    speciesName: speciesName
}