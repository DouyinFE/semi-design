import React from 'react';
import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import withPropsCombinations from 'react-storybook-addon-props-combinations';

import Portal from '../index';

const stories = storiesOf('Portal', module);

// stories.addDecorator(withKnobs);;

stories.add('Portal', () => (
    <div>
        <Portal>
            123
        </Portal>
  </div>
));
