---
localeCode: en-US
order: 48
category: Show
title: Dropdown
subTitle: Dropdown
icon: doc-dropdown
brief: A menu that pops down.
---

## Demos

### How to import

```jsx import
import { Dropdown } from '@douyinfe/semi-ui';
```

### Basic Usage

```jsx live=true
import React from 'react';
import { Dropdown, Tag } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <Dropdown
            render={
                <Dropdown.Menu>
                    <Dropdown.Item>Menu Item 1</Dropdown.Item>
                    <Dropdown.Item>Menu Item 2</Dropdown.Item>
                    <Dropdown.Item>Menu Item 3</Dropdown.Item>
                </Dropdown.Menu>
            }
        >
            <Tag>Hover Me</Tag>
        </Dropdown>
    );
}
```

### Nested Usage

Users can nested `Dropdown`, which is suitable for situations with multiple sublevel options.

```jsx live=true
import React, { useMemo } from 'react';
import { Dropdown, Tag } from '@douyinfe/semi-ui';

function Demo() {
    const subDropdown = useMemo(
        () => (
            <Dropdown.Menu>
                <Dropdown.Item>Menu Item 1</Dropdown.Item>
                <Dropdown.Item>Menu Item 2</Dropdown.Item>
                <Dropdown.Item>Menu Item 3</Dropdown.Item>
            </Dropdown.Menu>
        ),
        []
    );

    return (
        <div style={{ margin: 100 }}>
            <Dropdown
                render={
                    <Dropdown.Menu>
                        <Dropdown position={'rightTop'} render={subDropdown}>
                            <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        </Dropdown>
                        <Dropdown position={'leftTop'} render={subDropdown}>
                            <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        </Dropdown>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Tag>Hover Me</Tag>
            </Dropdown>
        </div>
    );
}
```

### Element Properties

By configuing `disabled` for `Dropdown.Item`, you can disabled an item.  
By configuring `type` on `Dropdown.Item`, you can display text in different colors.  
By configuring `icon` on `Dropdown.Item` (`icon` needs to be ReactNode), you can quickly configured icon of item.  

```jsx live=true
import React from 'react';
import { Dropdown, Button } from '@douyinfe/semi-ui';
import { IconBox, IconSimilarity, IconSetting, IconForward, IconColorPalette, IconRefresh, IconSearch, IconBranch } from '@douyinfe/semi-icons';

function Demo() {
    return (
        <div>
            <Dropdown
                trigger="custom"
                position="bottomLeft"
                visible
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item icon={<IconBox />}>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item icon={<IconSetting />}>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item disabled icon={<IconForward />}>
                            Menu Item 3
                        </Dropdown.Item>
                        <Dropdown.Item type="primary" icon={<IconBranch />}>
                            primary
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconColorPalette />} type="secondary">
                            secondary
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconRefresh />} type="tertiary">
                            tertiary
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconSearch />} type="warning">
                            warning
                        </Dropdown.Item>
                        <Dropdown.Item
                            icon={<IconSimilarity style={{ color: 'var(--semi-color-tertiary)' }} />}
                            type="danger"
                        >
                            danger
                        </Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button>Always Show</Button>
            </Dropdown>
            <Dropdown
                trigger="custom"
                position="bottomLeft"
                showTick
                visible
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item icon={<IconBox />} active>
                            Menu Item 1
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconSetting />}>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item disabled icon={<IconForward />}>
                            Menu Item 3
                        </Dropdown.Item>
                        <Dropdown.Item type="primary" icon={<IconBranch />}>
                            primary
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconColorPalette />} type="secondary">
                            secondary
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconRefresh />} type="tertiary">
                            tertiary
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconSearch />} type="warning">
                            warning
                        </Dropdown.Item>
                        <Dropdown.Item
                            icon={<IconSimilarity style={{ color: 'var(--semi-color-tertiary)' }} />}
                            type="danger"
                        >
                            danger
                        </Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button style={{ marginLeft: 90 }}>Always ShowTick</Button>
            </Dropdown>
        </div>
    );
}
```

### Popup Position

The position of support is the same. [Tooltip](https://semi.design/en-US/show/tooltip#Position), commonly used are: "bottom", "bottomLeft", "bottomRight".

```jsx live=true
import React from 'react';
import { Dropdown, Tag } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <div>
            <Dropdown
                position={'bottom'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Tag>Bottom</Tag>
            </Dropdown>
            <br />
            <br />
            <Dropdown
                position={'bottomLeft'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Tag>bottomLeft</Tag>
            </Dropdown>
            <br />
            <br />
            <Dropdown
                position={'bottomRight'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Tag>bottomRight</Tag>
            </Dropdown>
        </div>
    );
}
```

### Trigger Mode

The default is the move-in Trigger, which can be expanded by getting focus, clicking, or customizing the event trigger menu.

```jsx live=true
import React from 'react';
import { Dropdown, Tag, Input, Button } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <div>
            <Dropdown
                trigger={'hover'}
                position={'bottomLeft'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Tag>Hover me</Tag>
            </Dropdown>
            <br />
            <br />
            <Dropdown
                trigger={'focus'}
                position={'bottomLeft'}
                render={
                    <Dropdown.Menu tabindex={-1}>
                        <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Input style={{ width: 120 }} placeholder="click here" />
            </Dropdown>
            <br />
            <br />
            <Dropdown
                trigger={'click'}
                position={'bottomLeft'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button>Click me</Button>
            </Dropdown>
        </div>
    );
}
```

### Trigger Event

Click on the menu item to trigger different mouse events, support `onClick`, `onMouseEnter`, `onMouseLeave` and `onContextMenu`.

```jsx live=true
import React from 'react';
import { Dropdown, Button, Toast } from '@douyinfe/semi-ui';

class DropdownEvents extends React.Component {
    constructor() {
        super();
        this.click = this.click.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.rightClick = this.rightClick.bind(this);
    }

    click(value) {
        Toast.info({ content: 'You clicked me!' });
    }

    mouseEnter(value) {
        Toast.info({ content: 'Nice to meet you!' });
    }

    mouseLeave(value) {
        Toast.info({ content: 'See ya!' });
    }

    rightClick(value) {
        Toast.info({ content: 'Right clicked!' });
    }

    render() {
        return (
            <Dropdown
                trigger={'click'}
                position={'bottomLeft'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={this.click}>1: click me!</Dropdown.Item>
                        <Dropdown.Item onMouseEnter={this.mouseEnter}>2: mouse enter</Dropdown.Item>
                        <Dropdown.Item onMouseLeave={this.mouseLeave}>3: mouse leave</Dropdown.Item>
                        <Dropdown.Item onContextMenu={this.rightClick}>4: right click</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button>Click me</Button>
            </Dropdown>
        );
    }
}
```

### Group Combinations

Combination uses`Dropdown.Title`, `Dropdown.Divider`, `Dropdown.Item`.

Configure type `Dropdown.Item` to show different colors of text.

```jsx live=true
import React from 'react';
import { Dropdown, Button, Toast } from '@douyinfe/semi-ui';

class DropdownEvents extends React.Component {
    constructor() {
        super();
        this.click = this.click.bind(this);
    }

    click(value) {
        Toast.info({ content: 'You clicked me!' });
    }

    render() {
        return (
            <Dropdown
                trigger={'click'}
                showTick
                position={'bottomLeft'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Title>Group 1</Dropdown.Title>
                        <Dropdown.Item type="primary">primary</Dropdown.Item>
                        <Dropdown.Item type="secondary">secondary</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Title>Group 2</Dropdown.Title>
                        <Dropdown.Item type="tertiary">tertiary</Dropdown.Item>
                        <Dropdown.Item type="warning" active>
                            warning
                        </Dropdown.Item>
                        <Dropdown.Item type="danger">danger</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button>Click me</Button>
            </Dropdown>
        );
    }
}
```

### Json Usage

Can use the menu attribute to configure the Dropdown content menu

```jsx live=true
import React from 'react';
import { Dropdown, Button } from '@douyinfe/semi-ui';

function DropdownEvents() {
    const menu = [
        { node: 'title', name: 'Group1' },
        { node: 'item', name: 'primary1', type: 'primary', onClick: () => console.log('click primary') },
        { node: 'item', name: 'secondary', type: 'secondary' },
        { node: 'divider' },
        { node: 'title', name: 'Group2' },
        { node: 'item', name: 'tertiary', type: 'tertiary' },
        { node: 'item', name: 'warning', type: 'warning', active: true },
        { node: 'item', name: 'danger', type: 'danger' },
    ];
    return (
        <Dropdown trigger={'click'} showTick position={'bottomLeft'} menu={menu}>
            <Button>Click me</Button>
        </Dropdown>
    );
}
```

## API Reference

### Dropdown

| Properties | Instructions | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | Whether the pop-up layer automatically adjusts its direction when it is blocked | boolean | true |  |
| className | classname of the outer style of the pop-up layer | string |  |  |
| children | Child elements wrapped by the drop layer | ReactNode |  |  |
| clickToHide | Whether to close the drop-down layer automatically when clicking on the drop-down layer | boolean |  | **0.24.0** |
| contentClassName | Drop-down menu root element class name | string |  |  |
| getPopupContainer | Specifies the parent DOM, and the bullet layer will be rendered to the DOM, you need to set 'position: relative` | function():HTMLElement | () = > document.body |
| mouseEnterDelay | After the mouse is moved into the Trigger, the display time is delayed, in milliseconds (only effective when the trigger is hover/focus) | number | 50 |  |
| mouseLeaveDelay | The time for the delay to disappear after the mouse moves out of the pop-up layer, in milliseconds (only effective when the trigger is hover/focus) | number | 50 |  |
| menu | Menu content config | Array<DropdownMenuItem\> | [] | **1.12.0** |
| position | The position of the pop-up menu, commonly used: 'bottom', 'bottomLeft', 'bottomRight', for more details, see [Tooltip Position](https://semi.design/en-US/show/tooltip#Position) | string | 'bottom' |  |
| render | Content of pop-up layer，include `Dropdown.Menu` `Dropdown.Item`、`Dropdown.Title` | ReactNode |  |  |
| rePosKey | You can update the value of this item to manually trigger the repositioning of the pop-up layer | string \| number |  |  |
| spacing | The distance between the pop-up layer and the `children` element, in px | number | 4 |  |
| style | Pop-up layer inline style | object |  |  |
| showTick | Whether to automatically display the checked tick on the left of the active Dropdown.Item item | boolean | false | **0.26.0** |
| stopPropagation | Whether to prevent the click event on the pop-up layer from bubbling | boolean | false | **0.34.0** |
| trigger | The act of triggering a drop-down, optional 'hover', 'focus', 'click', 'custom' | string | 'hover' |  |
| visible | Display the menu or not, need to be used with trigger custom | boolean |  |  |
| zIndex | Pop-up layer z-index value | number | 1050 |  |
| onVisibleChange | Callback when the pop-up layer display state changes | function |  |  |

### Dropdown.Menu

| Properties | Instructions | Type | Default | Version |
| --- | --- | --- | --- | --- |
| style | Drop-down menu style | object |  | **0.28.0** |
| className | Drop-down menu style class name | string |  | **0.28.0** |
| children | The child elements wrapped by the drop-down menu, usually `Dropdown.Item` or `Dropdown.Title` | ReactNode |  |  |

### Dropdown.Item

| Properties | Instructions | Type | Default | Version |
| --- | --- | --- | --- | --- |
| active | Whether the current item is in the active state, there is a tick on the left when the active state is activated, the font is bold, and the color is deepened. When the `showTick` is false, even if the `active` is true, the tick will not be displayed | boolean | false |  |
| className | Style class name | string |  |  |
| disabled | Do you disable the menu? | boolean | false |  |
| icon | Icon of DropdownItem, will be displayed on the left  | ReactNode |  | **1.16.0** |
| style | Inline style | object |  |  |
| type | Type, optional values: "primary","secondary", "tertiary", "warning", "danger" | string | "tertiary" |  |
| onClick | Click the trigger callback event | function |  |  |
| onContextMenu | The callback event triggered by right click | function |  | **1.6.0** |
| onMouseEnter | A callback event triggered by MouseEnter | function |  |  |
| onMouseLeave | The callback event triggered by Mouse Leave | function |  |  |

### Dropdown.Title

| Properties | Instructions     | Type   | Default |
| ---------- | ---------------- | ------ | ------- |
| className  | Style class name | string | ""      |
| style      | Inline style     | object | {}      |

### DropdownMenuItem

| Properties                                     | Instructions                        | Type   |
| ---------------------------------------------- | ----------------------------------- | ------ |
| node                                           | menu type: `title`,`item`,`divider` | string |
| name                                           | menu content                        | string |
| Other Properties refer to Title、Item、Divider |                                     |        |

## Design Tokens

<DesignToken/>

<!-- ## Related Material

```material
5
``` -->
