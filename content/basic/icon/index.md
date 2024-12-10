---
localeCode: zh-CN
order: 21
category: 基础
title:  Icon 图标
icon: doc-icons
brief: 语义化的矢量图形。
---

## 图标列表

默认的图标集 `@douyinfe/semi-icons` 包含面性、线性两套图标，默认不带颜色，可通过 css color属性更改颜色。

`@douyinfe/semi-icons-lab` 为彩色图标集，需单独安装，不可改色, lab 图标集于 v2.48 后提供

```icon
```

## 代码演示

### 如何引入

```jsx import
import Icon, { IconHome } from '@douyinfe/semi-icons';
import { IconAvatar, IconCard } from '@douyinfe/semi-icons-lab';
```

### 基础使用
从`@douyinfe/semi-icons`包中引入图标

```jsx live=true
import React from 'react';
import { IconHome } from '@douyinfe/semi-icons';

() => <IconHome />;

```


### 旋转
从`@douyinfe/semi-icons`包中引入图标，自带尺寸、旋转、spin功能

```jsx live=true
import React from 'react';
import { IconHome, IconEmoji, IconSpin } from '@douyinfe/semi-icons';

() => (
    <div>
        <IconHome size="small" />
        <IconEmoji rotate={180} />
        <IconSpin spin />
    </div>
);

```

### 尺寸
>
可以改变`font-size`来更改图标大小
>

Icon组件封装了size属性，可以更方便地定义图标尺寸，支持 `extra-small` (8x8)，`small` (12x12)， `default` (16x16)， `large` (20x20)， `extra-large` (24x24)，当size指定为`inherit`时，图标大小继承当前上下文字体大小


```jsx live=true
import React from 'react';
import { IconSearch, IconHelpCircle, IconAlertCircle, IconMinusCircle, IconPlusCircle, IconPlus, IconRefresh } from '@douyinfe/semi-icons';

() => {
    // eslint-disable-next-line react/jsx-key
    const types = [<IconSearch />, <IconHelpCircle />, <IconAlertCircle />, <IconMinusCircle />, <IconPlusCircle />, <IconPlus />, <IconRefresh />];
    const sizes = ['extra-small', 'small', 'default', 'large', 'extra-large'];
    let icons = types.map((type, i) => {
        return <div key={i} style={{ marginBottom: 4 }}>{sizes.map(size => React.cloneElement(type, { size, key: size }))}</div>;
    });
    return icons;
};
```

### 颜色
图标会自动继承外部容器 CSS 的 `color` 属性
你还可以通过给 Icon 设置 style props 来修改图标的颜色。

```jsx live=true
import React from 'react';
import { IconLikeHeart, IconFlag, IconLock, IconUnlock } from '@douyinfe/semi-icons';

() => (
    <div>
        <div style={{ color: '#E91E63' }} >
            <IconLikeHeart size="extra-large"/>
            <IconFlag size="extra-large"/>
        </div>
        <br/>
        <div>
            <IconLock style={{ color: '#6A3AC7' }} size="extra-large" />
            <IconUnlock style={{ color: '#9C27B0' }} size="extra-large"/>
        </div>
    </div>
);
```

### 自定义图标
可以使用自定义图标传入Icon组件
Icon组件支持size、rotate、spin等属性

```jsx live=true
import React from 'react';
import { Icon } from '@douyinfe/semi-ui';

() => {
    function CustomIcon() {
        return <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="#FBCD2C"/>
            <mask id="mask0" maskType="alpha" maskUnits="userSpaceOnUse" x="1" y="1" width="22" height="22">
                <circle cx="12" cy="12" r="11" fill="#A2845E"/>
            </mask>
            <g mask="url(#mask0)">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.9996 17.7963C13.7184 17.7963 15.2479 16.3561 16.0881 14.2048C16.6103 13.9909 17.1072 13.3424 17.334 12.4957C17.629 11.3948 17.5705 10.4118 16.7665 10.1059C16.6885 6.27115 15.1754 4.78714 11.9996 4.78714C8.82412 4.78714 7.31097 6.27097 7.2328 10.1052C6.42711 10.4103 6.36828 11.394 6.66349 12.4957C6.89064 13.3435 7.38849 13.9926 7.91145 14.2056C8.7518 16.3565 10.2811 17.7963 11.9996 17.7963ZM20.0126 23C20.34 23 20.5906 22.7037 20.4686 22.3999C19.6099 20.2625 16.1444 18.6636 12 18.6636C7.85555 18.6636 4.39008 20.2625 3.53142 22.3999C3.40937 22.7037 3.65999 23 3.9874 23H20.0126Z" fill="white"/>
            </g>
        </svg>;
    }
    return (
        <div>
            <Icon svg={<CustomIcon />} />
            <Icon svg={<CustomIcon />} rotate={180} />
        </div>
    );
};
```

### 使用svgr将svg文件转成ReactComponent
如果 Semi 提供的图标不足以满足业务需求，你也可以通过@svgr/webpack引入自定义图标，并以React组件形式使用

```
// webpack.config.js
{
  test: /\.svg$/,
  use: ['@svgr/webpack'],
}

import { Icon } from '@douyinfe/semi-ui';
import StarIcon from './star.svg';

<Icon svg={<StarIcon />} />
```



## API参考

### Icon

| 属性  | 说明        | 类型            | 默认值 |
|-------|-------------|-----------------|--------|
| className | 类名 | string | 无    |
| onClick | 单击图标的回调事件 | (e: Event) => void | 无    |
| onMouseDown | 鼠标按钮按下的回调事件 >=v1.21 | (e: Event) => void | 无    |
| onMouseEnter | 进入图标的回调事件 | (e: Event) => void | 无    |
| onMouseLeave | 离开图标的回调事件 | (e: Event) => void | 无    |
| onMouseMove | 移动鼠标的回调事件 >=v1.21 | (e: Event) => void | 无    |
| onMouseUp | 鼠标按钮抬起的回调事件 >=v1.21 | (e: Event) => void | 无    |
| rotate | 旋转度数 | number |   |
| size | 尺寸，支持`inherit`，`extra-small`，`small`， `default`， `large`， `extra-large` | string | `default`  |
| spin | 旋转动画 | boolean |   |
| style | 图标样式 | CSSProperties | 无    |
| svg | 图标内容 | ReactNode | 无    |


## Accessibility

### ARIA

- Icon 组件 role 为 img，它的 aria-label 默认为组件的文件名。例如 IconHome 的 aria-label 为 `home`，如果你有更好的语义化名字，可以通过 aria-label 传入。

```jsx live=true
import React from 'react';
import { IconHome } from '@douyinfe/semi-icons';

() => <IconHome aria-label="back to homepage" />;
```

- Icon 内部的 svg 元素为装饰元素，默认设置了 aria-hidden 以不被屏幕阅读器阅读
