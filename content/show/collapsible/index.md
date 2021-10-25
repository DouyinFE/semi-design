---
localeCode: zh-CN
order: 46
category: 展示类
title: Collapsible 折叠
icon: doc-collapsible
brief: 行为组件，是一个用于展开或折叠内容的容器。
---

## 何时使用

-   `Collapsible` 是一个行为组件，默认开启动画效果。它被用于 Semi 的各种组件中，如：`Navigation`， `Collapse`, `Tree`， `TreeSelect`，以及 `Typography` 中。
-   当上述组件不能满足需求或者需要自定义一些折叠行为时，可以使用 `Collapsible` 来包裹需要展开或者折叠的内容。

## 代码演示

### 如何引入

```jsx import
import { Collapsible } from '@douyinfe/semi-ui';
```

### 基本用法

通过 `isOpen` 来控制内容的展开或者折叠。

```jsx live=true hideInDSM
import React from 'react';
import { Collapsible, Button } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        const { isOpen } = this.state;
        const collapsed = (
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
        );
        return (
            <div>
                <Button onClick={this.toggle}>Toggle</Button>
                <Collapsible isOpen={isOpen}>{collapsed}</Collapsible>
            </div>
        );
    }
}
```

### 自定义动画时间

通过 `duration` 设置动画展开或者折叠的时间，也可以通过 `motion` 来关闭动画。

```jsx live=true hideInDSM
import React from 'react';
import { Collapsible, InputNumber, Button } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            duration: 250,
        };
        this.toggle = this.toggle.bind(this);
        this.setDuration = this.setDuration.bind(this);
    }

    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    setDuration(duration) {
        this.setState({ duration: duration });
    }

    render() {
        const { isOpen, duration } = this.state;
        const collapsed = (
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
        );
        return (
            <div>
                <label>设置动画时间：</label>
                <InputNumber min={0} defaultValue={250} style={{ width: 120 }} onChange={this.setDuration} step={10} />
                <br />
                <Button onClick={this.toggle}>Toggle</Button>
                <Collapsible isOpen={isOpen} duration={duration}>
                    {collapsed}
                </Collapsible>
            </div>
        );
    }
}
```

### 嵌套使用

当嵌套使用 Collapsible 时需要将当前触发动画的节点设置 motion，未触发动画的节点设置为 false。

> 在 v0.29.2 之后的版本，我们对 Collapsible 做了优化，不再需要手动传入触发动画的节点

版本 < v0.29.2 的写法：

```jsx live=true hideInDSM
import React from 'react';
import { Collapsible, Button } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isChildOpen: false,
            activeKey: '',
        };
        this.toggle = this.toggle.bind(this);
        this.toggleChild = this.toggleChild.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
            activeKey: 'p',
        });
    }

    toggleChild() {
        this.setState({
            isChildOpen: !this.state.isChildOpen,
            activeKey: 'c',
        });
    }

    render() {
        const { isOpen, isChildOpen, activeKey } = this.state;
        const collapsed = (
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
        );
        return (
            <div>
                <Button onClick={this.toggle}>Toggle</Button>
                <br />
                <Collapsible isOpen={isOpen} motion={'p' === activeKey}>
                    <div>
                        <span>Semi Design的设计原则包括：</span>
                        <Button onClick={this.toggleChild}>Toggle List</Button>
                    </div>
                    <Collapsible isOpen={isChildOpen} motion={'c' === activeKey}>
                        {collapsed}
                    </Collapsible>
                </Collapsible>
            </div>
        );
    }
}
```

优化后 版本 >=v0.29.2 的写法：

```jsx live=true hideInDSM
import React from 'react';
import { Collapsible, Button } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isChildOpen: false,
        };
        this.toggle = this.toggle.bind(this);
        this.toggleChild = this.toggleChild.bind(this);
    }

    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    toggleChild() {
        this.setState({ isChildOpen: !this.state.isChildOpen });
    }

    render() {
        const { isOpen, isChildOpen } = this.state;
        const collapsed = (
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
        );
        return (
            <div>
                <Button onClick={this.toggle}>Toggle</Button>
                <br />
                <Collapsible isOpen={isOpen}>
                    <div>
                        <span>Semi Design的设计原则包括：</span>
                        <Button onClick={this.toggleChild}>Toggle List</Button>
                    </div>
                    <Collapsible isOpen={isChildOpen}>{collapsed}</Collapsible>
                </Collapsible>
            </div>
        );
    }
}
```

### 自定义折叠高度

可以使用 collapseHeight 自定义收起的高度，需要版本 **v>=1.0.0**

```jsx live=true hideInDSM
import React from 'react';
import { Collapsible, Button } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        const { isOpen } = this.state;
        const maskStyle = isOpen
            ? {}
            : {
                  WebkitMaskImage:
                      'linear-gradient(to bottom, black 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0.2) 80%, transparent 100%)',
              };
        const collapsed = (
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
        );
        const linkStyle = {
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            bottom: -10,
            fontWeight: 700,
            cursor: 'pointer',
        };
        return (
            <>
                <Button onClick={this.toggle}>Toggle</Button>
                <div style={{ position: 'relative' }}>
                    <Collapsible isOpen={isOpen} collapseHeight={80} style={{ ...maskStyle }}>
                        {collapsed}
                    </Collapsible>
                    {isOpen ? null : (
                        <a onClick={this.toggle} style={{ ...linkStyle }}>
                            + Show More
                        </a>
                    )}
                </div>
            </>
        );
    }
}
```

## API 参考

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 类名 | string | - | 0.34.0 |
| collapseHeight | 折叠高度 | number | 0 | 1.0.0 |
| duration | 动画执行的时间 | number | 250 | - |
| isOpen | 是否展开内容区域 | boolean | `false` | - |
| keepDOM | 是否保留隐藏的面板 DOM 树，默认销毁 | boolean | `false` | 0.25.0 |
| motion | 是否开启动画 | Motion | `true` | - |
| reCalcKey | 当 reCalcKey 改变时，将重新计算子节点的高度，用于优化动态渲染时的计算 | number \| string | - | 1.5.0 |
| style | 样式 | CSSProperties | - | 0.34.0 |

## FAQ

-   为什么使用 Collapsible 没有正常展开?  
     检查 Collapsible 父级是否设置 display:none，此时因为无法拿到节点高度，会出现无法展开的问题。如果没有设置，可以联系 Semi 客服看是否存在其他问题。
