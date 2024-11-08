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

JsonViewer 的基本用法。传入 height 和 width 参数，设置组件的高度和宽度。

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
                    <JsonViewer
                        height={400}
                        width={700}
                        value={data}
                    />
                </div>
            </div>
        );
    }
}

render(SimpleList);
```
