---
localeCode: zh-CN
order: 30
category: 输入类
title: HotKeys 快捷键
icon: doc-configprovider
width: 60%
brief: 用于方便用户自定义快捷键及相关操作
---


## 代码演示

### 如何引入

```jsx import
import { HotKeys } from '@douyinfe/semi-ui';
```

### 说明
快捷键仅支持修饰键组合`Shift`,`Control`,`Meta`,`Alt`与其他键的组合。

当设定快捷键与常用快捷键如`Ctrl/Meta + C`相同时，会导致默认行为（复制）不会正常触发。

### 基本

基本使用，通过`hotKeys`传入快捷键组合，通过 onClick 绑定快捷键处理函数，作出响应动作。

按下 Ctrl + Shift + A，使得 count + 1。默认在 body 监听，全局生效。

[hotKeys取值参考](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)

也可以引入包装好的`Keys`进行设置
```jsx import
import { Keys } from '@douyinfe/semi-ui';
```

```jsx live=true
import React, { useState } from 'react';
import { HotKeys, Keys } from '@douyinfe/semi-ui';

function Demo() {
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <HotKeys hotKeys={[Keys.Control, 'Shift', 'a']} onClick={onClick} ></HotKeys>
      <div>{cnt}</div>
    </div>
  );
}
```

### 自定义内容

通过`content`传入渲染的字符

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
      <HotKeys hotKeys={["Control", Keys.B]} onClick={onClick} content={["Ctrl", "B"]}></HotKeys>
        <br></br>
      <HotKeys hotKeys={[Keys.Meta,"b"]} onClick={onClick} content={["⌘", "B"]}></HotKeys>
      <div>{cnt}</div>
    </div>
  );
}
```

通过`render`传入代替渲染的元素

当遇到操作系统导致的快捷键不同的问题时，可以类似地使用两个组件且自定义渲染
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
        <Tag>{"按下R / K即可加一"}</Tag>
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

### 点击触发

设置`clickable`为`true`可以通过点击触发
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

### 修改监听挂载DOM
快捷键默认在 body 监听，通过`getListenerTarget`修改快捷键监听挂载的DOM
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

### 不可用

设定 `disabled` 属性为 `true`, 不监听 hotKeys。

当仅需要样式时可以使用

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

## API 参考

### HotKeys

| 属性              | 说明                                                                  | 类型                            | 默认值    |
| ----------------- | --------------------------------------------------------------------- | ------------------------------- | --------- |
| hotKeys  | 设置快捷键组合，[取值参考](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)                                          | KeyboardEvent.key[]                          | -         |
| content | 设置显示内容                                          | string[]                          | -         |
| onClick        | 快捷键触发函数                                                              |   () => void                      |    -       |
| clickable       | 设置函数是否可以点击触发                                                              | boolean                       |   false       |
| render        |    覆盖组件渲染                                               | () => ReactNode \| ReactNode                       |           |
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

