---
localeCode: en-US
order: 43
category: Show
title:  Avatar
subTitle: avatar
icon: doc-avatar
brief: Avatar, used for image or text display.
---


## Demos

### How to import

```jsx import
import { Avatar, AvatarGroup } from '@douyinfe/semi-ui';
```
### Size

You can change the size of the avatars with `size` property. The following sizes are supported:  `extra-extra-small`(20x20), `extra-small`(24x24),`small`(32x32), `default`(40x40), `medium`(48x48), `large`(72x72), `extra-large`(128 x 128).

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

### Color

Avatars support 16 colors including `white`, `amber`, `blue`, `cyan`, `green`, `grey`, `indigo`, `light-blue`, `light-green`, `lime`, `orange`, `pink`, `purple`, `red`, `teal`, `violet`, and `yellow`. You can also use the `style` prop to customize styles. The default color is`grey`.

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

### Image

Image avatars can be created by using the `src` or `srcSet` prop.

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

### Shape

Avatars support two shapes: `circle` and `square`. The shape is default to `circle`.

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

### Event

Avatars support `onClick`,`onMouseEnter`,`onMouseLeave`. You can use the `hoverMask` prop to pass in overlay content for `hover` state.
The overlay has no default style.

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

### AvatarGroup

You can use `AvatarGroup` component to display avatars as a group.

```jsx live=true
import React from 'react';
import { Avatar, AvatarGroup } from '@douyinfe/semi-ui';

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

You can set the number of avatars to display with `maxCount` property.
```jsx live=true
import React from 'react';
import { Avatar, AvatarGroup } from '@douyinfe/semi-ui';

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

You can customize the more tag with `renderMore`.
```jsx live=true
import React from 'react';
import { Avatar, AvatarGroup, Popover } from '@douyinfe/semi-ui';

function Demo() {
    const renderMore = (restNumber, restAvatars) => {
        const content = (
            restAvatars.map((avatar, index) => {
                return (
                    <div style={{ paddingBottom: '12px' }} key={index}>
                        {React.cloneElement(avatar, { size: 'extra-small' })}
                        <span style={{ marginLeft: 8, fontSize: 14 }}>This is a sentence</span>
                    </div>
                );
            })
        );
        return (
            <Popover content={content} autoAdjustOverflow={false} position={'bottomRight'} style={{ padding: '12px 8px', paddingBottom: 0 }}>
                <Avatar>
                    {`+${restNumber}`}
                </Avatar>
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

You can set the coverage direction of the avatars with `overlapFrom`. It has two optional values A and B. The default value is `start`.
```jsx live=true
import React from 'react';
import { Avatar, AvatarGroup } from '@douyinfe/semi-ui';

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

## API Reference

---

### Avatar

| Properties   | Instructions                                                                                                                                                                              | type           | Default  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------- |
| alt          | Defines an alternative text description of the image.                                                                                                                                       | string         | -        |
| className    | Class name                                                                                                                                                                                | string         | -        |
| color        | Color of the avatar, one of `amber`, `blue`, `cyan`, `green`, `grey`, `indigo`, `light-blue`, `light-green`, `lime`, `orange`, `pink`, `rain`, `red`, `teal`, `violet`, `yellow`, `white` | string         | `grey`   |
| hoverMask    | Avatar content overlay when hover                                                                                                                                                         | ReactNode     | -        |
| imgAttr | Native html img attributes **>=1.5.0**| React.ImgHTMLAttributes<HTMLImageElement\> | - |
| shape        | Shape of the avatar, one of `circle`, `square`                                                                                                                                            | string         | `circle` |
| size         | Size of the avatar, one of `extra-extra-small`,`extra-small`, `small`, `default`, `medium`, `large`, `extra-large`                                                                                                       | string         | `medium` |
| src          | Resource address for imgage avatars                                                                                                                                                       | string         | -        |
| srcSet       | Set the image avatar responsive resource address                                                                                                                                          | string         | -        |
| style        | Style name                                                                                                                                                                                | CSSProperties         | -        |
| onClick      | Click the callback of the avatar.                                                                                                                                                         | (e: Event) => void       | -        |
| onError      | Image load failed event, returning false closes the default fallback behavior of the component                                                                                            | (e: Event) = > boolean | -        |
| onMouseEnter | Callback to onMouseEnter event                                                                                                                                                            | (e: Event) => void       | -        |
| onMouseLeave | Callback to onMouseLeave event                                                                                                                                                            | (e: Event) => void       | -        |

### AvatarGroup

| Properties | Instructions                                                                        | type   | Default  |
| ---------- | ----------------------------------------------------------------------------------- | ------ | -------- |
| maxCount | Display +N when the number of avatars exceeds this value | number | - |
| overlapFrom | Set the coverage direction of the avatars, one of `start`, `end` | string | `start` |
| renderMore | Customize the more tag  | (restNumber: number, restAvatars: ReactNode[]) => ReactNode | - |
| shape      | Shape of the avatar, one of `circle`, `square`                                      | string | `circle` |
| size       | Size of the avatar, one of `extra-extra-small`, `extra-small`, `small`, `default`, `medium`, `large`, `extra-large` | string | `medium` |

## Accessibility

- Avatars are generally not used for operations and do not need to be focused. But when the Avatar can be clicked (such as the avatar on the Semi official website), it needs to be focused and respond to the keyboard `Enter` event.
- When Avatar is used in combination with other components, also check the accessibility guidelines for that component.
- Avatar's `alt` attribute can be read by screen readers, when using the avatar component, please use the `alt` attribute to explain the content of the image.
```jsx
import React from 'react';
import { Avatar } from '@douyinfe/semi-ui';

() => {
    return (
        <>
            {/* Good case */ }
            <Avatar
                alt="A cut cat"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png"
                style={{ margin: 4 }}
            />
            <Avatar
                alt="Jiang Pengzhi"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png"
                style={{ margin: 4 }}
            />
            {/* Bad case: empty content */ }
            <Avatar
                alt=""
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png"
                style={{ margin: 4 }}
            />
            {/* Bad case: no need to include picture or image in alt */ }
            <Avatar
                alt="Picture of Jiang Pengzhi"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png"
                style={{ margin: 4 }}
            />
        </>
    );
};
```

## Design Tokens
<DesignToken/>
