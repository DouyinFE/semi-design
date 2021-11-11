import React from 'react';
import { storiesOf } from '@storybook/react'; // import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import Others from './Others';
import { IconHome, IconLock, IconClear, IconTickCircle, IconTick, IconClose, IconCaretup } from '@douyinfe/semi-icons';
const stories = storiesOf('Icon', module); // stories.addDecorator(withKnobs);;

stories.add('Icon', () => (
    <div>
        <div>
            <IconHome size="large" />
            <IconLock size="small" />
            <IconLock />
            <IconClear />
            <IconTickCircle />
            <IconTick />
            <IconClose />
            <IconCaretup />
        </div>
        <div
            style={{
                color: 'red',
            }}
        >
            <IconHome size="large" />
            <IconLock size="small" />
            <IconLock />
            <IconClear />
            <IconTickCircle />
            <IconTick />
            <IconClose />
            <IconCaretup />
        </div>
        <div
            style={{
                color: 'pink',
            }}
        >
            <IconHome size="large" />
            <IconLock size="small" />
            <IconLock />
            <IconClear />
            <IconTickCircle />
            <IconTick />
            <IconClose />
            <IconCaretup />
        </div>
    </div>
));
stories.add('others', () => (
    <div>
        <Others />
    </div>
));
