import React, { createRef, useState } from 'react';
import { Resizable } from '../../index';
import { Toast, Button } from '@douyinfe/semi-ui'
export default {
  title: 'Resizable'
}

import { ResizeItem, ResizeHandler, ResizeGroup } from '../../index'

export const Group_test = () => {
  const [text, setText] = useState('test')
  const opts_1 = {
    content: 'resize start',
    duration: 1,
    stack: true,
  };
  const opts = {
    content: 'resize end',
    duration: 1,
    stack: true,
  };
  let dir = 'bottom'
  let leftRef = createRef(), rightRef = createRef(), handlerRef = createRef()
  const func = (e) => {
    leftRef.current.foundation.onResizeStart(e, dir)
    rightRef.current.foundation.onResizeStart(e, 'top')
  }
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <ResizeGroup>
        <ResizeItem
          ref={leftRef}
          style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
          defaultSize={{
            width: '60%',
            height: 300,
          }}
          onChange={() => { setText('resizing') }}
          onResizeStart={() => Toast.info(opts_1)}
          onResizeEnd={() => { Toast.info(opts); setText('test') }}
        >
          <div style={{ marginLeft: '20%' }}>
            {text}
          </div>
        </ResizeItem>
        <ResizeHandler
          ref={handlerRef}
          key={dir}
          direction={dir}
          onResizeStart={
            func
          }
        >
        </ResizeHandler>
        <ResizeItem
          ref={rightRef}
          style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
          defaultSize={{
            width: '60%',
            height: 300,
          }}
          onChange={() => { setText('resizing') }}
        >
          <div style={{ marginLeft: '20%' }}>
            {text}
          </div>
        </ResizeItem>
      </ResizeGroup>
    </div>
  );
}



export const Single_defaultSize = () => {
  const [text, setText] = useState('test')
  const opts_1 = {
    content: 'resize start',
    duration: 1,
    stack: true,
  };
  const opts = {
    content: 'resize end',
    duration: 1,
    stack: true,
  };
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
        defaultSize={{
          width: '60%',
          height: 300,
        }}
        onChange={() => { setText('resizing') }}
        onResizeStart={() => Toast.info(opts_1)}
        onResizeEnd={() => { Toast.info(opts); setText('test') }}
      >
        <div style={{ marginLeft: '20%' }}>
          {text}
        </div>
      </Resizable>
    </div>
  );
}

export const Single_Enabel = () => {
  const [b, setB] = useState(false)
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Button onClick={() => (setB(!b))}>{'left:' + b}</Button>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
        enable={{
          left: b
        }}
        defaultSize={{
          width: 200,
          height: 200,
        }}
      >
        <div style={{ marginLeft: '20%' }}>
          test
        </div>
      </Resizable>
    </div>
  );
}

export const Single_ratio = () => {
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
        defaultSize={{
          width: '60%',
          height: 300,
        }}
        ratio={2}
      >
        <div style={{ marginLeft: '20%' }}>
          test
        </div>
      </Resizable>
    </div>
  );
}

export const Single_lock_aspect = () => {
  const aspectRatio = 16 / 9
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
        defaultSize={{
          width: '60%',
          height: 300,
        }}
        lockAspectRatio
      >
        <div style={{ marginLeft: '20%' }}>
          lock
        </div>
      </Resizable>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
        defaultSize={{
          width: 200,
          height: 1800 / 16,
        }}
        lockAspectRatio={16 / 9}
      >
        <div style={{ marginLeft: '20%' }}>
          16 / 9
        </div>
      </Resizable>
    </div>
  );
}

export const singleMaxMin = () => {
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
        maxWidth={500}
        maxHeight={600}
        minWidth={50}
        minHeight={50}
        defaultSize={{
          width: 200,
          height: 300,
        }}
      >
        <div style={{ marginLeft: '20%' }}>
          width在50到500之间，height在50到600之间
        </div>
      </Resizable>
    </div>
  )
}

export const Single_change = () => {
  const [size, setSize] = useState({ width: 200, height: 300 });

  const onChange = ((newSize, event, direction) => {
    let realSize = { width: size.width + 10, height: size.height + 10 };
    setSize(realSize);
  })
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Button onClick={onChange}>set += 10</Button>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
        defaultSize={{
          width: '60%',
          height: 300,
        }}
        size={size}
      >
        <div style={{ marginLeft: '20%' }}>
          受控
        </div>
      </Resizable>
    </div>
  );
}

export const Single_scale = () => {

  return (
    <div style={{ width: '500px', height: '60%', transform: 'scale(0.5)', transformOrigin: '0 0' }}>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
        defaultSize={{
          width: '60%',
          height: 300,
        }}
        scale={0.5}
      >
        <div style={{ marginLeft: '20%' }}>
          scale 0.5
        </div>
      </Resizable>
    </div>
  );
}

export const Single_bound = () => {
  return (
    <div style={{ width: '500px', height: '600px', border: 'black 5px solid' }}>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
        defaultSize={{
          width: '60%',
          height: 300,
        }}
        boundElement={'parent'}
      >
        <div style={{ marginLeft: '20%' }}>
          受控
        </div>
      </Resizable>
    </div>
  );
}

export const Single_handler = () => {
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
        defaultSize={{
          width: '60%',
          height: 300,
        }}
        handleNode={{
          bottomRight: <Button type="primary">hi</Button>
        }}
      >
        <div style={{ marginLeft: '20%' }}>
          bottomRight
        </div>
      </Resizable>
    </div>
  );
}

export const Single_grid = () => {
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
        defaultSize={{
          width: '60%',
          height: 300,
        }}
        grid={100}
        snapGap={20}
      >
        <div style={{ marginLeft: '20%' }}>
          snap
        </div>
      </Resizable>
    </div >
  );
}
