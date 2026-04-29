---
localeCode: en-US
order: 82
category: Show
title: Tag
subTitle: Tag
icon: doc-tag
brief: Tag component is used to display a collection of concise information for rapid identification and grouping.
---

## Demos

### How to import

```jsx import
import { Tag, TagGroup, SplitTagGroup } from '@douyinfe/semi-ui';
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
import { Tag, Space } from '@douyinfe/semi-ui';

() => (
    <Space>
        <Tag size="small" color='light-blue'> small tag </Tag>
        <Tag size="large" color='cyan'> large tag </Tag>
    </Space>
);
```

### Shape

Supports two Shape: `square`（default）、`circle`。

```jsx live=true
import React from 'react';
import { Tag, Space } from '@douyinfe/semi-ui';

() => (
    <Space>
        <Tag size="small" shape='circle' color='amber'> small circle tag </Tag>
        <Tag size="large" shape='circle' color='violet'> large circle tag </Tag>
    </Space>
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
            {
                ['amber', 'blue', 'cyan', 'green', 'grey', 'indigo',  
                    'light-blue', 'light-green', 'lime', 'orange', 'pink',  
                    'purple', 'red', 'teal', 'violet', 'yellow', 'white'
                ].map(item => (<Tag color={item} key={item}> {item} </Tag>))
            }
        </Space>
    );
};
```

### SplitTagGroup

Use `SplitTagGroup` to combine multiple tags into a whole. The first and last tags will have rounded corners, while the middle tags have no rounded corners, creating a continuous visual effect.

```jsx live=true
import React from 'react';
import { Tag, SplitTagGroup, Space } from '@douyinfe/semi-ui';

() => {
    return (
        <Space vertical align="start">
            <SplitTagGroup>
                <Tag color="blue" type="solid">Tag One</Tag>
                <Tag color="cyan" type="solid">Tag Two</Tag>
                <Tag color="teal" type="solid">Tag Three</Tag>
            </SplitTagGroup>
            
            <SplitTagGroup>
                <Tag color="violet" shape="circle">Grouped</Tag>
                <Tag color="purple" shape="circle">Tags</Tag>
                <Tag color="pink" shape="circle">Example</Tag>
                <Tag color="red" shape="circle">Effect</Tag>
            </SplitTagGroup>
            
            <SplitTagGroup>
                <Tag color="amber" type="light">Light</Tag>
                <Tag color="orange" type="light">Grouped</Tag>
                <Tag color="yellow" type="light">Tags</Tag>
            </SplitTagGroup>
            
            <SplitTagGroup>
                <Tag color="green" type="ghost">Ghost</Tag>
                <Tag color="light-green" type="ghost">Style</Tag>
                <Tag color="lime" type="ghost">Group</Tag>
            </SplitTagGroup>
        </Space>
    );
};
```

## API Reference

### Tag

| Properties | Instructions | type | Default | Version |
| --- | --- | --- | --- | --- |
| avatarShape | Shape of avatar tag, one of `square` and `circle` | string | `square` | - |
| avatarSrc | Source address of avatar tag | string | - | - |
| className | Class name | string |  |  |
| closable | Toggle whether the tag can be closed | boolean | false |  |
| color | Color of tags, one of `amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow`、 `white` | string | `grey` |  |
| colorful | Colorful labels | boolean | false | 2.86.0|
| gradient | Whether it is a gradient color, it needs to take effect when colorful is true | boolean | false | 2.86.0|
| prefixIcon | prefix icon | ReactNode | | 2.44.0 |
| suffixIcon | suffix icon | ReactNode | | 2.44.0 |
| shape | Shape of tag, one of `square`、 `circle` | string | `square` | 2.20.0 |
| size | Size, one of `small`, `large` | string | `small` |  |
| style | Inline style | object |  |  |
| type | Style type, one of `ghost`, `solid`, `light` | string | `light` |  |
| visible | Toggle the visibility of the tag | boolean | true |  |
| tagKey  | The key required by React, as the unique identifier of each tag, does not allow repetition | string | number | |
| onClick | Callback function when clicking the tag | (e: MouseEvent) => void | - |  |
| onClose | Callback function when the tag is closed | (tagChildren: ReactNode, e: MouseEvent, tagKey: string \| number ) => void | - | tagKey is available in v2.18.0 |

### TagGroup

| Properties | Instructions | type | Default | Version |
| --- | --- | --- | -- | --- |
| avatarShape | Shape of avatar tag, one of `square` and `circle` | string | `square` | - |
| className | Class name | string |  |  |
| maxTagCount | Cap number to display, shown as + N when exceeded | number |  |  |
| popoverProps | Popover configuration properties, you can control the popup props like `direction`, `zIndex`, `trigger`, refer to [Popover](/en-US/components/popover#API) | PopoverProps | {} |  |
| showPopover | When hover to + N, whether to display the remaining content through Popover | boolean | false |  |
| size | Size, one of `small`, `large` | string | `small` |  |
| style | Inline style | CSSProperties |  |  |
| tagList | Label Group data | (TagProps)[] |  |  |
| onTagClose | The callback function when deleting the Tag in the TagGroup | (tagChildren: ReactNode, e: MouseEvent, tagKey: string \| number ) => void | - |  2.18.0 |

### SplitTagGroup

| Property | Description | Type | Default | Version |
|-------|-------------|--------------|----|--------|
| className | Classname | string |    | |
| style | Inline style | CSSProperties |    | |
| children | Tag group content | ReactNode |     | |
| aria-label | Accessibility label | string | | |

## Accessibility

### ARIA

- `aria-label` is used to indicate the role of `Tag`, for deleteable or clickable `Tag` , we recommend using this attribute

### Keyboard and Focus

- If the current `Tag` is interactive, then this `Tag` can be focused. Such as:
   - When the `onClick` attribute is used, the keyboard user can activate this `Tag` with the `Enter` keys
   - When the `closable` property is `true`, keyboard users can delete this `Tag` by pressing the `Delete` key
   - When a `Tag` is focused, keyboard users can use the `Esc` key to defocus the currently focused `Tag`
   

## Content Guidelines
- Due to limited space, label text should be as short as possible
- avoid line breaks
- use sentence case

## Design Tokens

<DesignToken/>

<!-- ## Related Material

```material
53
``` -->
