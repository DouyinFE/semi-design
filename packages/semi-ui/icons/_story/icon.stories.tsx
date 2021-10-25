import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { IconHome, IconLock, IconClear, IconTickCircle, IconTick, IconClose, IconCaretUp } from '@douyinfe/semi-icons';
const stories = storiesOf('Icon', module);
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
            <IconCaretUp />
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
            <IconCaretUp />
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
            <IconCaretUp />
        </div>
    </div>
));
