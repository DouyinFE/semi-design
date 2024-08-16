---
localeCode: zh-CN
order: 32
category: 输入类
title: KeyboardShortCut 快捷键
icon: doc-input
width: 60%
brief: 用于方便用户自定义快捷键及相关操作
---


## 代码演示

### 如何引入

```jsx import
import { KeyboardShortCut } from '@douyinfe/semi-ui';
```
### 基本

基本使用，通过`hotKeys`传入快捷键组合

[hotKeys取值参考](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)

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

### 自定义内容

通过`content`传入渲染的字符

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

通过`render`传入代替渲染的元素
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
        <Tag>{"按下R / K即可加一"}</Tag>
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

### 点击触发

设置`clickable`为`true`可以通过点击触发
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

### 修改监听挂载DOM
通过`getListenerTarget`修改快捷键监听挂载的DOM
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

### 不可用

设定 `disabled` 属性为 `true`

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

## API 参考

### KeyboardShortCut

| 属性              | 说明                                                                  | 类型                            | 默认值    |
| ----------------- | --------------------------------------------------------------------- | ------------------------------- | --------- |
| hotKeys  | 设置快捷键组合，[取值参考](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)                                          | KeyboardEvent.key[]                          | -         |
| content | 设置显示内容                                          | string[]                          | -         |
| onClick        | 快捷键触发函数                                                              |   () => void                      |    -       |
| clickable       | 设置函数是否可以点击触发                                                              | boolean                       |   false       |
| render        |    覆盖组件渲染                                               | () => ReactNode                        |           |
| className         | 类名                                                                  | string                          |           |
| getListenerTarget         | 用于设置监听器挂载的DOM            | () => HTMLElement                       |  document.body         |
| disabled          | 是否禁用，默认为false                                                 | boolean                         | false     |
| style             | 样式                                                                  | CSSProperties                   |           |


## 设计变量
<DesignToken/>

<!-- ## 相关物料
```material
44, 46
``` -->

## 相关物料
<semi-material-list code="46"></semi-material-list>

