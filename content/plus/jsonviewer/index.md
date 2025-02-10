---
localeCode: zh-CN
order: 27
category: Plus
title: JsonViewer Json编辑器
icon: doc-jsonviewer
dir: column
noInline: true
brief: 用于展示和编辑 JSON 数据
showNew: true
---

## 使用场景
JsonViewer 组件可用于 JSON 数据的展示与编辑。
Semi 重点参考了 [VS Code](https://github.com/microsoft/vscode)的 text-buffer 数据结构设计思路，复用了部分 utils与数据类型定义（Token解析，语言服务等），结合我们的功能/样式定制需求，实现了 JsonViewer 组件, 视觉上会与 Semi Design 体系内的其他组件更协调，对于特定数据类型的定制化渲染定制会更方便。  
相比于直接使用 MonacoEditor，Semi JsonViewer 在工程化构建上做了额外处理，使用更为简单，无需关注 Webpack插件、worker loader等复杂的配置。  
同时由于我们仅关注 Json 数据格式，更轻量化，在开箱即用的同时，拥有更小的体积**（📦 -96%）** ，更极致的加载速度**（🚀 -53.5%）** ，更少的内存占用**（⬇️ 71.6%）**。  
对于五百万行及以下的数据，均可以做到1s内完成数据加载与解析。
详细的对比数据可查阅 [Performance](#Performance) 章节
- 如果你仅需要对 Json 做预览/编辑，无需对更复杂的其他编程语言作修改，我们建议你选用 JsonViewer
- 如果你还需要处理其他格式的数据/代码文件，完整的代码编辑器能力（语法高亮、代码不全、错误提示、复杂编辑等）是刚需，构建产物体积不是关注重点，我们建议你选用 Monaco Editor


## 代码演示

### 如何引入
JsonViewer 从 v2.71.0 开始支持
```jsx import
import { JsonViewer } from '@douyinfe/semi-ui';
```

### 基本用法

JsonViewer 的基本用法。传入 height 和 width 参数，设置组件的高度和宽度和初始值。通过 value 传入 Json 字符串  
注意：JsonViewer 为非受控组件，若传入 value 属性为受控属性即React State，不建议在 onChange 中修改 value 属性即setState操作。若需要获取组件的值，可以通过 ref 获取，具体可参考 [Methods](#Methods)。

```jsx live=true dir="column" noInline=true
import React from 'react';
import { JsonViewer } from '@douyinfe/semi-ui';
const data = `{
    "name": "Semi",
    "version": "0.0.0"
}`;
class SimpleJsonViewer extends React.Component {
    render() {
        return (
            <div style={{ marginBottom: 16 }}>
                <JsonViewer height={100} width={400} value={data} />
            </div>
        );
    }
}

render(SimpleJsonViewer);
```

### 设置行高

配置 options 的 lineHeight 参数，设置固定行高（单位：px, 默认 18）。

```jsx live=true dir="column" noInline=true
import React from 'react';
import { JsonViewer, Space } from '@douyinfe/semi-ui';
const data = `{
    "name": "Semi",
    "version": "0.0.0"
}`;
class SimpleJsonViewerWithLineHeight extends React.Component {
    render() {
        return (
            <div>
                <div style={{ marginBottom: 12, overflow: 'hidden' }}>
                    <JsonViewer height={100} width={320} value={data} options={{ lineHeight: 20 }} />
                </div>
                <div style={{ marginBottom: 12, overflow: 'hidden' }}>
                    <JsonViewer height={120} width={320} value={data} options={{ lineHeight: 24 }} />
                </div>
                <div style={{ marginBottom: 12, overflow: 'hidden' }}>
                    <JsonViewer height={120} width={320} value={data} options={{ lineHeight: 26 }} />
                </div>
            </div>
        );
    }
}

render(SimpleJsonViewerWithLineHeight);
```

### 自动换行

配置 options 的 autoWrap 参数，设置为 true 时，组件会根据内容长度自动换行。

```jsx live=true dir="column" noInline=true
import React from 'react';
import { JsonViewer } from '@douyinfe/semi-ui';
const data = `{
    "name": "Semi",
    "version": "0.0.0",
    "description": "Semi Design is a design system that defines a set of mid_back design and front_end basic components."
}`;
class SimpleJsonViewerWithAutoWrap extends React.Component {
    render() {
        return (
            <div style={{ marginBottom: 16 }}>
                <JsonViewer height={120} width={800} value={data} options={{ autoWrap: true }} />
            </div>
        );
    }
}

render(SimpleJsonViewerWithAutoWrap);
```

### 格式化配置

配置 options 的 formatOptions 参数，设置组件的格式化配置。

-   tabSize: number，设置缩进大小为4，表示每级缩进 4 个空格
-   insertSpaces: boolean，true 表示使用空格进行缩进，false 表示使用制表符(Tab)
-   eol: string，设置换行符，可以是\n，\r\n，

```jsx live=true dir="column" noInline=true
import React, { useRef } from 'react';
import { JsonViewer, Button } from '@douyinfe/semi-ui';
const data = `{
  "name": "Semi",
  "version": "0.0.0"
}`;
function FormatJsonComponent() {
    const jsonviewerRef = useRef();
    return (
        <div>
            <Button onClick={() => console.log(jsonviewerRef.current.format())}>格式化</Button>
            <div style={{ marginBottom: 16, marginTop: 16 }}>
                <JsonViewer
                    ref={jsonviewerRef}
                    height={100}
                    width={400}
                    value={data}
                    options={{ formatOptions: { tabSize: 4, insertSpaces: true, eol: '\n' } }}
                />
            </div>
        </div>
    );
}

render(FormatJsonComponent);
```


## API 参考

### JsonViewer

| 属性                | 说明                                             | 类型                              | 默认值    |
|-------------------|------------------------------------------------|---------------------------------|--------------|
| value             | 展示内容                                    | string                                  | -  |
| height            | 高度                                     | number                                  | -  |
| width             | 宽度                                     | number                                  | -  |
| className         | 类名                           | string                                  | -   |
| style             | 内联样式                           | object                                  | -   |
| showSearch        | 是否显示搜索Icon                           | boolean                                  | true   |
| options           | 格式化配置                                | JsonViewerOptions                       | -   |
| onChange          | 内容变化回调                           | (value: string) => void                  | -   |

### JsonViewerOptions

| 属性                | 说明                                          | 类型                              | 默认值    |
|-------------------|------------------------------------------------|---------------------------------|-----------|
| lineHeight        | 行高                                    | number                          | 20  |
| autoWrap        | 是否自动换行                             | boolean                            | true  |
| readOnly        | 是否只读                             | boolean                            | false  |
| formatOptions     | 格式化配置                               | FormattingOptions                |  -  |

### FormattingOptions

| 属性                | 说明                                          | 类型                              | 默认值    |
|-------------------|------------------------------------------------|---------------------------------|-----------|
| tabSize           | 缩进大小                                 | number                          | 4  |
| insertSpaces      | 是否使用空格进行缩进                       | boolean                         | true  |
| eol               | 换行符                                   | string                          | '\n'  |

## Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 名称    | 描述     |
|---------|--------|
| getValue()  | 获取当前值 |
| format() | 格式化 |


### Performance 
#### Bundle Size 
| 组件         | 体积      | 体积(Gzip) |
| ------------ | --------- | ---------- |
| JsonViewer   | 203.14kb  | 51.23kb    |
| MonacoEditor | 5102.0 KB | 1322.7 KB  |

#### 渲染不同量级数据耗时
> 注：
> - 测试数据生成方式详情可查阅 [url](https://github.com/DouyinFE/semi-design/blob/main/packages/semi-ui/jsonViewer/_story/jsonViewer.stories.jsx)  
> - 当数据量级超出50w行时，ReactMonacoEditor 默认关闭高亮等行为，数据对比不遵循单一变量原则

| 组件              | 1k行    | 5k行    | 1w行    | 10w行   | 50w行    | 100w行   | 300w行   |
| ----------------- | ------- | ------- | ------- | ------- | -------- | -------- | -------- |
| JsonViewer        | 30.42ms | 30.66ms | 36.87ms | 52.73ms | 111.02ms | 178.81ms | 506.25ms |
| ReactMonacoEditor | 72.01ms | 73.76ms | 76.64ms | 97.89ms | 133.31ms | 202.79ms | 495.53ms |
| 性能提升          | 57.70%  | 58.41%  | 51.87%  | 46.11%  | -        | -        | -        |