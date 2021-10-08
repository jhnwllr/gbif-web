import React from 'react';
import { text } from '@storybook/addon-knobs';
import { HostnameLink } from './HostnameLink';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';

export default {
  title: 'Components/HostnameLink',
  component: HostnameLink,
};

export const Example = () => <DocsWrapper>
  <HostnameLink href={text('href', 'https://www.somesite.com/obscure/url/_trshgdfsdf/images/5?id=187934659r8twuyighsdglfsdfg7y&type=jpg')} />
  <StyledProse source={readme}></StyledProse>
</DocsWrapper>;

Example.story = {
  name: 'HostnameLink',
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
// {text('Text', 'HostnameLink text')}