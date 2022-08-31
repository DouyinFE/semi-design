---
localeCode: zh-CN
order: 44
category: 展示类
title: Avatar 头像
icon: doc-avatar
brief: 头像，支持图片或字符展示。
---

## 代码演示

### 如何引入

```jsx import
import { Avatar, AvatarGroup } from '@douyinfe/semi-ui';
```

### 尺寸

可以通过 `size` 属性设置图标大小，支持``extra-extra-small`(20x20)，`extra-small`(24x24)，`small`(32x32)，`default`(40x40)，`medium`(48x48)，`large`(72x72)，`extra-large`(128x128)`。

```jsx live=true
import React from 'react';
import { Avatar } from '@douyinfe/semi-ui';

() => (
    <div>
        <Avatar size="extra-extra-small" style={{ margin: 4 }} alt='User'>
            U
        </Avatar>
        <Avatar size="extra-small" style={{ margin: 4 }} alt='User'>
            U
        </Avatar>
        <Avatar size="small" style={{ margin: 4 }} alt='User'>
            U
        </Avatar>
        <Avatar size="default" style={{ margin: 4 }} alt='User'>
            U
        </Avatar>
        <Avatar style={{ margin: 4 }} alt='User'>U</Avatar>
        <Avatar size="large" style={{ margin: 4 }} alt='User'>
            U
        </Avatar>
        <Avatar size="extra-large" style={{ margin: 4 }} alt='User'>
            U
        </Avatar>
    </div>
);
```

### 颜色

Avatar 支持默认色板的 15 种颜色和白色，包括：`amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow`。也可以通过 `style` 来自定义颜色样式。默认为`grey`。

```jsx live=true
import React from 'react';
import { Avatar } from '@douyinfe/semi-ui';

() => (
    <div>
        <Avatar style={{ margin: 4 }} alt='Alice Swift'>AS</Avatar>
        <Avatar color="red" style={{ margin: 4 }} alt='Bob Matteo'>
            BM
        </Avatar>
        <Avatar color="light-blue" style={{ margin: 4 }} alt='Taylor Joy'>
            TJ
        </Avatar>
        <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', margin: 4 }} alt='Zank Lance'>ZL</Avatar>
        <Avatar style={{ backgroundColor: '#87d068', margin: 4 }} alt='Youself Zhang'>YZ</Avatar>
    </div>
);
```

### 图片

可以通过 `src` 设置图片格式的头像。

```jsx live=true
import React from 'react';
import { Avatar } from '@douyinfe/semi-ui';

() => (
    <div>
        <Avatar
            alt="beautiful cat"
            src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png"
            style={{ margin: 4 }}
        />
        <Avatar
            alt="cute cat"
            size="small"
            src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png"
            style={{ margin: 4 }}
        />
    </div>
);
```

### 形状

Avatar 支持 `circle`、`square` 两种形状，默认为 `circle`。

```jsx live=true
import React from 'react';
import { Avatar } from '@douyinfe/semi-ui';

() => (
    <div>
        <Avatar style={{ margin: 4 }} alt="User">U</Avatar>
        <Avatar shape="square" style={{ margin: 4 }} alt="User">
            U
        </Avatar>
    </div>
);
```

### 事件

Avatar 支持 `onClick`、`onMouseEnter`、`onMouseLeave`。其中 `hover` 状态下可以通过 `hoverMask` 属性传入覆盖层的内容。覆盖层无默认样式。

```jsx live=true
import React from 'react';
import { Avatar } from '@douyinfe/semi-ui';
import { IconCamera } from '@douyinfe/semi-icons';

() => {
    const style = {
        backgroundColor: 'var(--semi-color-overlay-bg)',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };
    const hover = (
        <div style={style}>
            <IconCamera />
        </div>
    );

    return (
        <Avatar hoverMask={hover} color="red" alt='Bob Downton'>
            BD
        </Avatar>
    );
};
```

### 头像组

可以通过 AvatarGroup 将 `avatar` 显示为组。

```jsx live=true
import React from 'react';
import { AvatarGroup, Avatar } from '@douyinfe/semi-ui';

() => (
    <div>
        <AvatarGroup>
            <Avatar color="red" alt='Lisa LeBlanc'>LL</Avatar>
            <Avatar alt='Caroline Xiao'>CX</Avatar>
            <Avatar color="amber" alt='Rafal Matin'>RM</Avatar>
            <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} alt='Zank Lance'>ZL</Avatar>
            <Avatar style={{ backgroundColor: '#87d068' }} alt='Youself Zhang'>YZ</Avatar>
        </AvatarGroup>
    </div>
);
```

可以通过 `maxCount` 设置展示的头像数量。

```jsx live=true
import React from 'react';
import { AvatarGroup, Avatar } from '@douyinfe/semi-ui';

() => (
    <div>
        <AvatarGroup maxCount={3}>
            <Avatar color="red" alt='Lisa LeBlanc'>LL</Avatar>
            <Avatar alt='Caroline Xiao'>CX</Avatar>
            <Avatar color="amber" alt='Rafal Matin'>RM</Avatar>
            <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} alt='Zank Lance'>ZL</Avatar>
            <Avatar style={{ backgroundColor: '#87d068' }} alt='Youself Zhang'>YZ</Avatar>
        </AvatarGroup>
    </div>
);
```

可以通过 `renderMore` 自定义 more 标签。

```jsx live=true
import React from 'react';
import { AvatarGroup, Avatar, Popover } from '@douyinfe/semi-ui';

function Demo() {
    const renderMore = (restNumber, restAvatars) => {
        const content = restAvatars.map((avatar, index) => {
            return (
                <div style={{ paddingBottom: '12px' }} key={index}>
                    {React.cloneElement(avatar, { size: 'extra-small' })}
                    <span style={{ marginLeft: 8, fontSize: 14 }}>这是段文字描述</span>
                </div>
            );
        });
        return (
            <Popover
                content={content}
                autoAdjustOverflow={false}
                position={'bottomRight'}
                style={{ padding: '12px 8px', paddingBottom: 0 }}
            >
                <Avatar>{`+${restNumber}`}</Avatar>
            </Popover>
        );
    };

    return (
        <AvatarGroup maxCount={3} renderMore={renderMore}>
            <Avatar color="red" alt='Lisa LeBlanc'>LL</Avatar>
            <Avatar alt='Caroline Xiao'>CX</Avatar>
            <Avatar color="amber" alt='Rafal Matin'>RM</Avatar>
            <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} alt='Zank Lance'>ZL</Avatar>
            <Avatar style={{ backgroundColor: '#87d068' }} alt='Youself Zhang'>YZ</Avatar>
        </AvatarGroup>
    );
}
```

可以通过 `overlapFrom` 控制头像组的覆盖方式。可选值有 `start` 和 `end`，分别表示左边覆盖右边和右边覆盖左边。默认值为 `start`。

```jsx live=true
import React from 'react';
import { AvatarGroup, Avatar } from '@douyinfe/semi-ui';

() => (
    <div>
        <div>
            <AvatarGroup overlapFrom={'start'}>
                <Avatar color="red" alt='Lisa LeBlanc'>LL</Avatar>
                <Avatar alt='Caroline Xiao'>CX</Avatar>
                <Avatar color="amber" alt='Rafal Matin'>RM</Avatar>
                <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} alt='Zank Lance'>ZL</Avatar>
                <Avatar style={{ backgroundColor: '#87d068' }} alt='Youself Zhang'>YZ</Avatar>
            </AvatarGroup>
        </div>
        <div>
            <AvatarGroup overlapFrom={'end'}>
                <Avatar color="red" alt='Lisa LeBlanc'>LL</Avatar>
                <Avatar alt='Caroline Xiao'>CX</Avatar>
                <Avatar color="amber"  alt='Rafal Matin'>RM</Avatar>
                <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} alt='Zank Lance'>ZL</Avatar>
                <Avatar style={{ backgroundColor: '#87d068' }} alt='Youself Zhang'>YZ</Avatar>
            </AvatarGroup>
        </div>
    </div>
);
```

## API 参考

---

### Avatar

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| alt | 图像的替代文本描述 | string | - |
| className | 类名 | string | - |
| color | 指定头像的颜色，支持 `amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow` | string | `grey` |
| hoverMask | hover 时头像内容覆盖层 | ReactNode | - |
| imgAttr | 原生 img 属性 **>=1.5.0** | React.ImgHTMLAttributes<HTMLImageElement\> | - |
| shape | 指定头像的形状，支持 `circle`、`square` | string | `circle` |
| size | 设置头像的大小，支持 `extra-extra-small`、`extra-small`、`small`、`default`、`medium`、`large`、`extra-large` | string | `medium` |
| src | 图片类头像的资源地址 | string | - |
| srcSet | 设置图片类头像响应式资源地址 | string | - |
| style | 样式名 | CSSProperties | - |
| onClick | 单击头像的回调 | (e: Event) => void | - |
| onError | 图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为 | (e: Event) => boolean | - |
| onMouseEnter | MouseEnter 事件的回调 | (e: Event) => void | - |
| onMouseLeave | MouseLeave 事件的回调 | (e: Event) => void | - |

### AvatarGroup

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| maxCount | 最大数量限制，超出后显示+N | number | - |
| overlapFrom | 设置头像覆盖方向，支持 `start`, `end` | string | `start` |
| renderMore | 自定义渲染 more 标签 | (restNumber: number, restAvatars: ReactNode[]) => ReactNode | - |
| shape | 指定头像的形状，支持`circle`、`square` | string | `circle` |
| size | 设置头像的大小，支持 `extra-extra-small`, `extra-small`、`small`、`default`、`medium`、`large`、`extra-large` | string | `medium` |

## Accessibility

- Avatar 一般不用于操作，不需要被获取焦点。但当 Avatar 可以被点击操作时（如：Semi 官网上方的头像）需要被聚焦，并响应键盘 `Enter` 事件。
- 当 Avatar 与其他组件结合使用时，需要同时检查该组件的可访问性指南。
- Avatar的`alt`属性可以被屏幕阅读器读取，使用头像组件时，请使用`alt` 属性解释头像的内容。
```jsx
import React from 'react';
import { Avatar } from '@douyinfe/semi-ui';

() => {
    return (
        <>
            {/* Good case */ }
            <Avatar
                alt="一只可爱的猫咪"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png"
                style={{ margin: 4 }}
            />
            <Avatar
                alt="姜鹏志"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png"
                style={{ margin: 4 }}
            />
            {/* Bad case */ }
            <Avatar
                alt=""
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png"
                style={{ margin: 4 }}
            />
            <Avatar
                alt="姜鹏志的图片"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png"
                style={{ margin: 4 }}
            />
        </>
    );
};
```

## 设计变量

<DesignToken/>
