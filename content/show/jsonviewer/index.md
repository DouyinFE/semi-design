---
localeCode: zh-CN
order: 86
category: 展示类
title: Json-Viewer JSON编辑器
icon: doc-list
dir: column
noInline: true
brief: 用于展示和编辑 JSON 数据
---

## 代码演示

### 如何引入

```jsx import
import { JsonViewer } from '@douyinfe/semi-ui';
```

### 基本用法

JsonViewer 的基本用法。传入 value height 和 width 参数，设置组件的高度和宽度和初始值。

```jsx live=true dir="column" noInline=true
import React from 'react';
import { JsonViewer } from '@douyinfe/semi-ui';

class SimpleList extends React.Component {
    render() {
        const data = `{
            "name": "Semi",
            "version": "0.0.0"
        }`;

        return (
            <div>
                <div style={{ marginRight: 16 }}>
                    <h3 style={{ marginBottom: 16 }}>Default Size</h3>
                    <JsonViewer height={400} width={700} value={data} />
                </div>
            </div>
        );
    }
}

render(SimpleList);
```

### 设置行高

配置 options 的 lineHeight 参数，设置固定行高（单位：px, 默认 20）。

```jsx live=true dir="column" noInline=true
import React from 'react';
import { JsonViewer } from '@douyinfe/semi-ui';

class SimpleList extends React.Component {
    render() {
        const data = `{
            "name": "Semi",
            "version": "0.0.0"
        }`;

        return (
            <div>
                <div style={{ marginRight: 16 }}>
                    <h3 style={{ marginBottom: 16 }}>Default Size</h3>
                    <JsonViewer height={400} width={700} value={data} options={{ lineHeight: 25 }} />
                </div>
            </div>
        );
    }
}

render(SimpleList);
```

### 自动换行

配置 options 的 autoHeight 参数，设置组件是否自动换行。

```jsx live=true dir="column" noInline=true
import React from 'react';
import { JsonViewer } from '@douyinfe/semi-ui';

class SimpleList extends React.Component {
    render() {
        const data = `{
            "name": "Semi",
            "version": "0.0.0",
            "description": "lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ipsum dolor sit amet, consectetur adipiscing elit."
        }`;

        return (
            <div>
                <div style={{ marginRight: 16 }}>
                    <h3 style={{ marginBottom: 16 }}>Default Size</h3>
                    <JsonViewer height={400} width={700} value={data} options={{ autoHeight: true }} />
                </div>
            </div>
        );
    }
}

render(SimpleList);
```

### 格式化配置

配置 options 的 formatOptions 参数，设置组件的格式化配置。

-   tabSize: number, 设置缩进大小,4 表示每级缩进 4 个空格
-   insertSpaces: boolean, true 表示使用空格进行缩进，false 表示使用制表符(Tab)
-   eol: string, 设置换行符,可以是\n,\r\n,

```jsx live=true dir="column" noInline=true
import React from 'react';
import { JsonViewer } from '@douyinfe/semi-ui';

class SimpleList extends React.Component {
    render() {
        const data = `{
            "name": "Semi",
            "version": "0.0.0",
            "description": "lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ipsum dolor sit amet, consectetur adipiscing elit."
        }`;

        return (
            <div>
                <div style={{ marginRight: 16 }}>
                    <h3 style={{ marginBottom: 16 }}>Default Size</h3>
                    <JsonViewer
                        height={400}
                        width={700}
                        value={data}
                        options={{ formatOptions: { tabSize: 2, insertSpaces: true, eol: '\n' } }}
                    />
                </div>
            </div>
        );
    }
}

render(SimpleList);
```
