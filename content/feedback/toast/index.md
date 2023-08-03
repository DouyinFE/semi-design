---
localeCode: zh-CN
order: 73
category: 反馈类
title: Toast 提示
icon: doc-toast
width: 65%
brief: Toast 提示是对用户的操作做出及时反馈，由用户的操作触发，反馈信息可以是操作的结果状态，如成功、失败、出错、警告等。
---

## 代码演示

### 如何引入

```jsx import
import { Toast } from '@douyinfe/semi-ui';
```

### 普通提示

信息提醒反馈

```jsx live=true noInline=true
import React from 'react';
import { throttle } from 'lodash-es';
import { Toast, Button } from '@douyinfe/semi-ui';

function Demo() {
    const opts = {
        content: 'Hi, Bytedance dance dance',
        duration: 3,
    };

    const handleClose = () => {
        throttled.cancel();
    };
    const throttleOpts = {
        content: 'Hi, Bytedance dance dance',
        duration: 10,
        onClose: handleClose,
    };
    const throttled = throttle(() => Toast.info(throttleOpts), 10000, { trailing: false });

    return (
        <div>
            <Button onClick={() => Toast.info(opts)}>Display Toast</Button>
            <br />
            <br />
            <Button onClick={throttled}>Throttled Toast</Button>
        </div>
    );
}
render(Demo);
```

### 其他提示类型

包括成功、失败、警告

```jsx live=true noInline=true
import React from 'react';
import { Toast, Button } from '@douyinfe/semi-ui';

function Demo() {
    let opts = {
        content: 'Hi, Bytedance dance dance',
        duration: 3,
    };

    return (
        <>
            <Button style={{ color: `var(--semi-color-success)` }} onClick={() => Toast.success('Hi,Bytedance dance dance')}>Success</Button>
            <br />
            <br />
            <Button type="warning" onClick={() => Toast.warning(opts)}>
                Warning
            </Button>
            <br />
            <br />
            <Button type="danger" onClick={() => Toast.error(opts)}>
                Error
            </Button>
        </>
    );
}
render(Demo);
```

### 多色样式

可以使用 `theme` 设置浅色填充样式提高与界面的对比，默认为 'normal' 的白色模式。

```jsx live=true noInline=true
import React from 'react';
import { Toast, Button } from '@douyinfe/semi-ui';

function Demo() {
    let opts = {
        content: 'Hi, Bytedance dance dance',
        duration: 3,
        theme: 'light',
    };

    return (
        <>
            <Button onClick={() => Toast.info(opts)}>Info</Button>
            <br />
            <br />
            <Button style={{ color: `var(--semi-color-success)` }} onClick={() => Toast.success(opts)}>Success</Button>
            <br />
            <br />
            <Button type="warning" onClick={() => Toast.warning(opts)}>
                Warning
            </Button>
            <br />
            <br />
            <Button type="danger" onClick={() => Toast.error(opts)}>
                Error
            </Button>
        </>
    );
}
render(Demo);
```

### 堆叠样式
可以通过 stack 属性应用堆叠样式到同屏多个 Toast，Hover 展开。

```jsx live=true
import { Toast, Typography, Button } from '@douyinfe/semi-ui';

()=>{
    
    const opts = {
        content: 'Hi, Bytedance dance dance',
        duration: 10,
        stack: true,
    };

    
    return <Button onClick={() => {
         Toast.info(opts)
    }}>Click multiple times</Button>
}

```

### 链接文本

配合 Typography 可以自定义链接文本，用来配合更复杂的场景的使用。

```jsx live=true noInline=true
import React from 'react';
import { Toast, Typography, Button } from '@douyinfe/semi-ui';

function Demo() {
    const { Text } = Typography;

    let opts = {
        content: (
            <span>
                <Text>Hi, Bytedance dance dance</Text>
                <Text link style={{ marginLeft: 12 }}>
                    更多
                </Text>
            </span>
        ),
        duration: 3,
    };

    let multiLineOpts = {
        content: (
            <>
                <div>Hi, Bytedance dance dance</div>
                <div style={{ marginTop: 8 }}>
                    <Text link>查看详情</Text>
                    <Text link style={{ marginLeft: 20 }}>
                        一会再看
                    </Text>
                </div>
            </>
        ),
        duration: 3,
    };

    return (
        <>
            <Button onClick={() => Toast.info(opts)}>Display Toast</Button>
            <br />
            <br />
            <Button onClick={() => Toast.info(multiLineOpts)}>Display Multi-line Toast</Button>
        </>
    );
}
render(Demo);
```

### 修改延时

自定义时长 10s，默认时长为 3s

```jsx live=true noInline=true
import React from 'react';
import { Toast, Button } from '@douyinfe/semi-ui';

function Demo() {
    let opts = {
        content: 'Hi, Bytedance dance dance',
        duration: 10,
    };

    return <Button onClick={() => Toast.info(opts)}>Close After 10s</Button>;
}
render(Demo);
```

### 手动关闭

当 `duration` 设置为 0 时，toast 不会自动关闭，此时必须通过手动关闭。

```jsx live=true noInline=true hideInDSM
import React, { useState } from 'react';
import { Toast, Button } from '@douyinfe/semi-ui';

function Demo() {
    const [toastId, setToastId] = useState();
    function show() {
        if (toastId) {
            return;
        }
        let id = Toast.info(opts);
        setToastId(id);
    }
    function hide() {
        Toast.close(toastId);
        destroy();
    }
    function destroy() {
        setToastId(null);
    }
    let opts = {
        content: 'Not auto close',
        duration: 0,
        onClose: destroy,
    };
    return (
        <>
            <Button type="primary" onClick={show}>
                Show Toast
            </Button>
            <br />
            <br />
            <Button type="primary" onClick={hide}>
                Hide Toast
            </Button>
        </>
    );
}

render(Demo);
```

### 更新消息内容

可以通过唯一的 `id` 来更新内容。

```jsx live=true noInline=true hideInDSM
import React, { useState } from 'react';
import { Toast, Button } from '@douyinfe/semi-ui';

function Demo() {
    function show() {
        const id = 'toastid';
        Toast.info({ content: 'Update Content By Id', id });
        setTimeout(() => {
            Toast.success({ content: 'Id By Content Update', id });
        }, 1000);
    }

    return (
        <Button type="primary" onClick={show}>
            Update Content By Id
        </Button>
    );
}

render(Demo);
```

### Hooks 用法

通过 Toast.useToast 创建支持读取 context 的 contextHolder。此时的 toast 会渲染在 contextHolder 所在的节点处。

```jsx live=true noInline=true hideInDSM
import React from 'react';
import { Toast, Button } from '@douyinfe/semi-ui';

const ReachableContext = React.createContext();

function Demo(props = {}) {
    const [toast, contextHolder] = Toast.useToast();
    const config = {
        duration: 0,
        title: 'This is a success message',
        content: <ReachableContext.Consumer>{name => `ReachableContext: ${name}`}</ReachableContext.Consumer>,
    };

    return (
        <ReachableContext.Provider value="Light">
            <div>
                <Button
                    onClick={() => {
                        toast.success(config);
                    }}
                >
                    Hook Toast
                </Button>
            </div>
            {contextHolder}
        </ReachableContext.Provider>
    );
}

render(Demo);
```

如果需要渲染到 Portal 中可以使用 ReactDOM.createPortal 方法。

```jsx live=true noInline=true
import React, { useRef } from 'react';
import { Toast, Button } from '@douyinfe/semi-ui';

const ReachableContext = React.createContext();

const useCreatePortalInBody = () => {
    const wrapperRef = useRef(null);
    if (wrapperRef.current === null && typeof document !== 'undefined') {
        const div = document.createElement('div');
        wrapperRef.current = div;
    }
    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper || typeof document === 'undefined') {
            return;
        }
        document.querySelector('.article-wrapper').appendChild(wrapper);
        return () => {
            document.querySelector('.article-wrapper').appendChild(wrapper);
        };
    }, []);
    return children => wrapperRef.current && ReactDOM.createPortal(children, wrapperRef.current);
};

function Demo(props = {}) {
    const [toast, contextHolder] = Toast.useToast();
    const createBodyPortal = useCreatePortalInBody();
    const config = {
        duration: 3,
        title: 'This is a success message',
        content: <ReachableContext.Consumer>{name => `ReachableContext: ${name}`}</ReachableContext.Consumer>,
    };

    return (
        <ReachableContext.Provider value="Light">
            <div>
                <Button
                    onClick={() => {
                        toast.success(config);
                    }}
                >
                    Hook Toast
                </Button>
            </div>
            {createBodyPortal(
                <div style={{ position: 'fixed', top: 0, left: '50%', zIndex: 10000 }}>{contextHolder}</div>
            )}
        </ReachableContext.Provider>
    );
}

render(Demo);
```

## API 参考

组件提供的静态方法，使用方式和参数如下：展示：可以直接传入 `options` 对象或 `string`，返回值为`toastId`：`const toastId = Toast.info({ /*...options*/ })`

-   `Toast.info(options || string)`
-   `Toast.error(options || string)`
-   `Toast.warning(options || string)`
-   `Toast.success(options || string)`
-   `Toast.close(toastId)` 手动关闭 （ `toastId` 为展示方法的返回值）
-   `Toast.config(config)` 全局配置在调用前提前配置，全局一次生效 ( >= 0.25.0 )

**以下API无需调用额外的 ToastFactory.create(config) 创建新 Toast 即能生效设置**

| 属性 | 说明                        | 类型 | 默认值 | 版本 |
| --- |---------------------------| --- | --- | --- |
| content | 提示内容                      | ReactNode | '' |  |
| duration | 自动关闭的延时，单位 s，设为 0 时不自动关闭  | number | 3 |  |
| icon | 自定义图标                     | ReactNode |  | 0.25.0 |
| showClose | 是否展示关闭按钮                  | boolean | true | 0.25.0 |
| textMaxWidth | 内容的最大宽度                   | number \| string | 450 | 0.25.0 |
| theme | 填充样式，支持 `light`, `normal` | string | `normal` | 1.0.0 |
| onClose | toast 关闭的回调函数             | () => void |  |  |
| stack | 是否堆叠 Toast                | boolean | false | 2.41.0  |

**若未在 Toast.config(config) 中特别声明，以下API需要调用额外的 ToastFactory.create(config) 创建新 Toast 生效设置**

| 属性 | 说明                                                                                        | 类型 | 默认值 | 版本 |
| --- |-------------------------------------------------------------------------------------------| --- | --- | --- |
| bottom | 弹出位置 bottom                                                                               | number \| string | - | 0.25.0 |
| getPopupContainer | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 container 和 内部的 .semi-toast-wrapper 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。  `position: relative` | () => HTMLElement \| null | () => document.body | 0.34.0 |
| left | 弹出位置 left                                                                                 | number \| string | - | 0.25.0 |
| right | 弹出位置 right                                                                                | number \| string | - | 0.25.0 |
| top | 弹出位置 top                                                                                  | number \| string | - | 0.25.0 |
| zIndex | 弹层 z-index 值                                                                              | number | 1010 |  |


-   `ToastFactory.create(config) => Toast`  
    如果您的应用中需要使用不同 config 的 Toast，可以使用 ToastFactory.create(config)创建新的 Toast (>= 1.23):

```jsx live=true noInline=true
import React from 'react';
import { Button } from '@douyinfe/semi-ui';

function Demo() {
    const ToastInCustomContainer = ToastFactory.create({
        getPopupContainer: () => document.getElementById('custom-toast-container'),
    });
    return (
        <div>
            <Button onClick={() => Toast.info('Toast')}>Default Toast</Button>
            <br />
            <br />
            <Button onClick={() => ToastInCustomContainer.info('Toast in some container')}>
                Toast in custom container
            </Button>
            <div id="custom-toast-container">custom container</div>
        </div>
    );
}
render(Demo);
```

全局销毁 ( >= 0.25.0 )：

-   `Toast.destroyAll()`

HookToast ( >= 1.2.0 )：

-   `Toast.useToast()`  
    当你需要使用 Context 时，可以通过 Toast.useToast 创建一个 contextHolder 插入相应的节点中。此时通过 hooks 创建的 Toast 将会得到 contextHolder 所在位置的所有上下文。创建的 toast 对象拥有与以下方法：`info`, `success`, `warning`, `error`, `close`。

## Accessibility

### ARIA

- Toast 的 role 为 alert

## 文案规范


<div style={{ border: '1px solid var(--semi-color-border)', padding: 10, marginBottom: 24, justifyContent: 'center', display: 'flex' }}>
    <ToastCard type='success' content='Ticket transferred' />
</div>


- 保持简洁
- 句尾不使用句号
- 使用 名词 + 动词 的格式进行说明

| ✅ 推荐用法 | ❌ 不推荐用法 |   
| --- | --- | 
| Language added | New language has been added successfully |
| Ticket transfer failed | Can't transfer ticket |

- 提供动作的提示消息
  - 只提供一个动作
  - 不使用类似于「已读」类的动作，例如 OK, Got it, Dismiss, Cancel


| ✅ 推荐用法 | ❌ 不推荐用法 |
| --- | --- |
|  <ToastCard type='error' content={<div>Ticket transfer failed <span style={{ color: 'var(--semi-color-primary)', marginLeft: 4, cursor: 'pointer' }}>Retry</span> </div>} /> |  <ToastCard type='error' content={<div>Ticket transfer failed <span style={{ color: 'var(--semi-color-primary)', marginLeft: 4, cursor: 'pointer' }}>Dismiss</span> </div>} /> |

## 设计变量

<DesignToken/>
