---
localeCode: en-US
order: 48
category: Show
title: Description
subTitle: Descriptions
icon: doc-descriptions
dir: column
breif: The description list is used to render key-value pairs.
---

## Demos

### How to import

```jsx import
import { Descriptions } from '@douyinfe/semi-ui';
```

### Basic Usage

```jsx live=true dir="column"
import React from 'react';
import { Descriptions, Tag } from '@douyinfe/semi-ui';

() => {
    const data = [
        { key: 'Actual Users', value: '1,480,000' },
        { key: '7-day Rentention', value: '98%' },
        { key: 'Security Level', value: 'III' },
        { key: 'Category Tag', value: <Tag style={{ margin: 0 }}>E-commerce</Tag> },
        { key: 'Authorized State', value: 'Unauthorized' },
    ];
    return <Descriptions data={data} />;
};
```

### Alignment

You can use `align` to set alignment of key-value. Supporting values including: `center`(default), `justify`, `left`, and `plain`.

```jsx live=true dir="column"
import React from 'react';
import { Descriptions, Tag } from '@douyinfe/semi-ui';

() => {
    const data = [
        { key: 'Actual Users', value: '1,480,000' },
        { key: '7-day Rentention', value: '98%' },
        { key: 'Security Level', value: 'III' },
        { key: 'Category Tag', value: <Tag style={{ margin: 0 }}>E-commerce</Tag> },
        { key: 'Authorized State', value: 'Unauthorized' },
    ];
    const style = {
        boxShadow: 'var(--semi-shadow-elevated)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '4px',
        padding: '10px',
        margin: '10px',
        width: '240px',
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

### Row Display

Set `row` to display the data to two-row, supporting three sizes: `small`, `medium`(default), and `large`.

```jsx live=true dir="column"
import React from 'react';
import { Descriptions } from '@douyinfe/semi-ui';
import { IconArrowUp } from '@douyinfe/semi-icons';

() => {
    const data = [
        { key: 'Actual Users', value: '1,480,000' },
        {
            key: '7-day Rentention',
            value: (
                <span>
                    98%
                    <IconArrowUp size="small" style={{ color: 'red', marginLeft: '4px' }} />
                </span>
            ),
        },
        { key: 'Security Level', value: 'III' },
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

### Descriptions Using JSX

Version: >= 1.17.0

```jsx live=true dir="column"
import React from 'react';
import { Descriptions } from '@douyinfe/semi-ui';

() => {
    return (
        <Descriptions>
            <Descriptions.Item itemKey="Actual Users">1,480,000</Descriptions.Item>
            <Descriptions.Item itemKey="7-day Rentention">98%</Descriptions.Item>
            <Descriptions.Item itemKey="Security Level">III</Descriptions.Item>
            <Descriptions.Item itemKey="Category Tag">E-commerce</Descriptions.Item>
            <Descriptions.Item itemKey="Authorized State">Unauthorized</Descriptions.Item>
        </Descriptions>
    );
};
```

## API Reference

### Descriptions

| Properties | Instructions                                                               | type       | Default  |
| ---------- | -------------------------------------------------------------------------- | ---------- | -------- |
| align      | Alignment of the key-value data, one of `center`, `left`, `plain`          | string     | `center` |
| className  | Classname                                                                  | string     | -        |
| data       | Data to display                                                            | DataItem[] | -        |
| row        | Toggle whether to display data in double-row                               | boolean    | `false`  |
| size       | Size of the list for double-row display, one of `small`, `medium`, `large` | string     | `medium` |
| style      | Inline style                                                               | CSSProperties     | -        |

### DataItem

| Properties   | Instructions                                                      | type                        | Default |
| ------ | --------------------------------------------------------- | --------------------------- | ------ |
| key    | Required and unique                                       | ReactNode           | -      |
| value  | Data value                                                | ReactNode \| (() => ReactNode) | -      |
| hidden | Toggle whether the data should be displayed **v>=1.12.0** | boolean                     | -      |

### Descriptions.Item

**v>=1.17.0**

| Properties | Instructions                                | type              | Default |
| ---------- | ------------------------------------------- | ----------------- | ------- |
| itemKey    | Required and unique                         | ReactNode | -       |
| hidden     | Toggle whether the data should be displayed | boolean           | -       |
| className  | Classname                                   | string            | -       |
| style      | Inline style                                | CSSProperties     | -       |

## Design Tokens

<DesignToken/>
