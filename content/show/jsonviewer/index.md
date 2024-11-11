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

配置 options 的 autoWrap 参数，设置组件是否自动换行。

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
                    <JsonViewer height={400} width={700} value={data} options={{ autoWrap: true }} />
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

## API 参考

### JsonViewer

| 属性                | 说明                                             | 类型                              | 默认值    |
|-------------------|------------------------------------------------|---------------------------------|--------------|
| value             | 设置 value 属性                                  | string                                  | -  |
| height            | 设置高度 属性                                     | number                                  | -  |
| width             | 设置宽度 属性                                     | number                                  | -  |
| options           | 设置格式化配置 属性                                | JsonViewerOptions                       | -   |
| onChange          | 设置 value 变化回调 属性                           | (value: string) => void                  | -   |
| onValueHover      | 设置 value 悬浮回调 属性                           | ({value: string, target: HTMLElement}) => HTMLElement | -   |

### JsonViewerOptions

| 属性                | 说明                                          | 类型                              | 默认值    |
|-------------------|------------------------------------------------|---------------------------------|-----------|
| lineHeight        | 设置行高 属性                                    | number                          | 20  |
| autoWrap        | 设置是否自动换行 属性                             | boolean                          | true  |
| formatOptions     | 设置格式化配置 属性                               | FormattingOptions                |           |

### FormattingOptions

| 属性                | 说明                                          | 类型                              | 默认值    |
|-------------------|------------------------------------------------|---------------------------------|-----------|
| tabSize           | 设置缩进大小 属性                                 | number                          | 4  |
| insertSpaces      | 设置是否使用空格进行缩进 属性                       | boolean                         | true  |
| eol               | 设置换行符 属性                                   | string                          | '\n'  |




## 使用场景

JsonViewer 和 Monaco Editor 各有其适用场景：

- **JsonViewer 适用于**：
  - 仅需 JSON 查看和基础编辑的场景
  - 对加载速度和性能要求较高的场景
  - 需要更轻量级组件的场景

- **Monaco Editor 适用于**：
  - 需要完整 IDE 功能的场景（如语法高亮、代码补全、错误提示等）
  - 需要多语言支持的场景
  - 需要更复杂编辑功能的场景

### 技术实现

JsonViewer 底层使用 jsonc-parser 进行 JSON 词法解析和格式化，并在此基础上实现了 JSON 的 AST 解析，代码提示等功能。