import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { ZoomableImage } from './ZoomableImage';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/ZoomableImage',
  component: ZoomableImage,
};

export const Example = () => <>
  <ZoomableImage 
    src="https://static.inaturalist.org/photos/48537908/original.jpeg?1566109574" 
    thumbnail="https://api.gbif.org/v1/image/unsafe/https%3A%2F%2Fstatic.inaturalist.org%2Fphotos%2F48537908%2Foriginal.jpeg%3F1566109574">
    ZoomableImage - not implemented yet. But we need one. We miss it on the current portal
  </ZoomableImage>
  {/* <StyledProse source={readme}></StyledProse> */}
</>;

Example.story = {
  name: 'ZoomableImage',
};


// // OPTIONS
// const options = {
//   primary: 'primary',
//   primaryOutline: 'primaryOutline',
//   outline: 'outline',
//   danger: 'danger',
// };
// type={select('Type', options, options.primary)}

// // BOOLEAN
// boolean("loading", false)

// // TEXT
// {text('Text', 'ZoomableImage text')}