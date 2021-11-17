import React from 'react';
import { Toast, ToastFactory } from '../../index';

import Button from '@douyinfe/semi-ui/button/index';

export default {
  title: 'Toast',
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

const ToastInContainer = ToastFactory.create({
  getPopupContainer: () => document.getElementById('popup-container'),
});


function getContent() {
  let n = Math.random() * 10;
  return Array.from({ length: n }, (v, i) => 'dance').join(' ');
}

let opts = {
  title: 'Title ies',
  content: 'Hi,Bytedance dance dance',
  duration: 3000,
};

let multiOpts = Object.assign({}, opts, {
  content: 'Hi,Bytedance dance dance, dance dance,dance dance,dance dance',
});

export const _Toast = () => (
  <>
    <div style={{ margin: '10px' }}>
      <Button type="primary" onClick={() => Toast.create({ ...opts })}>
        default
      </Button>
    </div>
    <div style={{ margin: '10px' }}>
      <Button type="warning" onClick={() => Toast.warning({ ...opts })}>
        warning
      </Button>
    </div>
    <div style={{ margin: '10px' }}>
      <Button type="warning" onClick={() => Toast.success('here')}>
        success
      </Button>
    </div>
    <div style={{ margin: '10px' }}>
      <Button type="warning" onClick={() => Toast.error({ ...opts })}>
        error
      </Button>
    </div>
    <div style={{ margin: '10px' }}>
      <Button type="default" onClick={() => Toast.info({ ...opts, duration: 0 })}>
        not auto close
      </Button>
    </div>
    <div style={{ margin: '10px' }}>
      <Button type="default" onClick={() => Toast.destroyAll()}>
        destroyAll
      </Button>
    </div>
    <div style={{ margin: '10px' }}>
      <Button type="default" onClick={() => Toast.info({ ...multiOpts, duration: 0 })}>
        not auto close with muti-line content
      </Button>
    </div>
    <div style={{ margin: '10px' }}>
      <Button
        type="danger"
        onClick={() => {
          Toast.error({ ...opts, content: 'i am content' });
        }}
      >
        After 3s
      </Button>
    </div>
    <div style={{ width: '300px', height: '300px', background: '#cccccc' }} id="popup-container">
      popup-container
    </div>
    <div>
      <Button
        type="primary"
        onClick={() => {
          ToastInContainer.info({ content: 'Toast in popup-container' });
        }}
      >
        Toast in popup-container
      </Button>
    </div>
  </>
);

_Toast.story = {
  name: 'toast',
};
