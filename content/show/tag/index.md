---
localeCode: zh-CN
order: 57
category: 展示类
title:  Tag 标签
icon: doc-tag
brief: 标签是图形化标记界面上的元素的组件，达到快速识别、分组的目的。
---


## 代码演示

### 如何引入

```jsx import
import { Tag, TagGroup } from '@douyinfe/semi-ui';
```


### 基本用法

基本标签用法，将内容使用 `<Tag>` 标签包裹即可。  
可以通过添加 `closable` 属性将其变为可关闭标签，此时点击x关闭会触发 onClose 事件，在 onClose 中阻止默认事件可以使其点击后依然显示不隐藏    

```jsx live=true
import React from 'react';
import { Tag, Space } from '@douyinfe/semi-ui';

() => (
    <div>
        <Space>
            <Tag> default tag </Tag>
            <Tag closable> Closable Tag </Tag>
            <Tag closable onClose={(value, e) => e.preventDefault()}>
                Closable Tag, Prevent Default
            </Tag>
        </Space>
    </div>
);
```

### 尺寸

默认定义了两种尺寸：大、小（默认）。

```jsx live=true
import React from 'react';
import { Tag, Space } from '@douyinfe/semi-ui';

() => (
    <Space>
        <Tag size='small'> small tag </Tag>
        <Tag size='large'> large tag </Tag>
    </Space>
);
```

### 颜色

标签支持默认色板的 16 种颜色和白色，包括：`amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow`、 `white`，也可以通过 style 来自定义颜色样式。

```jsx live=true
import React from 'react';
import { Tag, Space } from '@douyinfe/semi-ui';

() => (
    <Space wrap>
        <Tag color='grey'> grey tag </Tag>
        <Tag color='blue'> blue tag </Tag>
        <Tag color='red'> red tag </Tag>
        <Tag color='green'> green tag </Tag>
        <Tag color='orange'> orange tag </Tag>
        <Tag color='teal'> teal tag </Tag>
        <Tag color='violet'> violet tag </Tag>
        <Tag color='white'> white tag </Tag>
    </Space>
);
```

### 样式类型

标签支持三种样式类型，包括浅色底色 `light`，白色底色 `ghost`，深色底色 `solid`；默认值为 `light`。

```jsx live=true
import React from 'react';
import { Tag, Space } from '@douyinfe/semi-ui';

() => (
    <Space>
        <Tag color='blue' type='light'> light tag </Tag>
        <Tag color='blue' type='ghost'> ghost tag </Tag>
        <Tag color='blue' type='solid'> solid tag </Tag>
    </Space>
);
```

### 头像标签

设置 `avatarSrc` 可以生成头像标签。结合 `avatarShape` 可以调整头像标签的形状，支持 `square` 和 `circle`。

```jsx live=true
import React from 'react';
import { Tag, Space } from '@douyinfe/semi-ui';

function Demo() {
    const src = 'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/avatarDemo.jpeg';
    return (
        <Space vertical align='start'>
            <Tag avatarSrc={src}>焦锐志</Tag>
            <Tag avatarSrc={src} size='large'>焦锐志</Tag>
            <Tag avatarSrc={src} size='large' closable={true}>焦锐志</Tag>
            <Tag avatarSrc={src} avatarShape='circle'>焦锐志</Tag>
            <Tag avatarSrc={src} avatarShape='circle' size='large'>焦锐志</Tag>
            <Tag avatarSrc={src} avatarShape='circle' size='large' closable={true}>焦锐志</Tag>
        </Space>
    );
}
```

### 不可见的

通过 visible 属性控制标签是否可见。

```jsx live=true
import React, { useState } from 'react';
import { Tag, Button } from '@douyinfe/semi-ui';

() => {
    const [visible, setVisible] = useState(false);
    const toggleVisible = () => {
        setVisible(!visible);
    };
    return (
        <div>
            <Button onClick={toggleVisible}>{visible ? 'Hide Tag': 'Show Tag'}</Button>
            <div style={{marginTop:10}}>
                <Tag visible={visible}>Invisible tag </Tag>
            </div>
        </div>
    );
};
  
```

### TagGroup使用

在 TagGroup 内通过 `tagList` 传入 tags 配置，并且设置 `maxTagCount` 属性, 超出数量限制后，会显示为 +N  
通过设置 `showPopover` 属性，来控制 hover 到 +N Tag 时，是否通过 Popover 显示剩余内容

```jsx live=true
import React from 'react';
import { TagGroup } from '@douyinfe/semi-ui';

() => {
    const tagList = [
        { color: 'white', children:'抖音'},
        { color: 'white', children:'火山小视频'},
        { color: 'white', children:'剪映'},
        { color: 'white', children:'皮皮虾'},
    ];
    const src = 'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/avatarDemo.jpeg';
    const tagList2 = [
        { color: 'white', children:'Douyin', avatarSrc:src},
        { color: 'white', children:'Hotsoon', avatarSrc:src},
        { color: 'white', children:'Capcut', avatarSrc:src},
        { color: 'white', children:'Pipixia', avatarSrc:src},
    ];
    const divStyle = {
        backgroundColor: 'var(--semi-color-fill-0)',
        height: 35,
        width: 300,
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        marginBottom: 30,
    };
    const tagGroupStyle = {
        display: 'flex',
        alignItems: 'center',
        width: 350,
    };
    return (
        <>
            <div style={divStyle}>
                <TagGroup
                    maxTagCount={3}
                    style={tagGroupStyle}
                    tagList={tagList}
                    size='large'
                />
            </div>
            <div style={divStyle}>
                <TagGroup
                    maxTagCount={2}
                    style={tagGroupStyle}
                    tagList={tagList2}
                    size='large'
                    avatarShape='circle'
                    showPopover
                />
            </div>
        </>
    );
};

```

## API参考

### Tag

| 属性  | 说明        | 类型   | 默认值 | 版本 |
|-------|-------------|-----------------|--------|--------|
| avatarShape | 头像 Tag 形状，可选 `square` 和 `circle` | string |  `square`   | 1.6.0|
| avatarSrc | 头像的资源地址 | string |  -   | 1.6.0 |
| className | 类名 | string |     | |
| closable | 标签是否可以关闭 | boolean  |  false   | |
| color  | 标签的颜色，可选 `amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow`、 `white` | string  | `grey`| |
| size | 标签的尺寸，可选 `small`、 `large` | string | `small` | |
| style | 样式 | CSSProperties |     | |
| type  | 标签的样式类型，可选 `ghost`、 `solid`、 `light` | string  | `light`     | |
| visible | 标签是否可见 | boolean | true    | |
| onClick | 单击标签时的回调函数 | (e: MouseEvent) => void | 无   | |
| onClose | 关闭标签时的回调函数 | (tagChildren: ReactNode, e: MouseEvent) => void | 无    | e于v1.18版本提供 |

### TagGroup

| 属性  | 说明        | 类型   | 默认值 | 版本 |
|-------|-------------|-----------------|--------|--------|
| avatarShape | 头像 Tag 形状，可选 `square` 和 `circle` | string |  `square` | 1.6.0 |
| className | 类名 | string |     | |
| maxTagCount | 最大数量限制，超出后显示为 +N | number |     | |
| popoverProps | popover 的配置属性，可以控制 direction, zIndex, trigger 等，具体参考 [Popover](/zh-CN/show/popover#API_参考) | PopoverProps | {} | |
| showPopover | hover 到 +N 时，是否通过 Popover 显示剩余内容 | boolean | false | |
| size | 标签的尺寸，可选 `small`、 `large` | string | `small` | |
| style | 样式 | CSSProperties |     | |
| tagList | 标签组  | (TagProps \| React.ReactNode)[] |     | |

## 设计变量
<DesignToken/>

<!-- ## 相关物料
```material
53
``` -->