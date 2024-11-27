---
localeCode: zh-CN
order: 28
category: Plus
title:  DragMove 拖拽移动
icon: doc-configprovider
dir: column
brief: 可通过拖拽改变位置
showNew: true
---

## 使用场景

用于设置元素可被拖动改变位置，支持限制拖拽范围，支持自定义触发拖动的元素。

## 代码演示

### 如何引入

DragMove 从 v2.71.0 开始支持

```jsx
import { DragMove } from '@douyinfe/semi-ui';
```

### 基本用法

通过 `element` 传入可拖拽的元素，获取 `DragMove` 的实例。通过 `init` 方法初始化, 初始化后，元素将能够通过拖拽改变位置，通过 `destroy` 方法可取消拖动改变位置的功能。

***注意：DragMove 会将可拖拽的元素设置为 absolute 定位***

```jsx live=true
import React, { useRef, useEffect } from 'react';
import { DragMove } from '@douyinfe/semi-ui';

function Demo() {
    const handlerRef = useRef();
    useEffect(() => {
        let dragMove = new DragMove({ element: handlerRef.current });
        dragMove.init();
        return () => {
            dragMove.destroy();
            dragMove = null;
        }
    } , []);

    return (
        <div 
            style={{ backgroundColor: 'var(--semi-color-primary)',width: 80, height: 80, 
                display: 'flex', alignItems: 'center',justifyContent: 'center', 
                borderRadius: 10, fontWeight: 500,
                position: 'absolute',  color: 'rgba(var(--semi-white), 1)'}} 
            ref={handlerRef}
        >Drag me</div>
    );
}

```

### 限制拖动范围

通过 `constrainer` 传入限制可拖拽的范围的元素，设置后，可拖拽元素的拖拽范围被限制为 `constrainer` 内。

***注意：constrainer 设置的元素需要为 relative 定位***

```jsx live=true
import React, { useRef, useEffect } from 'react';
import { DragMove } from '@douyinfe/semi-ui';

function Demo() {
  const handlerRef = React.useRef();
  const containerRef = React.useRef();

  useEffect(() => {
    let  dragMove = new DragMove({ 
      element: handlerRef.current,
      constrainer: containerRef.current,
    });
    dragMove.init();
    return () => {
      dragMove.destroy();
      dragMove = null;
    }
  } , []);

  return (
    <div 
      style={{ 
        backgroundColor: 'rgba(var(--semi-grey-2), 1)', 
        width: 300, height: 300, padding: 5, position: 'relative', 
        color: 'rgba(var(--semi-white), 1)', fontWeight: 500,
      }} 
      ref={containerRef}
    >
      <span>constrainer</span>
      <div style={{ backgroundColor: 'var(--semi-color-primary)', 
        width: 80, height: 80, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'absolute', top: 80, left: 80,
        }} ref={handlerRef}>Drag me</div>
    </div>
  )
}
```

### 自定义触发拖动的元素

可通过 `handler` 自定义触发拖动的元素。如果不设置，则点击 element 的任意位置均可拖动；如果设置，则仅点击 handler 部分可拖动。

```jsx live=true
import React, { useRef, useEffect } from'react';
import { IconTransparentStroked } from '@douyinfe/semi-icons';
import { DragMove } from '@douyinfe/semi-ui';

function Demo(){
  const handlerRef = React.useRef();
  const elementRef = React.useRef();
  const containerRef = React.useRef();

  useEffect(() => {
    let dragMove = new DragMove({
      element: elementRef.current,
      handler: handlerRef.current,
      constrainer: containerRef.current,
    });
    dragMove.init();
    return () => {
      dragMove.destroy();
      dragMove = null;
    }
  } , []);

  return (
    <div 
      style={{ backgroundColor: 'rgba(var(--semi-grey-2), 1)', 
        width: 300, height: 300, padding: 5, position: 'relative', 
        color: 'rgba(var(--semi-white), 1)', fontWeight: 500,
      }} 
      ref={containerRef}
    >
      <span>constrainer</span>
      <div style={{ 
        backgroundColor: 'var(--semi-color-primary)', 
        width: 80, height: 80, borderRadius: 10,
        position: 'absolute', top: 50, left: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }} ref={elementRef}>
        <div 
            style={{ width: 'fit-content', height: 'fit-content'}} 
            ref={handlerRef}
        ><IconTransparentStroked /></div>
      </div>
    </div>
  )
}
```


### API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | ----- |
| element| 可拖拽改变位置的元素 | HTMLElement | - |
| handler | 触发拖动的元素，如果不设置，则点击 element 的任意位置均可拖动；如果设置，则仅点击 handler 部分可拖动 | HTMLElement | - |
|constrainer | 限制可拖拽的范围的元素，如果设置，则可拖拽元素的拖拽范围被限制为 constrainer 内 | HTMLElement | - |
| onMouseDown | 鼠标按下时的回调 | (e: MouseEvent) => void | - |
| onMouseMove | 鼠标移动时的回调 | (e: MouseEvent) => void | - |
| onMouseUp | 鼠标抬起时的回调 | (e: MouseEvent) => void | - |
| onTouchStart | 触摸开始时的回调 | (e: TouchEvent) => void | - |
| onTouchMove | 触摸移动时的回调 | (e: TouchEvent) => void | - |
| onTouchEnd | 触摸结束时的回调 | (e: TouchEvent) => void | - |
| onTouchCancel | 触摸取消时的回调 | (e: TouchEvent) => void | - |








