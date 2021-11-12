import React from 'react';

import Others from './Others';
import {
  IconHome,
  IconLock,
  IconClear,
  IconTickCircle,
  IconTick,
  IconClose,
  IconCaretup,
} from '@douyinfe/semi-icons';

export default {
  title: 'Icon'
}

export {
  Others
}

export const IconDemo = () => (
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
);