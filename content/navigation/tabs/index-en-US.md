---
localeCode: en-US
order: 41
category: Navigation
title: Tabs
subTitle: Tabs
icon: doc-tabs
brief: When the content needs to be grouped and displayed in different modules or pages, you could use Tabs to switch between different groups or pages
---

## Demos

### How to import

```jsx
import { Tabs, TabPane } from '@douyinfe/semi-ui';
```

### Basic Usage

Tbs supports three types of styles: `line`, `button`, and `card`. By default, the first tab is selected. You could use either `tabList` to pass in an array of tabs objects, or use `<TabPane>` to create each tab. Mixed usage of two ways is not recommended and data in `tabList` will be rendered with priority.

> When you use `tabList`, only the current active tab will be rendered. For `<TabPane>`, all tabs will be rendered in DOM tree by default. You could set `keepDOM={false}` to only render current panel. No animation will be displayed in this case.

```jsx live=true
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <div>
                <Tabs type="line">
                    <TabPane tab="Document" itemKey="1">
                        <h3>Document</h3>
                        <p style={{ lineHeight: 1.8 }}>
                            Semi Design is a design system developed and maintained by IES Front-end Team and UED Team
                        </p>
                        <p style={{ lineHeight: 1.8 }}>
                            Semi Design create a consistent, good-looking, easy-to-use, and efficient user experience
                            with a user-centric, content-first, and human-friendly design system.
                        </p>
                        <ul>
                            <li>
                                <p>Content-first</p>
                            </li>
                            <li>
                                <p>Customized theming</p>
                            </li>
                            <li>
                                <p>Internationalized</p>
                            </li>
                            <li>
                                <p>Humanism</p>
                            </li>
                        </ul>
                    </TabPane>
                    <TabPane tab="Quick Start" itemKey="2">
                        <h3>Quick Start</h3>
                        <p style={{ lineHeight: 1.8 }}>
                            If it is a new project, it is recommended that you use Eden to initialize the project and
                            initialize the project type to select the React direction.
                        </p>
                        <pre
                            style={{
                                margin: '24px 0',
                                padding: '20px',
                                border: 'none',
                                whiteSpace: 'normal',
                                borderRadius: 'var(--semi-border-radius-medium)',
                                color: 'var(--semi-color-text-1)',
                                backgroundColor: 'var(--semi-color-fill-0)',
                            }}
                        >
                            <code>
                                yarn add @douyinfe/semi-ui
                            </code>
                        </pre>
                    </TabPane>
                    <TabPane tab="Help" itemKey="3">
                        <h3>Help</h3>
                        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
                            Q: Who should I look for if there are new component requirements, or existing component does
                            not meet my needs?
                        </p>
                        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
                            {`Give feedbacks in the upper right corner, submit an Issue, describe your needs as well as
                            the business scenario. We'll handle these issues with priorities.`}
                        </p>
                        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
                            Q: Have questions when using components?
                        </p>
                        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
                            Welcome to ask anything in our Lark customer service group.
                        </p>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
```

```jsx live=true
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <Tabs type="button">
                <TabPane tab="Document" itemKey="1">
                    Document
                </TabPane>
                <TabPane tab="Quick Start" itemKey="2">
                    Quick Start
                </TabPane>
                <TabPane tab="Help" itemKey="3">
                    Help
                </TabPane>
            </Tabs>
        );
    }
}
```

```jsx live=true
import React from 'react';
import { Tabs } from '@douyinfe/semi-ui';

class TabDemo extends React.Component {
    constructor() {
        super();
        this.state = { key: '1' };
        this.onTabClick = this.onTabClick.bind(this);
    }

    onTabClick(key, type) {
        this.setState({ [type]: key });
    }

    render() {
        // eslint-disable-next-line react/jsx-key
        const contentList = [<div>Document</div>, <div>Quick Start</div>, <div>Help</div>];
        const tabList = [
            { tab: 'Document', itemKey: '1' },
            { tab: 'Quick Start', itemKey: '2' },
            { tab: 'Help', itemKey: '3' },
        ];
        return (
            <Tabs
                type="card"
                tabList={tabList}
                onChange={key => {
                    this.onTabClick(key, 'key');
                }}
            >
                {contentList[this.state.key - 1]}
            </Tabs>
        );
    }
}
```

### With Icon

```jsx live=true
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { IconFile, IconGlobe, IconHelpCircle } from '@douyinfe/semi-icons';

class App extends React.Component {
    render() {
        return (
            <Tabs>
                <TabPane
                    tab={
                        <span>
                            <IconFile />
                            Document
                        </span>
                    }
                    itemKey="1"
                >
                    Document
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <IconGlobe />
                            Quick Start
                        </span>
                    }
                    itemKey="2"
                >
                    Quick Start
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <IconHelpCircle />
                            Help
                        </span>
                    }
                    itemKey="3"
                >
                    Help
                </TabPane>
            </Tabs>
        );
    }
}
```

### Vertical mode

Support two positions: `tabPosition='left|top'`

```jsx live=true
import React from 'react';
import { Tabs, TabPane, Radio, RadioGroup } from '@douyinfe/semi-ui';
import { IconFile, IconGlobe, IconHelpCircle } from '@douyinfe/semi-icons';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            type: 'line',
        };
    }

    onSelect(e) {
        this.setState({
            type: e.target.value,
        });
    }

    render() {
        return (
            <>
                <RadioGroup
                    onChange={e => this.onSelect(e)}
                    value={this.state.type}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Radio value={'line'}>Line</Radio>
                    <Radio value={'card'}>Card</Radio>
                    <Radio value={'button'}>Button</Radio>
                </RadioGroup>
                <br />
                <br />
                <Tabs tabPosition="left" type={this.state.type}>
                    <TabPane
                        tab={
                            <span>
                                <IconFile />
                                Document
                            </span>
                        }
                        itemKey="1"
                    >
                        <div style={{ padding: '0 24px' }}> Document </div>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <IconGlobe />
                                Quick Start
                            </span>
                        }
                        itemKey="2"
                    >
                        <div style={{ padding: '0 24px' }}>Quick Start</div>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <IconHelpCircle />
                                Help
                            </span>
                        }
                        itemKey="3"
                    >
                        <div style={{ padding: '0 24px' }}>Help</div>
                    </TabPane>
                </Tabs>
            </>
        );
    }
}
```

### Scrollable Tabs

**v>= 1.1.0**  
You could use `collapsible` for a scrollable tabs with dropdown menu. Horizontal mode only.

```jsx live=true dir=column
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <Tabs style={{ width: '60%', margin: '20px' }} type="card" collapsible>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
                    <TabPane tab={`Tab-${item}`} itemKey={`Tab-${item}`} key={item}>
                        Content of card tab {i}
                    </TabPane>
                ))}
            </Tabs>
        );
    }
}
```

### Disable

Disable one tab.

```jsx live=true
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="Document" itemKey="1">
                    Document
                </TabPane>
                <TabPane tab="Quick Start" itemKey="2" disabled>
                    Quick Start
                </TabPane>
                <TabPane tab="Help" itemKey="3">
                    Help
                </TabPane>
            </Tabs>
        );
    }
}
```

### Extra Content

Use `tabBarExtraContent` to add extra content on the right side of tabBar.

```jsx live=true
import React from 'react';
import { Tabs, TabPane, Button } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <Tabs
                defaultActiveKey="1"
                tabBarExtraContent={
                    <Button
                        onClick={() => {
                            alert('you have clicked me!');
                        }}
                    >
                        Extra Action
                    </Button>
                }
            >
                <TabPane tab="Document" itemKey="1">
                    Document
                </TabPane>
                <TabPane tab="Quick Start" itemKey="2">
                    Quick Start
                </TabPane>
                <TabPane tab="Help" itemKey="3">
                    Help
                </TabPane>
            </Tabs>
        );
    }
}
```

### Custom Render

Use `renderTabBar` to customize tabBar render behavior.

```jsx live=true
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <Tabs
                defaultActiveKey="1"
                renderTabBar={(tabBarProps, DefaultTabBar) => {
                    return (
                        <div className="tab-bar-box">
                            This is a custom rendered tabBar. Current activeKey is: {tabBarProps.activeKey}
                            <DefaultTabBar {...tabBarProps} />
                        </div>
                    );
                }}
            >
                <TabPane tab="Document" itemKey="1">
                    Document
                </TabPane>
                <TabPane tab="Quick Start" itemKey="2">
                    Quick Start
                </TabPane>
                <TabPane tab="Help" itemKey="3">
                    Help
                </TabPane>
            </Tabs>
        );
    }
}
```

### Dynamic Update

You can add events to update tabBar dynamically.

```jsx live=true
import React from 'react';
import { Tabs, TabPane, ButtonGroup, Button } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        const panes = [
            { title: 'Tab 1', content: 'Content of Tab Pane 1', itemKey: '1' },
            { title: 'Tab 2', content: 'Content of Tab Pane 2', itemKey: '2' },
        ];
        this.state = {
            panes,
            activeKey: panes[0].itemKey,
        };
    }

    add() {
        const { panes } = this.state;
        const index = this.newTabIndex++;
        panes.push({ title: `New Tab ${index}`, content: 'New Tab Pane', itemKey: `newTab${index}` });
        this.setState({ panes, activeKey: `newTab${index}` });
    }

    remove() {
        const { panes } = this.state;
        if (panes.length > 1) {
            panes.pop();
            this.setState({ panes, activeKey: panes[panes.length - 1].itemKey });
        }
    }

    handleChange(activeKey) {
        this.setState({ activeKey });
    }

    render() {
        const { panes, activeKey } = this.state;
        return (
            <Tabs
                defaultActiveKey="1"
                activeKey={activeKey}
                onChange={this.handleChange.bind(this)}
                tabBarExtraContent={
                    <ButtonGroup>
                        <Button onClick={() => this.add()}>Add</Button>
                        <Button onClick={() => this.remove()}>Delete</Button>
                    </ButtonGroup>
                }
            >
                {panes.map(pane => (
                    <TabPane tab={pane.title} itemKey={pane.itemKey} key={pane.itemKey}>
                        {pane.content}
                    </TabPane>
                ))}
            </Tabs>
        );
    }
}
```

### Closeable

Close a tab in the tab bar.
Only card style tabs support the close option. Use `closable={true}` to turn it on.

```jsx live=true 
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tabList: [
                {tab: 'Doc', itemKey:'1', text:'Doc', closable:true},
                {tab: 'Quick Start', itemKey:'2', text:'Quick Start', closable:true},
                {tab: 'Help', itemKey:'3', text:'Help'},
            ]
        }
    }
    close(key){
        const newTabList = [...this.state.tabList];
        const closeIndex = newTabList.findIndex(t=>t.itemKey===key);
        newTabList.splice(closeIndex, 1);
        this.setState({tabList:newTabList});
    }
    render() {
        return (
            <Tabs type="card" defaultActiveKey="1" onTabClose={this.close.bind(this)}>
                {
                    this.state.tabList.map(t=><TabPane closable={t.closable} tab={t.tab} itemKey={t.itemKey} key={t.itemKey}>{t.text}</TabPane>)
                }
            </Tabs>
        );
    }
}
```

## API Reference

### Tab

Property | Description | Type | Default Value |
--- | --- | --- | --- |
activeKey | The itemKey value of the currently active tab page | string | None |
className | class name | string | None |
collapsible | collapsed Tabs, **>=1.1.0** | boolean | false |
contentStyle | The outer style object of the content area | CSSProperties | None |
defaultActiveKey | Initialize the key value of the selected tab page | string | '1' |
keepDOM | Whether to render the DOM structure of the hidden panel when using TabPane writing, **>=1.0.0** | boolean | true |
lazyRender | Lazy rendering, only when the panel is activated will it be rendered in the DOM tree, **>=1.0.0** | boolean | false |
renderTabBar | Used for secondary packaging tab bar | (tabBarProps: object, defaultTabBar: React.ComponentType) => ReactNode | None |
size | Size, providing three types of `large`, `medium`, and `small`, **>=1.11.0, currently only supports linear Tabs** | string | `large` |
style | style object | CSSProperties | None |
tabBarExtraContent | Used to extend the content of the tab bar | ReactNode | None |
tabList | An array of tab page objects that supports itemKey (corresponding to activeKey, tab (tab page text) and icon (tab page icon) | TabPane[] | None |
tabPaneMotion | Whether to use animation to switch tabs | boolean | true |
tabPosition | The position of the tab, support `top` (horizontal), `left` (vertical), **>=1.0.0** | boolean | `top` |
type | The style of the label bar, optional `line`, `card`, `button` | string | `line` |
onChange | Callback function when switching tab pages | function(activeKey: string) | None |
onTabClick | Click event | function(key: string, e: Event) | None |
onTabClose | executed when tab closed by user, **>=2.1.0**  |  function(tabKey: string) | None

### TabPane

Property | Description | Type | Default Value |
--------- | ---------------- | ------------------ | ---- - |
className | class name | string | None |
disabled | Whether the tab bar is disabled | boolean | None |
icon | Tab bar icon | ReactNode | None |
itemKey | corresponding to `activeKey` | string | None |
style | style object | CSSProperties | None |
tab | Tab page bar display text | ReactNode | None |
closable | whether user can close the tab **>=2.1.0** | boolean | false |


## Accessibility

### ARIA
- About role
  - TabBar has a role of `tablist`
  - Tab in TabBar has a role of `tab`
  - TabPane has a role of `tabpanel`

- aria-orientation: Indicates TabBar's orientation, can be `vertical` or `horizontal`. When tabPosition is `left`, aria-orientation will be `vertical`, when tabPosition is `top`, aria-orientation will be `horizontal`.
- aria-disabled: When TabPane is disabled, the related Tab's aria-disabled will be set to true.
- aria-selected: Indicates whether the Tab is selected.
- aria-controls: Indicates the TabPane controlled by the Tab
- aria-labelledby: Indicates the element labels the TabPane

## Design Token

<DesignToken/>
