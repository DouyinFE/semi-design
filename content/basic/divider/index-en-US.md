---
localeCode: en-US
order: 0
category: Basic
title:  Divider
icon: doc-divider
brief: Divider is a linear, lightweight component used to logically organize element content and page structure or areas.
---

## Demos

### How to import

```jsx import
import { Divider } from '@douyinfe/semi-ui';
```

### Basic Usage

```jsx live=true
import React from 'react';
import { Divider } from '@douyinfe/semi-ui';

() => {

    return (
        <div>
            <h3>Horizontal Solid Line</h3>
            <span>Top</span>
            <Divider margin='12px'/>
            <span>Bottom</span>

            <h3>Horizontal Dashed Line</h3>
            <span>Top</span>
            <Divider dashed={true} margin='12px'/>
            <span>Bottom</span>

            <h3>Vertical Solid Line</h3>

            <div>
                <span>Left</span>
                <Divider layout="vertical" margin='12px'/>
                <span>Middle</span>
                <Divider layout="vertical" margin='12px'/>
                <span>Right</span>
            </div>

            <h3>Vertical Dashed Line</h3>
            <div>
                <span>Left</span>
                <Divider layout="vertical" dashed={true} margin='12px'/>
                <span>Middle</span>
                <Divider layout="vertical" dashed={true} margin='12px'/>
                <span>Right</span>
            </div>

        </div>
    );
};

```

### 包含内容

```jsx live=true
import React from 'react';
import { Divider, Typography } from '@douyinfe/semi-ui';

() => {

    return (
        <div>
            <Divider margin='12px' align='left'>
                Left Text
            </Divider>

            <Divider margin='12px' align='center'>
                Center Text
            </Divider>

            <Divider margin='12px' align='right'>
                Right Text
            </Divider>

            <Divider margin='12px'>
                <IconTiktokLogo/>
            </Divider>
        </div>
    );
};


```

## API Reference

| 属性        | 说明                                                            | 类型          | 默认值     |
|-----------|---------------------------------------------------------------|-------------|---------|
| align     | Content Align Mode                                            | left \| center \| right | center      |
| children  | Content                                                       | ReactNode   | -       | 
| className | ClassName                                                     | string      | -       |
| dashed    | Whether is dashed                                             | boolean     | false   |
| layout    | Divider Direction                                             | horizontal \| vertical | horizontal    |
| margin    | Vertical (Horizontal if in horizontal mode) margin of divider | number \| string  | -        |
| style     | Custom Style                                                  | CSSProperties | -       |

## Design Tokens
<DesignToken/>
