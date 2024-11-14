---
localeCode: en-US
order: 21
category: Basic
title: Icon
subTitle: Icon
icon: doc-icons
brief: Semantic vector graphics.
---

## Icon List
```icon
```

## Demos

### How to import

```jsx import
import Icon, { IconHome } from '@douyinfe/semi-icons';
```

### Basic usage
Import icons from the `@douyinfe/semi-icons` package

```jsx live=true
import React from 'react';
import { IconHome } from '@douyinfe/semi-icons';

() => <IconHome />;

```


### Rotate & Spin
Introduce icons from the `@douyinfe/semi-icons` package, with its own size, rotation, and spin functions

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

### Size
>
You can change the `font-size` to change the icon size
>

The Icon component encapsulates the size attribute, which makes it easier to define the icon size. It supports `extra-small` (8x8), `small` (12x12), `default` (16x16), `large` (20x20), `extra-large `(24x24), When size is specified as `inherit`, the icon size inherits the current context font size.


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

### Color
The icon will automatically inherit the `color` property of the external container CSS
You can also modify the color of the icon by setting style props to the Icon.

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

### Custom icon
You can use custom icons to pass in Icon components
Icon component supports size, rotate, spin and other attributes

```jsx live=true
import React from 'react';
import { Icon } from '@douyinfe/semi-ui';

() => {
    function CustomIcon() {
        return <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="#FBCD2C"/>
            <mask id="mask0" masktype="alpha" maskUnits="userSpaceOnUse" x="1" y="1" width="22" height="22">
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

### Use svgr to convert svg files into ReactComponent
If the icons provided by Semi are not enough to meet business needs, you can also introduce custom icons through @svgr/webpack and use them as React components

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



## API reference

### Icon

| Properties  | Illustrate        | Type            | Default |
|-------|-------------|-----------------|--------|
| className | class name | string | none |
| onClick | Callback event of clicking the icon | (e: Event) => void | None |
| onMouseDown | The callback event of mouse button press >=v1.21 | (e: Event) => void | None |
| onMouseEnter | Callback event of entering icon | (e: Event) => void | None |
| onMouseLeave | Callback event of leaving icon | (e: Event) => void | None |
| onMouseMove | Callback event of moving the mouse >=v1.21 | (e: Event) => void | None |
| onMouseUp | Callback event when the mouse button is raised >=v1.21 | (e: Event) => void | None |
| rotate | degree of rotation | number | |
| size | Size, supports `inherit`, `extra-small`, `small`, `default`, `large`, `extra-large` | string | `default` |
| spin | spin animation | boolean | |
| style | Icon style | CSSProperties | None |
| svg | Icon content | ReactNode | None |

## Accessibility

### ARIA

- The Icon component role is img, and its aria-label defaults to the component's file name

```jsx live=true
import React from 'react';
import { IconHome } from '@douyinfe/semi-icons';

() => <IconHome aria-label="back to homepage" />;
```

- The svg element inside Icon is a decorative element, and aria-hidden is set by default to prevent it from being read by screen readers