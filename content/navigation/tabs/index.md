---
localeCode: zh-CN
order: 39
category: 导航类
title: Tabs 标签栏
icon: doc-tabs
brief: 当内容需要分组并在不同模块页面中展示，可使用 Tabs 标签栏目对不同的组/页之间进行切换
---

## 代码演示

### 如何引入

```jsx import
import { Tabs, TabPane } from '@douyinfe/semi-ui';
```

### 基本用法

标签栏支持三种样式的显示：线条式，按钮式，卡片式。默认选中第一项。  
标签页支持两种传入方式：通过 `tabList` 传入标签页对象的数组，或使用 `<TabPane>` 逐项显式传入。  
两种方式建议不要同时使用，同时使用时会优先渲染通过 `tabList` 传入的数据。

> 当使用 `tabList` 时每次只渲染当前传入的节点使用 `<TabPane>` 时默认会渲染所有面板。可以通过设置 `keepDOM={false}` 只渲染当前面板，此时不会有动画效果。

```jsx live=true
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';

() => (
    <div>
        <Tabs type="line">
            <TabPane tab="文档" itemKey="1">
                <h3>文档</h3>
                <p style={{ lineHeight: 1.8 }}>
                    Semi Design 是由互娱社区前端团队与 UED
                    团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
                    Web 应用。
                </p>
                <p style={{ lineHeight: 1.8 }}>
                    区别于其他的设计系统而言，Semi Design
                    以用户中心、内容优先、设计人性化为设计理念，具有以下优势：
                </p>
                <ul>
                    <li>
                        <p>Semi Design 以内容优先进行设计。</p>
                    </li>
                    <li>
                        <p>更容易地自定义主题。</p>
                    </li>
                    <li>
                        <p>适用国际化场景。</p>
                    </li>
                    <li>
                        <p>效率场景加入人性化关怀。</p>
                    </li>
                </ul>
            </TabPane>
            <TabPane tab="快速起步" itemKey="2">
                <h3>快速起步</h3>
                <pre
                    style={{
                        margin: '24px 0',
                        padding: '20px',
                        border: 'none',
                        whiteSpace: 'normal',
                        borderRadius: '6px',
                        color: 'var(--semi-color-text-1)',
                        backgroundColor: 'var(--semi-color-fill-0)',
                    }}
                >
                    <code>
                        yarn add @douyinfe/semi-ui
                    </code>
                </pre>
            </TabPane>
            <TabPane tab="帮助" itemKey="3">
                <h3>帮助</h3>
                <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
                    Q：有新组件需求、或者现有组件feature不能满足业务需求？
                </p>
                <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
                    右上角问题反馈，提交issue，label选择Feature Request / New Component Request
                    我们会高优处理这些需求。
                </p>
                <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
                    Q：对组件的使用有疑惑？
                </p>
                <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
                    欢迎进我们的客服lark群进行咨询提问。
                </p>
            </TabPane>
        </Tabs>
    </div>
)

```

```jsx live=true
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';

() => (
    <Tabs type="button">
        <TabPane tab="文档" itemKey="1">
            文档
        </TabPane>
        <TabPane tab="快速起步" itemKey="2">
            快速起步
        </TabPane>
        <TabPane tab="帮助" itemKey="3">
            帮助
        </TabPane>
    </Tabs>
)
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
        const contentList = [<div>文档</div>, <div>快速起步</div>, <div>帮助</div>];
        const tabList = [
            { tab: '文档', itemKey: '1' },
            { tab: '快速起步', itemKey: '2' },
            { tab: '帮助', itemKey: '3' },
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

### 带图标的

有图标的标签栏。

```jsx live=true
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { IconFile, IconGlobe, IconHelpCircle } from '@douyinfe/semi-icons';

() => (
  <Tabs>
      <TabPane
          tab={
              <span>
                  <IconFile />
                  文档
              </span>
          }
          itemKey="1"
      >
          文档
      </TabPane>
      <TabPane
          tab={
              <span>
                  <IconGlobe />
                  快速起步
              </span>
          }
          itemKey="2"
      >
          快速起步
      </TabPane>
      <TabPane
          tab={
              <span>
                  <IconHelpCircle />
                  帮助
              </span>
          }
          itemKey="3"
      >
          帮助
      </TabPane>
  </Tabs>
)
```

### 垂直的标签栏

支持水平和垂直两种模式， `tabPosition='left|top'`

```jsx live=true
import React from 'react';
import { Tabs, TabPane, RadioGroup, Radio } from '@douyinfe/semi-ui';
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
                                文档
                            </span>
                        }
                        itemKey="1"
                    >
                        <div style={{ padding: '0 24px' }}>
                            <h3>文档</h3>
                            <p style={{ lineHeight: 1.8 }}>
                                Semi Design 是由互娱社区前端团队与 UED
                                团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
                                Web 应用。
                            </p>
                            <p style={{ lineHeight: 1.8 }}>
                                区别于其他的设计系统而言，Semi Design
                                以用户中心、内容优先、设计人性化为设计理念，具有以下优势：
                            </p>
                        </div>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <IconGlobe />
                                快速起步
                            </span>
                        }
                        itemKey="2"
                    >
                        <div style={{ padding: '0 24px' }}>
                            <h3>快速起步</h3>
                            <pre
                                style={{
                                    margin: '24px 0',
                                    padding: '20px',
                                    border: 'none',
                                    whiteSpace: 'normal',
                                    borderRadius: '6px',
                                    color: 'var(--semi-color-text-1)',
                                    backgroundColor: 'var(--semi-color-fill-0)',
                                }}
                            >
                                <code>
                                    yarn add @douyinfe/semi-ui
                                </code>
                            </pre>
                        </div>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <IconHelpCircle />
                                帮助
                            </span>
                        }
                        itemKey="3"
                    >
                        <div style={{ padding: '0 24px' }}>
                            <h3>帮助</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
                                Q：有新组件需求、或者现有组件feature不能满足业务需求？
                            </p>
                            <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
                                右上角问题反馈，提交issue，label选择Feature Request / New Component Request
                                我们会高优处理这些需求。
                            </p>
                            <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
                                Q：对组件的使用有疑惑？
                            </p>
                            <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
                                欢迎进我们的客服lark群进行咨询提问。
                            </p>
                        </div>
                    </TabPane>
                </Tabs>
            </>
        );
    }
}
```

### 滚动折叠

**v>= 1.1.0**  
通过设置 `collapsible` 可以支持滚动折叠，目前只支持 horizontal 模式。

```jsx live=true
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <Tabs style={{ width: '60%', margin: '20px' }} type="card" collapsible>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                    <TabPane tab={`Tab-${i}`} itemKey={`Tab-${i}`} key={i}>
                        Content of card tab {i}
                    </TabPane>
                ))}
            </Tabs>
        );
    }
}
```

### 禁用

禁用标签栏中的某一个标签页。

```jsx live=true
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="文档" itemKey="1">
                    文档
                </TabPane>
                <TabPane tab="快速起步" itemKey="2" disabled>
                    快速起步
                </TabPane>
                <TabPane tab="帮助" itemKey="3">
                    帮助
                </TabPane>
            </Tabs>
        );
    }
}
```

### 标签栏内容扩展

传入 `tabBarExtraContent` 属性可以在标签栏右侧添加附加操作。

```jsx live=true
import React from 'react';
import { Tabs, TabPane, Button } from '@douyinfe/semi-ui';

() => (
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
        <TabPane tab="文档" itemKey="1">
            文档
        </TabPane>
        <TabPane tab="快速起步" itemKey="2">
            快速起步
        </TabPane>
        <TabPane tab="帮助" itemKey="3">
            帮助
        </TabPane>
    </Tabs>
)
```

### 标签栏二次封装

传入 `renderTabBar` 函数可对标签栏进行二次封装。

```jsx live=true
import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';

() => (
    <Tabs
        defaultActiveKey="1"
        renderTabBar={(tabBarProps, DefaultTabBar) => {
            return (
                <div className="tab-bar-box">
                    这是二次封装的Tab Bar，当前ActiveKey：{tabBarProps.activeKey}
                    <DefaultTabBar {...tabBarProps} />
                </div>
            );
        }}
    >
        <TabPane tab="文档" itemKey="1">
            文档
        </TabPane>
        <TabPane tab="快速起步" itemKey="2">
            快速起步
        </TabPane>
        <TabPane tab="帮助" itemKey="3">
            帮助
        </TabPane>
    </Tabs>
)
```

### 动态更新

通过绑定事件，可以使标签栏动态更新。

```jsx live=true hideInDSM
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
                        <Button onClick={() => this.add()}>新增</Button>
                        <Button onClick={() => this.remove()}>删除</Button>
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

## API 参考

### Tab

属性 | 说明 | 类型 | 默认值 |
--- | --- | --- | --- |
activeKey | 当前激活的 tab 页的 itemKey 值 | string | 无 |
className | 类名 | string | 无 |
collapsible | 折叠的 Tabs，**>=1.1.0** | boolean | false |
contentStyle | 内容区域外层样式对象 | CSSProperties | 无 |
defaultActiveKey | 初始化选中的 tab 页的 key 值 | string | '1' |
keepDOM | 使用 TabPane 写法时是否渲染隐藏面板的 DOM 结构，**>=1.0.0** | boolean | true |
lazyRender | 懒渲染，仅当面板激活过才被渲染在 DOM 树中, **>=1.0.0** | boolean | false |
renderTabBar | 用于二次封装标签栏 | (tabBarProps: object, defaultTabBar: React.ComponentType) => ReactNode | 无 |
size | 大小，提供 `large`、`medium`、`small` 三种类型，**>=1.11.0，目前仅支持线性 Tabs** | string | `large` |
style | 样式对象 | CSSProperties | 无 |
tabBarExtraContent | 用于扩展标签栏的内容 | ReactNode | 无 |
tabList | 标签页对象组成的数组，该对象支持 itemKey（对应 activeKey，tab（标签页文字）及 icon（标签页图标） | TabPane[] | 无 |
tabPaneMotion | 是否使用动画切换 tabs | boolean | true |
tabPosition | tab 的位置，支持`top`(水平), `left`(垂直)，**>=1.0.0** | boolean | `top` |
type | 标签栏的样式，可选`line`、 `card`、 `button` | string | `line` |
onChange | 切换 tab 页时的回调函数 | function(activeKey: string) | 无 |
onTabClick | 单击事件 | function(key: string, e: Event) | 无 |

### TabPane

属性      | 说明             | 类型               | 默认值 |
--------- | ---------------- | ------------------ | ------ |
className | 类名             | string             | 无     |
disabled  | 标签页栏是否禁用 | boolean            | 无     |
icon      | 标签页栏 icon    | ReactNode | 无     |
itemKey   | 对应 `activeKey` | string             | 无     |
style     | 样式对象         | CSSProperties             | 无     |
tab       | 标签页栏显示文字 | ReactNode | 无     |

## 设计变量

<DesignToken/>
