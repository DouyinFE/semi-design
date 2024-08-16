---
localeCode: en-US
order: 32
category: Input
title:  KeyboardShortCut
icon: doc-input
width: 60%
brief: used to facilitate the customization of keyboard shortcut
---


## Demos

### How to import

```jsx import 
import { KeyboardShortCut } from '@douyinfe/semi-ui';
```

### Basic Usage

Define the keyboard shortcut through `hotKeys`

[values reference](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)

```jsx live=true
import React, { useState } from 'react';
import { KeyboardShortCut } from '@douyinfe/semi-ui';

function Demo() {
  const hotKeys = ["Control", "a"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick} ></KeyboardShortCut>
      <br></br>
      <KeyboardShortCut hotKeys={['Control', 'Shift', 'a']} onClick={onClick} ></KeyboardShortCut>
      <div>{cnt}</div>
    </div>
  );
}
```

### Custom content

Set the characters through `content`

```jsx live=true
import React, { useState } from 'react';
import { KeyboardShortCut } from '@douyinfe/semi-ui';

function Demo() {
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <KeyboardShortCut hotKeys={["Control", "b"]} onClick={onClick} content={["Ctrl", "B"]}></KeyboardShortCut>
        <br></br>
      <KeyboardShortCut hotKeys={["Meta","c"]} onClick={onClick} content={["⌘", "C"]}></KeyboardShortCut>
      <div>{cnt}</div>
    </div>
  );
}
```

Replace the element through `render`
```jsx live=true
import React, { useState } from 'react';
import { KeyboardShortCut, Tag } from '@douyinfe/semi-ui';

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
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick} render={newShortCut}></KeyboardShortCut>
      <KeyboardShortCut hotKeys={["k"]} onClick={onClick} render={() => null}></KeyboardShortCut>
      <div>{cnt}</div>
    </div>
  );
}
```

### Clickable

Trigger the function by clicking component
```jsx live=true
import React, { useState } from 'react';
import { KeyboardShortCut } from '@douyinfe/semi-ui';

function Demo() {
  const hotKeys = ["Control", "a"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick} clickable></KeyboardShortCut>
      <div>{cnt}</div>
    </div>
  );
}
```

### change the DOM element the listener is mounted on
through `getListenerTarget`
```jsx live=true
import React, { useState, useRef } from 'react';
import { KeyboardShortCut, Input } from '@douyinfe/semi-ui';

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
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick} 
        getListenerTarget={() => inputRef.current}>
      </KeyboardShortCut>
      <div>{cnt}</div>
    </div>
  );
}
```

### Disabled

```jsx live=true
import React, { useState } from 'react';
import { KeyboardShortCut } from '@douyinfe/semi-ui';

function Demo() {
  const hotKeys = ["Control", "a"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick} disabled></KeyboardShortCut>
      <div>{cnt}</div>
    </div>
  );
}
```

## API Reference

### KeyboardShortCut


| Property          | Instructions                                                                                                                                                                                  | type                            | Default   |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|-----------|
| hotKeys  | Define keyboard shortcut，[values](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)                                          | KeyboardEvent.key[]                          | -         |
| content | Set the characters                                         | string[]                          | -         |
| onClick        | function that keyboard shortcut triggers                                                             |   () => void                      |    -       |
| clickable       | whether the function can be triggered by click                                                              | boolean                       |   false       |
| render        |    Replace the element                                               | () => ReactNode                        |           |
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
