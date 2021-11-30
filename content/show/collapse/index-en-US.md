---
localeCode: en-US
order: 45
category: Show
title: Collapse
subTitle: Collapse
icon: doc-accordion
brief: Display content areas can be expanded or folded.
---

## Demos

### How to import

```jsx import
import { Collapse } from '@douyinfe/semi-ui';
```

### Basic Usage

You can expand multiple panels at the same time, and use `defaultActiveKey` to set the panel to expand by default.

```jsx live=true
import React from 'react';
import { Collapse } from '@douyinfe/semi-ui';

() => (
    <Collapse>
        <Collapse.Panel header="This is panel header 1" ItemKey="1">
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
        <Collapse.Panel header="This is panel header 2" itemKey="2">
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
        <Collapse.Panel header="This is panel header 3" itemKey="3">
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
    </Collapse>
);
```

### Accordion

Use `accordion` to restrict one panel only to be expanded at one time.

```jsx live=true
import React from 'react';
import { Collapse } from '@douyinfe/semi-ui';

() => (
    <Collapse accordion>
        <Collapse.Panel header="This is panel header 1" itemKey="1">
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
        <Collapse.Panel header="This is panel header 2" itemKey="2">
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
        <Collapse.Panel header="This is panel header 3" itemKey="3">
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
    </Collapse>
);
```

### Custom Icon

You can use `expandIcon` to set the expanding icon and `collapseIcon` for folded icon.

```jsx live=true
import React from 'react';
import { Collapse } from '@douyinfe/semi-ui';
import { IconPlus, IconMinus } from '@douyinfe/semi-icons';

() => (
    <Collapse expandIcon={<IconPlus />} collapseIcon={<IconMinus />}>
        <Collapse.Panel header="This is panel header 1" itemKey="1">
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
        <Collapse.Panel header="This is panel header 2" itemKey="2">
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
        <Collapse.Panel header="This is panel header 3" itemKey="3">
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
    </Collapse>
);
```

### Custom Extra Content on the Right-upper Corner

You can use `extra` to set extra content on the right-upper corner.

**Only works when `header` is string. If `header` is a ReactNode, it will take the entire header part including extra so that you could render whatever you need.**

```jsx live=true
import React from 'react';
import { Collapse, Tag } from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons';

() => (
    <Collapse>
        <Collapse.Panel header="This is panel header 1" itemKey="1" extra="1234">
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
        <Collapse.Panel header="This is panel header 2" itemKey="2" extra={<IconCopy />}>
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
        <Collapse.Panel
            header="This is panel header 3"
            itemKey="3"
            extra={
                <Tag color="violet" style={{ margin: 0 }}>
                    {' '}
                    Recommended{' '}
                </Tag>
            }
        >
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
    </Collapse>
);
```

## API reference

### Collapse

| Properties | Instructions | type | Default | version |
| --- | --- | --- | --- | --- |
| accordion | Accordion mode | boolean | `false` | - |
| activeKey | Controlled property, key of the currently expanded panel | string \| string[] | - | - |
| className | className of Collapse | string | '' | - |
| collapseIcon | Custom collapsing icons | ReactNode | `<IconChevronDown />` | - |
| defaultActiveKey | Key of the expanded panel when initialized | string \| string[] | - | - |
| expandIcon | Custom expanding icon | ReactNode | `<IconChevronUp />` | - |
| keepDOM | Whether to keep the hidden panel in DOM tree, destroyed by default | boolean | `false` | 0.25.0 |
| motion | Toggle whether to have animation | object \| boolean | `true` | 1.4.0 |
| expandIconPosition | Expand icon position | `left`, `right` | `right` | 1.12.0 |
| style | Inline CSS style | CSSProperties | {} | - |
| onChange | Callback function when switching panel | function(activeKey: string \| string[], e: event) | - | - |

### Collapse.Panel
| Properties | Instructions | type | Default |version|
| --- | --- | --- | --- | --- |
| className | className of Panel | string | - ||
| extra | Custom rendering of the auxiliary content in the upper right-hand corner of each panel(only work when header is string) | ReactNode | - ||
| header | Panel head content | ReactNode | - | - ||
| itemKey | Required and must be unique, used to match `activeKey`, `defaultActiveKey` | string | - ||
| reCalcKey | When reCalcKey changes, the height of children will be reset. Used for optimize dynamic content rendering. | string \| number |-| 1.5.0 |
| style | inline CSS style | CSSProperties | - ||

## Design Tokens

<DesignToken/>

## FAQ

-   ##### Why is the data in Form cleared when using Collapse?

    When Collapse is collapsed, the related DOM is destroyed and so are the fields data stored in Form. You could set `keepDOM=true` to keep the DOM from being destroyed.

-   ##### Collapse.Header as a whole is used as a click hot zone for folding and expanding. If a custom element (such as Input) is placed in the Header, it will cause Collapse to collapse/expand when clicked. How to avoid it?
    You can prevent the event from bubbling to Collapse.Header in the onClick event callback of the custom element. If the custom element does not provide an event object, wrap a layer of div to prevent bubbling in the div onClick.

```jsx
import React from 'react';
import { Collapse, Input } from '@douyinfe/semi-ui';

() => (
    <Collapse>
        <Collapse.Panel
            header={
                <div style={{ display: 'inline-flex' }} onClick={e => e.stopPropagation()}>
                    <span>Panel header</span>
                    <Input />
                </div>
            }
            itemKey="1"
        >
            <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
        </Collapse.Panel>
    </Collapse>
);
```
