---
localeCode: en-US
order: 28
category: Plus
title:  DragMove
icon: doc-configprovider
dir: column
brief: Set elements to change their position by dragging
showNew: true
---

## When to use

It is used to set the element that can be dragged to change its position. It supports limiting the drag range and customizing the elements that trigger dragging.

## Demos

### How to introduce

DragMove supported from v2.71.0.

```jsx
import { DragMove } from '@douyinfe/semi-ui';
```

### Basic usage

Pass in the draggable element through `element` and get the instance of `DragMove`. Initialized through the `init` method. After initialization, the element will be able to change its position by dragging. The `destroy` method can cancel the function of dragging to change the position.

***Note: DragMove will set draggable elements to absolute positioning***

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

### Limit drag range

Pass in the element that limits the draggable range through `constrainer`. After setting, the dragging range of the draggable element is limited to within `constrainer`

***Note: The elements set by the constrainer need to be positioned relative***

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

### Customize elements that trigger dragging

The element that triggers dragging can be customized through `handler`. If it is not set, you can click anywhere on the `element` to drag; if it is set, you can click only the `handler` part to drag.

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

| Property | Description | Type | Default value |
| --- | --- | --- | ----- |
| element| Elements whose position can be changed by dragging | HTMLElement | - |
| handler | The element that triggers dragging. If it is not set, you can click anywhere on the element to drag. If it is set, you can only click the handler part to drag. | HTMLElement | - |
|constrainer | Elements that limit the draggable range. If set, the dragging range of the draggable element is limited to the constrainer. | HTMLElement | - |
| onMouseDown | Callback when mouse is down | (e: MouseEvent) => void | - |
| onMouseMove | Callback when mouse moves | (e: MouseEvent) => void | - |
| onMouseUp | Callback when mouse is up | (e: MouseEvent) => void | - |
| onTouchStart | Callback when touch starts | (e: TouchEvent) => void | - |
| onTouchMove | Callback when touch Moves | (e: TouchEvent) => void | - |
| onTouchEnd | Callback when touch ends | (e: TouchEvent) => void | - |
| onTouchCancel | Callback when touch cancels | (e: TouchEvent) => void | - |


