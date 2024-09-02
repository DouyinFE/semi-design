---
localeCode: zh-CN
order: 49
category: 导航类
title:  Resizable 伸缩框
icon: doc-steps
brief: 根据用户的鼠标拖拽，改变组件的大小，支持单个组件伸缩与组合伸缩
---

# 代码演示

## 如何引入

```jsx import
import { Resizable } from '@douyinfe/semi-ui';
import { ResizeItem, ResizeHandler, ResizeGroup } from '@douyinfe/semi-ui'
```

## 单个组件

### 基本使用与回调
通过`defaultSize`设置初始大小，可以通过`onResizeStart` `onResize` `onResizeEnd`设置拖拽的回调

```jsx live=true "
import React, { useState } from 'react';
import { Resizable } from '@douyinfe/semi-ui';

function Demo() {
  const [text, setText] = useState('test')
  const opts_1 = {
    content: 'resize start',
    duration: 1,
    stack: true,
  };
  const opts_2 = {
    content: 'resize end',
    duration: 1,
    stack: true,
  };
  return (
    <div style={{ width: '500px' }}>
      <Resizable
        style={{ backgroundColor: 'lightblue' }}
        defaultSize={{
          width: '60%',
          height: 300,
        }}
        onChange={() => { setText('resizing') }}
        onResizeStart={() => Toast.info(opts_1)}
        onResizeEnd={() => { Toast.info(opts_2); setText('test') }}
      >
        <div style={{ marginLeft: '20%' }}>
          {text}
        </div>
      </Resizable>
    </div>
  );
}

```

### 控制伸缩方向
通过设置`enable`的值开启/关闭特定伸缩方向，默认值均为`true`

```tsx
interface Enable {
  left: Boolean;
  right: Boolean;
  top: Boolean;
  bottom: Boolean;
  topLeft: Boolean;
  topRight: Boolean;
  bottomLeft: Boolean;
  bottomRight: Boolean;
}
```


```jsx live=true "
import React, { useState } from 'react';
import { Resizable } from '@douyinfe/semi-ui';

function Demo() {
  const [b, setB] = useState(false)
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Button onClick={() => (setB(!b))}>{'enable.left:' + b}</Button>
      <Resizable
        style={{ backgroundColor: 'lightblue' }}
        enable={{
          left: b
        }}
        defaultSize={{
          width: 200,
          height: 200,
        }}
      >
        <div style={{ marginLeft: '20%' }}>
          {'enable.left:' + b}
        </div>
      </Resizable>
    </div>
  );
}

```

### 设置变化比例

通过`ratio`设置拖动和实际变化的比例 

```jsx live=true "
import React, { useState } from 'react';
import { Resizable } from '@douyinfe/semi-ui';

function Demo() {
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Resizable
        style={{ backgroundColor: 'lightblue' }}
        ratio={2}
        defaultSize={{
          width: 200,
          height: 200,
        }}
      >
        <div style={{ marginLeft: '20%' }}>
          ratio=2
        </div>
      </Resizable>
    </div>
  );
}

```

### 锁定横纵比

通过`lockAspectRatio`设置锁定横纵比,可以为`boolean`或`number`,为`number`时表示横纵比为`number`,为`true`时锁定初始横纵比

```jsx live=true "
import React, { useState } from 'react';
import { Resizable } from '@douyinfe/semi-ui';

function Demo() {
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Resizable
        style={{ backgroundColor: 'lightblue' }}
        defaultSize={{
          width: 400,
          height: 300,
        }}
        lockAspectRatio
      >
        <div style={{ marginLeft: '20%' }}>
          lock
        </div>
      </Resizable>
      <Resizable
        style={{backgroundColor: 'lightblue'}}
        defaultSize={{
          width: 200,
          height: 200 * 9 / 16,
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

```

### 设置最大，最小宽高 
可通过 `maxHeight`，`maxWidth`，`minHeight`，`minWidth` 设置最大，最小宽高

```jsx live=true "
import React, { useState } from 'react';
import { Resizable } from '@douyinfe/semi-ui';

function Demo() {
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Resizable
        style={{ backgroundColor: 'lightblue' }}
        maxWidth={200}
        maxHeight={300}
        minWidth={50}
        minHeight={50}
        defaultSize={{
          width: 100,
          height: 100,
        }}
      >
        <div style={{ marginLeft: '20%' }}>
          width在50到200之间，height在50到300之间
        </div>
      </Resizable>
    </div>
  );
}

```

### 受控宽高

可通过 `size` 控制元素的宽高

```jsx live=true
import React, { useState } from 'react';
import { Resizable } from '@douyinfe/semi-ui';

function Demo() {
  const [size, setSize] = useState({ width: 200, height: 300 });

  const onChange = ((newSize, event, direction) => {
    let realSize = { width: size.width + 10, height: size.height + 10 };
    setSize(realSize);
  })
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Button onClick={onChange}>set += 10</Button>
      <Resizable
        style={{ backgroundColor: 'lightblue' }}
        defaultSize={{
          width: 100,
          height: 100,
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

```

### 设置缩放值

通过设置 `scale`，整体缩放元素
```jsx live=true
import React, { useState } from 'react';
import { Resizable } from '@douyinfe/semi-ui';

function Demo() {
  return (
    <div style={{ width: '500px', height: '60%', transform: 'scale(0.5)', transformOrigin: '0 0' }}>
      <Resizable
        style={{ backgroundColor: 'lightblue' }}
        defaultSize={{
          width: '60%',
          height: '60%',
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

```

### 根据元素限制元素宽高

通过 boundElement 设置用于限制宽高的元素，支持 string（'parent'｜'window'） / Element 节点

```jsx live=true
import React, { useState } from 'react';
import { Resizable } from '@douyinfe/semi-ui';

function Demo() {
  return (
    <div style={{ width: '300px', height: '300px', border: 'black 5px solid' }}>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'lightblue' }}
        defaultSize={{
          width: '60%',
          height: 200,
        }}
        boundElement={'parent'}
      >
        <div style={{ marginLeft: '20%' }}>
          bound：parent
        </div>
      </Resizable>
    </div>
  );
}

```

### 自定义边角handler样式

可通过 handleNode设置不同方向的拖动元素节点，可通过 handleStyle，handleClassName 设置不同方向上的样式

```jsx
type HandleNode = {
  left: ReactNode;
  right: ReactNode;
  top: ReactNode;
  bottom: ReactNode;
  topLeft: ReactNode;
  topRight: ReactNode;
  bottomLeft: ReactNode;
  bottomRight: ReactNode;
}

type HandleStyle = {
  left: React.CSSProperties;
  right: React.CSSProperties;
  top: React.CSSProperties;
  bottom: React.CSSProperties;
  topLeft: React.CSSProperties;
  topRight: React.CSSProperties;
  bottomLeft: React.CSSProperties;
  bottomRight: React.CSSProperties;
}

type HandleStyle = {
  left: string;
  right: string;
  top: string;
  bottom: string;
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}
```

```jsx live=true "
import React, { useState } from 'react';
import { Resizable, Button } from '@douyinfe/semi-ui';
function Demo() {
    return (
    <div style={{ width: '500px', height: '60%' }}>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'lightblue', border: 'black 5px solid' }}
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
```

### 允许阶段性调整宽高

可通过 grid ，snap 属性允许逐渐调整宽高。
grid 属性用于指定调整大小应对齐的增量。默认为 [1, 1]。
snap 属性用于指定调整大小时应对齐的绝对像素值。 x 和 y 都是可选的，允许仅包含要定义的轴。默认为空。
以上两个参数可结合 snapGap使用，该参数用于指定移动到下一个目标所需的最小间隙。默认为 0，这意味着始终使用grid/snap 设定的目标。

```jsx live=true 
import React, { useState } from 'react';
import { Resizable } from '@douyinfe/semi-ui';

function Demo() {
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Resizable
        style={{ marginLeft: '20%', backgroundColor: 'lightblue', border: 'black 5px solid' }}
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
```

## 组合组件


### 基本使用
通过`direction`设置伸缩方向，可选值为`horizontal`和`vertical`
支持`onResizeStart` `onResize` `onResizeEnd`回调，支持`min` `max`设置最大最小宽高

```jsx live=true dir="column"
import React, { useState } from 'react';
import { ResizeItem, ResizeHandler, ResizeGroup, Toast } from '@douyinfe/semi-ui';

function Demo() {
  const [text, setText] = useState('test')
  return (
    <div style={{ width: '1000px', height: '100px' }}>
      <ResizeGroup direction='horizontal'>
        <ResizeItem
          style={{ backgroundColor: 'lightblue', border: 'black 5px solid' }}
          defaultSize={{
            width: '25%',
            height: '100%',
          }}
          minWidth={'10%'}
          onResizeStart={() => Toast.info({ content: 'resize start', duration: 1, stack: true })}
          onChange={() => { setText('resizing') }}
          onResizeEnd={() => { Toast.info({ content: 'resize end', duration: 1, stack: true }); setText('test') }}
        >
          <div style={{ marginLeft: '20%' }}>
            {text + " min:10%"}
          </div>
        </ResizeItem>
        <ResizeHandler></ResizeHandler>
        <ResizeItem
          style={{ backgroundColor: 'lightblue', border: 'black 5px solid' }}
          defaultSize={{
            width: '25%',
            height: '100%',
          }}
          minWidth={'10%'}
          maxWidth={'30%'}
        >
          <div style={{ marginLeft: '20%' }}>
            {text + " min:10% max:30%"}
          </div>
        </ResizeItem>
        <ResizeHandler></ResizeHandler>
        <ResizeItem
          style={{ backgroundColor: 'lightblue', border: 'black 5px solid' }}
          defaultSize={{
            width: '25%',
            height: '100%',
          }}
        >
          <div style={{ marginLeft: '20%' }}>
            {text}
          </div>
        </ResizeItem>
      </ResizeGroup>
    </div>
  );
}
```

### 嵌套使用
通过`direction`设置伸缩方向，可选值为`horizontal`和`vertical`

```jsx live=true 
import React, { useState } from 'react';
import { ResizeItem, ResizeHandler, ResizeGroup } from '@douyinfe/semi-ui';

function Demo() {
  const [text, setText] = useState('test')
  const opts_1 = {
    content: 'resize start',
    duration: 1,
    stack: true,
  };
  const opts_2 = {
    content: 'resize end',
    duration: 1,
    stack: true,
  };
  return (
    <div style={{ width: '500px', height: '300px' }}>
      <ResizeGroup direction='vertical'>
        <ResizeItem
          style={{ backgroundColor: 'lightblue' }}
          defaultSize={{
            height: '20%',
          }}
          onChange={() => { setText('resizing') }}
          onResizeStart={() => Toast.info(opts_1)}
          onResizeEnd={() => { Toast.info(opts_2); setText('test') }}
        >
          <div style={{ marginLeft: '20%' }}>
            {'header'}
          </div>
        </ResizeItem>
        <ResizeHandler></ResizeHandler>
        <ResizeItem
          defaultSize={{
            height: '80%',
          }}
          onChange={() => { setText('resizing') }}
        >
          <ResizeGroup direction='horizontal'>
            <ResizeItem
              style={{ backgroundColor: 'lightblue', border: 'black 1px solid' }}
              defaultSize={{
                width: '25%',
              }}
            >
              <div style={{ marginLeft: '20%' }}>
                {'tab'}
              </div>
            </ResizeItem>
            <ResizeHandler></ResizeHandler>
            <ResizeItem
              style={{ backgroundColor: 'lightblue', border: 'black 1px solid' }}
              defaultSize={{
                width: '75%',
              }}
            >
              <div style={{ marginLeft: '20%' }}>
                {text}
              </div>
            </ResizeItem>
          </ResizeGroup>
        </ResizeItem>
      </ResizeGroup>
    </div>
  );
}
```


## Accessibility

### ARIA

- Steps、Step组件支持传入`aria-label`属性，来表示Steps和Step的描述
- Step组件具有 `aria-current` `step` 属性，表示这是步骤条内的一步

## API 参考

### Steps

整体步骤条。

| 参数      | 说明                                                                          | 类型                    | 默认值     | 版本   |
| --------- | ----------------------------------------------------------------------------- | ----------------------- | ---------- | ------ |
| className | 类名                                                                          | string                  |            |        |
| current   | 指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 `status` 属性覆盖状态 | number                  | 0          |        |
| direction | 指定步骤条方向。目前支持水平（`horizontal`）和竖直（`vertical`）两种方向      | string                  | horizontal |        |
| hasLine   | 步骤条类型为basic时，可控制是否显示连接线                                     | boolean                 | true       | 1.18.0 |
| initial   | 起始序号，从 0 开始记数                                                       | number                  | 0          |        |
| status    | 指定当前步骤的状态，可选 `wait`、`process`、`finish`、`error`、`warning`      | string                  | process    |        |
| size      | 对于简单步骤条和导航步骤条，可选尺寸尺寸，值为`small`、`default`              | string                  | `default`  | 1.18.0 |
| style     | 样式                                                                          | CSSProperties           |            |        |
| type      | 步骤条类型，可选 `fill`、`basic`、`nav`                                       | string                  | fill       | 1.18.0 |
| onChange  | 改变步骤条的回调                                                              | (index: number) => void | -          | 1.29.0 |

### Steps.Step

步骤条内的每一个步骤。

| 参数        | 说明                                                                                                                        | 类型                               | 默认值 | 版本 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------ | ---- |
| aria-label  | 容器aria-label                                                                                                              | React.AriaAttributes["aria-label"] |        |      |
| className   | 类名                                                                                                                        | string                             |        |      |
| description | 步骤的详情描述，可选                                                                                                        | ReactNode                          | -      |      |
| icon        | 步骤图标的类型，可选                                                                                                        | ReactNode                          | -      |      |
| role        | 容器role                                                                                                                    | React.AriaRole                     | -      |      |
| status      | 指定状态。当不配置该属性时，会使用 Steps 的 `current` 来自动指定状态。可选：`wait`、`process`、`finish`、`error`、`warning` | string                             | wait   |      |
| style       | 样式                                                                                                                        | CSSProperties                      |        |      |
| title       | 标题                                                                                                                        | ReactNode                          | -      |      |
| onClick     | 点击回调                                                                                                                    | function                           | -      |      |
| onKeyDown   | 回车事件回调                                                                                                                | function                           | -      |      |


## 文案规范
- 步骤标题
  - 标题应保持简洁，避免截断和换行；
  - 使用句子大小写书写；
  - 不要包含标点符号
- 描述
  - 为标题补充上下文信息
  - 不要以标点符号结尾
## 设计变量
<DesignToken/>