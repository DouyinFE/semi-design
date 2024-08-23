---
localeCode: en-US
order: 30
category: Input
title:  HotKeys
icon: doc-input
width: 60%
brief: used to facilitate the customization of keyboard shortcut
---


## Demos

### How to import

```jsx import 
import { HotKeys } from '@douyinfe/semi-ui';
```

### Explaination
The hotkeys only support combinations of modifier keys like Shift, Control, Meta, and Alt with other keys.

When a hotkey is set to a common shortcut like Ctrl/Meta + C, it may prevent the default behavior (e.g., copying) from being triggered properly.

### Basic Usage

Pass in key combinations via `hotKeys` and bind a shortcut handler function using `onClick` to respond to the action.

When pressing `Ctrl + Shift + A`, it increments the count by 1. By default, it listens on the body, making it effective globally.

[values reference](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)

```jsx live=true
import React, { useState } from 'react';
import { HotKeys } from '@douyinfe/semi-ui';

function Demo() {
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <HotKeys hotKeys={['Control', 'Shift', 'a']} onClick={onClick} ></HotKeys>
      <div>{cnt}</div>
    </div>
  );
}
```

### Custom content

Set the characters through `content`

```jsx live=true
import React, { useState } from 'react';
import { HotKeys } from '@douyinfe/semi-ui';

function Demo() {
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <HotKeys hotKeys={["Control", "b"]} onClick={onClick} content={["Ctrl", "B"]}></HotKeys>
        <br></br>
      <HotKeys hotKeys={["Meta","b"]} onClick={onClick} content={["⌘", "B"]}></HotKeys>
      <div>{cnt}</div>
    </div>
  );
}
```

Replace the element through `render`

When encountering issues caused by different operating system shortcuts, you can similarly use two components and customize the rendering.
```jsx live=true
import React, { useState } from 'react';
import { HotKeys, Tag } from '@douyinfe/semi-ui';

function Demo() {
  const hotKeys = ["r"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  const newShortCut = () => {
    return (
      <div>
        <Tag>{"Click R / K to add"}</Tag>
      </div>
    )
  }
  return (
    <div>
      <HotKeys hotKeys={hotKeys} onClick={onClick} render={newShortCut}></HotKeys>
      <HotKeys hotKeys={["k"]} onClick={onClick} render={() => null}></HotKeys>
      <div>{cnt}</div>
    </div>
  );
}
```

### Clickable

Trigger the function by clicking component
```jsx live=true
import React, { useState } from 'react';
import { HotKeys } from '@douyinfe/semi-ui';

function Demo() {
  const hotKeys = ["Control", "a"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <HotKeys hotKeys={hotKeys} onClick={onClick} clickable></HotKeys>
      <div>{cnt}</div>
    </div>
  );
}
```

### change the DOM element the listener is mounted on
The hotkey is listened to on the body by default, through `getListenerTarget`
```jsx live=true
import React, { useState, useRef } from 'react';
import { HotKeys, Input } from '@douyinfe/semi-ui';

function Demo() {
  const hotKeys = ["Meta", "s"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }

  const inputRef = useRef(null);
  return (
    <div>
      <Input ref={inputRef} placeholder='test for target'></Input>
      <HotKeys hotKeys={hotKeys} onClick={onClick} 
        getListenerTarget={() => inputRef.current}>
      </HotKeys>
      <div>{cnt}</div>
    </div>
  );
}
```

### Disabled
By setting `disabled` as `true`, the component will not listen hotkeys.
You can use it when only styling is needed.

```jsx live=true
import React, { useState } from 'react';
import { HotKeys } from '@douyinfe/semi-ui';

function Demo() {
  const hotKeys = ["Control", "a"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <HotKeys hotKeys={hotKeys} onClick={onClick} disabled></HotKeys>
      <div>{cnt}</div>
    </div>
  );
}
```

## API Reference

### HotKeys


| Property          | Instructions                                                                                                                                                                                  | type                            | Default   |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|-----------|
| hotKeys  | Define keyboard shortcut，[values](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)                                          | KeyboardEvent.key[]                          | -         |
| content | Set the characters                                         | string[]                          | -         |
| onClick        | function that keyboard shortcut triggers                                                             |   () => void                      |    -       |
| clickable       | whether the function can be triggered by click                                                              | boolean                       |   false       |
| render        |    Replace the element                                               | () => ReactNode \| ReactNode                       |           |
| className         | class name                                                                  | string                          |           |
| getListenerTarget         | change the DOM element the listener is mounted on            | () => HTMLElement                       |  document.body         |
| disabled          |                                                   | boolean                         | false     |
| style             | style                                                                  | CSSProperties                   |           |

## Design Tokens
<DesignToken/>

<!-- ## Related Material
```material
44, 46
``` -->

## Related Material
<semi-material-list code="46"></semi-material-list>
