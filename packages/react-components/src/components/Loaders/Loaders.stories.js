import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { StripeLoader, EllipsisLoader } from './index';

export default {
  title: 'Components/StripeLoader',
  component: StripeLoader,
};

export const Example = () => <div style={{padding: 20, background: 'white'}}>
  <StripeLoader active={boolean("active", true)} error={boolean("error", false)}/>
</div>

Example.story = {
  name: 'StripeLoader',
};

export const Example2 = () => <div style={{padding: 20, background: 'white'}}>
  <EllipsisLoader active={boolean("active", true)} error={boolean("error", false)}/>
</div>

Example2.story = {
  name: 'EllipsisLoader',
};
