import React from 'react';
import { text } from '@storybook/addon-knobs';
import { Occurrence } from './Occurrence';
import { MemoryRouter as Router } from "react-router-dom";
import Standalone from './Standalone';
import readme from './README.md';
import { StyledProse } from '../../components/typography/StyledProse';
import AddressBar from "../../StorybookAddressBar"

export default {
  title: 'Entities/Occurrence',
  component: Occurrence,
};

export const Example = () => <Router initialEntries={[`/`]}>
  <AddressBar />
  {/* <Occurrence id={930742715} style={{width: 700, height: 600, flex: '0 0 auto'}} /> */}
  {/* <Occurrence id={1830738777} style={{maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto'}} /> */}
  {/* <Occurrence id={2304128798} style={{maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto'}} /> */}
  {/* <Occurrence id={1989361400} style={{maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto'}} /> */}
  {/* <Occurrence id={text('id', '1702253346')} style={{maxWidth: '100%', width: 700, height: 'calc(100vh - 20px)', flex: '0 0 auto'}} /> */}
  {/* <Occurrence id={text('id', '2565007305')} /> */}
  {/* <Occurrence id={text('id', '3095291314')} /> */}
  
  {/* type images */}
  {/* <Occurrence id={text('id', '2563424903')} /> */}

  {/* audio */}
  {/* <Occurrence id={text('id', '3015568527')} /> */}
  
  {/* movie */}
  {/* <Occurrence id={text('id', '3004320174')} /> */}

  {/* taonMatch higher rank */}
  {/* <Occurrence id={text('id', '1632784175')} /> */}

  {/* DNA derived */}
  {/* <Occurrence id={text('id', '2250301288')} /> */}

  {/* amplification with sequence 2238150290 2633841312 1208901618 1563183804 1949672676 2633254982 2238434252 2979629271 */}
  <Occurrence id={text('id', '2633841312')} />

  {/* 2633841312 sequences, clustered, imaged, coordinates*/}
</Router>;

Example.story = {
  name: 'Occurrence',
};

export const StandaloneExample = () => <Standalone id="2563424903"></Standalone>;

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
// {text('Text', 'OccurrenceDrawer text')}