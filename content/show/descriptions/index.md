---
localeCode: zh-CN
order: 47
category: 展示类
title: Descriptions 描述列表
icon: doc-descriptions
dir: column
brief: 描述列表用于键值对的呈现。
---

## 代码演示

### 如何引入

```jsx import
import { Descriptions } from '@douyinfe/semi-ui';
```

### 基本用法

```jsx live=true dir="column"
import React from 'react';
import { Descriptions, Tag } from '@douyinfe/semi-ui';

() => {
    const data = [
        { key: '实际用户数量', value: '1,480,000' },
        { key: '7天留存', value: '98%' },
        { key: '安全等级', value: '3级' },
        { key: '垂类标签', value: <Tag style={{ margin: 0 }}>电商</Tag> },
        { key: '认证状态', value: '未认证' },
    ];
    return <Descriptions data={data} />;
};
```

### 设置对齐方式

可以通过设置 `align` 值选择对齐方式，支持 `center`, `justify`, `left`, 和 `plain`。默认对齐方式为 `center`。

```jsx live=true dir="column"

import React from 'react';
import { Descriptions, Tag } from '@douyinfe/semi-ui';

() => {
    const data = [
        { key: '实际用户数量', value: '1,480,000' },
        { key: '7天留存', value: '98%' },
        { key: '安全等级', value: '3级' },
        { key: '垂类标签', value: <Tag style={{ margin: 0 }}>电商</Tag> },
        { key: '认证状态', value: '未认证' },
    ];
    const style = {
        boxShadow: 'var(--semi-shadow-elevated)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '4px',
        padding: '10px',
        margin: '10px',
        width: '200px',
    };
    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Descriptions align="center" data={data} style={style} />
                <Descriptions align="justify" data={data} style={style} />
                <Descriptions align="left" data={data} style={style} />
                <Descriptions align="plain" data={data} style={style} />
            </div>
        </>
    );
};
```

### 双行显示

可以通过设置 `row` 可选择双行显示，支持三种不同的大小：`small`, `medium`, `large`。默认大小为 `medium`。

```jsx live=true dir="column"

import React from 'react';
import { Descriptions } from '@douyinfe/semi-ui';
import { IconArrowUp } from '@douyinfe/semi-icons';

() => {
    const data = [
        { key: '实际用户数量', value: '1,480,000' },
        {
            key: '7天留存',
            value: (
                <span>
                    98%
                    <IconArrowUp size="small" style={{ color: 'red', marginLeft: '4px' }} />
                </span>
            ),
        },
        { key: '安全等级', value: '3级' },
    ];
    const style = {
        boxShadow: 'var(--semi-shadow-elevated)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '4px',
        padding: '10px',
        marginRight: '20px',
        width: '600px',
    };
    return (
        <div>
            <Descriptions data={data} row size="small" style={style} />
            <br />
            <Descriptions data={data} row style={style} />
            <br />
            <Descriptions data={data} row size="large" style={style} />
        </div>
    );
};
```

### JSX 写法

版本：>= 1.17.0

```jsx live=true dir="column"

import React from 'react';
import { Descriptions } from '@douyinfe/semi-ui';

() => {
    return (
        <Descriptions>
            <Descriptions.Item itemKey="实际用户数量">1,480,000</Descriptions.Item>
            <Descriptions.Item itemKey="7天留存">98%</Descriptions.Item>
            <Descriptions.Item itemKey="安全等级">3级</Descriptions.Item>
            <Descriptions.Item itemKey="垂类标签">电商</Descriptions.Item>
            <Descriptions.Item itemKey="认证状态">未认证</Descriptions.Item>
        </Descriptions>
    );
};
```

## API 参考

### Descriptions

| 属性      | 说明                                                             | 类型       | 默认值   |
| --------- | ---------------------------------------------------------------- | ---------- | -------- |
| align     | 描述列表的对齐方式，可选 `center`、 `justify`、 `left`、 `plain` | string     | `center` |
| className | 类名                                                             | string     | 无       |
| data      | 列表显示的内容                                                   | DataItem[] | 无       |
| row       | 是否双行显示                                                     | boolean    | `false`  |
| size      | 设置双行显示时的列表的大小，可选 `small`、 `medium`、 `large`    | string     | `medium` |
| style     | 列表的样式                                                       | CSSProperties     | 无       |

### DataItem

| 属性   | 说明                             | 类型                        | 默认值 |
| ------ | -------------------------------- | --------------------------- | ------ |
| key    | required 且要求唯一，键值        | string \| number           | -      |
| value  | 属性值                           | ReactNode \| (() => ReactNode) | -      |
| hidden | 该数据是否需要展示 **v>=1.12.0** | boolean                     | -      |

### DescriptionItem

**v>=1.17.0**

| 属性      | 说明                      | 类型              | 默认值 |
| --------- | ------------------------- | ----------------- | ------ |
| itemKey   | required 且要求唯一，键值 | string \| number | -      |
| hidden    | 该数据是否需要展示        | boolean           | -      |
| className | 类名                      | string            | -     |
| style     | 列表的样式                | CSSProperties            | -     |

## 设计变量

<DesignToken/>
