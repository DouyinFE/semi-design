---
localeCode: zh-CN
order: 49
category: 展示类
title: Divider 分割线
icon: doc-divider
dir: column
brief: 分割线。
---

## 代码演示

### 如何引入

```jsx import
import { Divider } from '@douyinfe/semi-ui';
```

### 基本用法

```jsx live=true dir="column"
import React from 'react';
import { Divider } from '@douyinfe/semi-ui';

() => (
   <>
        <p>Semi Design </p>
        <Divider />
        <p>Semi Design </p>
        <Divider />
        <p>Semi Design </p>
   </>
);
```


## API 参考

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| align | 文本位置（仅在水平分割线有效）, 支持：`left`, `right`, `center` | string | `center` |
| children | 标题描述 | ReactNode | - |
| className | 类名 | string | - |
| dashed | 是否虚线 | boolean | false |
| layout | 布局方式，支持 `vertical`, `horizontal` | string | `vertical` |
| plain | 文字是否显示为普通正文样式 | boolean | false |
| style | 样式名 | CSSProperties | - |


## 设计变量

<DesignToken/>

## FAQ
