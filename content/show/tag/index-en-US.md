---
localeCode: en-US
order: 57
category: Show
title: Tag
subTitle: Tag
icon: doc-tag
brief: Tag component is used to display a collection of concise information for rapid identification and grouping.
---

## Demos

### How to import

```jsx import
import { Tag } from '@douyinfe/semi-ui';
```

### Basic usage

To use this tag, just wrap the content with the `<Tag>` tag.  
It can be turned into a closable label by adding the `closable` property.  
At this time, clicking x to close will trigger the onClose event, and blocking the default event in onClose can make it still show and not hide after clicking

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

### Size

Supports two sizes: `large` and `small` (default).

```jsx live=true
import React from 'react';
import { Tag } from '@douyinfe/semi-ui';

() => (
    <div>
        <Tag size="small" style={{ marginRight: 8 }}>
            small tag
        </Tag>
        <Tag size="large"> large tag </Tag>
    </div>
);
```

### Color

Tag supports 16 colors including whites from Semi's palette: `amber`, `blue`, `cyan`, `green`, `grey`, `indigo`, `light-blue`, `light-green`, `lime`, `orange`, `pink`, `purple`, `red`, `teal`, `violet`, `yellow`, `white`. You can also customize color through `style`.

```jsx live=true
import React from 'react';
import { Tag, Space } from '@douyinfe/semi-ui';

() => {
    return (
        <Space wrap>
            <Tag color="grey" >
                grey tag
            </Tag>
            <Tag color="blue" >
                blue tag
            </Tag>
            <Tag color="red" >
                red tag
            </Tag>
            <Tag color="green" >
                green tag
            </Tag>
            <Tag color="orange" >
                orange tag
            </Tag>
            <Tag color="teal" >
                teal tag
            </Tag>
            <Tag color="violet" >
                violet tag
            </Tag>
            <Tag color="white" >
                white tag
            </Tag>
        </Space>
    );
};
```

### Type

Tag supports three different types, including: `light`(default), `ghost`, `solid`.

```jsx live=true
import React from 'react';
import { Tag, Space } from '@douyinfe/semi-ui';

() => (
    <Space>
        <Tag color="blue" type="light">
            light tag
        </Tag>
        <Tag color="blue" type="ghost">
            ghost tag
        </Tag>
        <Tag color="blue" type="solid">
            solid tag
        </Tag>
    </Space>
);
```

### Avatar Tag

You can get a avatar tag with `avatarSrc` property. `avatarShape` can change the shape of avatar tag including `square`(default) and `circle`.

```jsx live=true
import React from 'react';
import { Tag, Space } from '@douyinfe/semi-ui';

function Demo() {
    const src =
        'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/avatarDemo.jpeg';
    return (
        <Space vertical align='start'>
            <Tag avatarSrc={src}>Peter Behrens</Tag>
            <Tag avatarSrc={src} size="large">
                Peter Behrens
            </Tag>
            <Tag avatarSrc={src} size="large" closable={true}>
                Peter Behrens
            </Tag>
            <Tag avatarSrc={src} avatarShape="circle">
                Peter Behrens
            </Tag>
            <Tag avatarSrc={src} avatarShape="circle" size="large">
                Peter Behrens
            </Tag>
            <Tag avatarSrc={src} avatarShape="circle" size="large" closable={true}>
                Peter Behrens
            </Tag>
        </Space>
    );
}
```

### Invisible

You can use `visible` property to control whether the tag is visible.

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
            <Button onClick={toggleVisible}>{visible ? 'Hide Tag' : 'Show Tag'}</Button>
            <div style={{ marginTop: 10 }}>
                <Tag visible={visible}>Invisible tag </Tag>
            </div>
        </div>
    );
};
```

### TagGroup

You can pass in configs for tags through `tagList` to create a TagGroup. The `maxTagCount` can be used to cap the number of list and will be displayed as `+N` when the limit is exceeded.  
Set the `showPopover` property to control whether the remaining content is displayed by Popover when hover to + N Tag

```jsx live=true
import React from 'react';
import { TagGroup } from '@douyinfe/semi-ui';

() => {
    const tagList = [
        { color: 'white', children: 'Tiktok' },
        { color: 'white', children: 'Hotsoon' },
        { color: 'white', children: 'Toutiao' },
        { color: 'white', children: 'Vigo' },
        { color: 'white', children: 'Pipixia' },
    ];
    const src =
        'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/avatarDemo.jpeg';
    const tagList2 = [
        { color: 'white', children: 'Tiktok', avatarSrc: src },
        { color: 'white', children: 'Hotsoon', avatarSrc: src },
        { color: 'white', children: 'Toutiao', avatarSrc: src },
        { color: 'white', children: 'Vigo', avatarSrc: src },
        { color: 'white', children: 'Pipixia', avatarSrc: src },
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
                    size="large"
                />
            </div>
            <div style={divStyle}>
                <TagGroup
                    maxTagCount={2}
                    style={tagGroupStyle}
                    tagList={tagList2}
                    size="large"
                    avatarShape="circle"
                    showPopover
                />
            </div>
        </>
    );
};
```

## API Reference

### Tag

| Properties | Instructions | type | Default | Version |
| --- | --- | --- | --- | --- |
| avatarShape | Shape of avatar tag, one of `square` and `circle` | string | `square` | 1.6.0 |
| avatarSrc | Source address of avatar tag | string | - | 1.6.0 |
| className | Class name | string |  |  |
| closable | Toggle whether the tag can be closed | boolean | false |  |
| color | Color of tags, one of `amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow`、 `white` | string | `grey` |  |
| size | Size, one of `small`, `large` | string | `small` |  |
| style | Inline style | object |  |  |
| type | Style type, one of `ghost`, `solid`, `light` | string | `light` |  |
| visible | Toggle the visibility of the tag | boolean | true |  |
| onClick | Callback function when clicking the tag | (e: MouseEvent) => void | - |  |
| onClose | Callback function when the tag is closed | (tagChildren: ReactNode, e: MouseEvent) => void | - |  |
### TagGroup

| Properties | Instructions | type | Default | Version |
| --- | --- | --- | --- | --- |
| avatarShape | Shape of avatar tag, one of `square` and `circle` | string | `square` | 1.6.0 |
| className | Class name | string |  |  |
| maxTagCount | Cap number to display, shown as + N when exceeded | number |  |  |
| popoverProps | Popover configuration properties, you can control the popup props like `direction`, `zIndex`, `trigger`, refer to [Popover](/en-US/components/popover#API) | PopoverProps | {} |  |
| showPopover | When hover to + N, whether to display the remaining content through Popover | boolean | false |  |
| size | Size, one of `small`, `large` | string | `small` |  |
| style | Inline style | CSSProperties |  |  |
| tagList | Label Group data | (TagProps \| React.ReactNode)[] |  |  |

## Design Tokens

<DesignToken/>

<!-- ## Related Material

```material
53
``` -->
