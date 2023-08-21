---
localeCode: en-US
order: 73
category: Feedback
title: Toast
subTitle: Toast
icon: doc-toast
width: 65%
brief: Toast component is used to give timely feedback to user's operations. It could be the result feedback of the operation, such as success, failure, error, warning, etc.
---

## Demos

### How to import

```jsx
import { Toast } from '@douyinfe/semi-ui';
```

### Basic Usage

```jsx live=true noInline=true
import React from 'react';
import { Toast, Button } from '@douyinfe/semi-ui';
import { throttle } from 'lodash-es';

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

### Other Types

Use different methods to show different Toast including success, warning, error and info.

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

### Colored Background

You could use `theme` for a colored background style. Default is `normal`.

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

### Stacking styles
You can apply stacking styles to multiple Toasts on the same screen through the stack property, and Hover expands them. （>=2.42.0）


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

### Custom Children with Link

Informational feedback

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
                    More Info
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
                    <Text link>More Info</Text>
                    <Text link style={{ marginLeft: 20 }}>
                        Later
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

### Delay

Use `duration` to set up time delay. By default it closes after 3 seconds.

```jsx live=true noInline=true hideInDSM
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

### Manual Close

Set `duration` to 0 if you do not want the Notification to close by itself. In this case, it could only be closed manually.

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

### Update Toast Content

Use unique Toast `id` to update toast content.

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

### useToast Hooks

You could use `Toast.useToast` to create a `contextHolder` that could access context. Created toast will be inserted to where contextHolder is placed.

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

You could also use `ReactDOM.createPortal` to insert toast in a Portal.

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

## API Reference

The static methods provided are as follows: Display: You can pass in `options` object or string directly. Methods return the value of `toastId`: `const toastId = Toast.info({ /*...options*/ })`

-   `Toast.info(options || string)`
-   `Toast.error(options || string)`
-   `Toast.warning(options || string)`
-   `Toast.success(options || string)`
-   `Toast.close(toastId)`  Close Manually ( `toastId` is the return value of the display methods)
-   `Toast.config(config)`  The global configuration is set before any method call, and takes effect only once (>= 0.25.0)

**The following APIs can take effect without calling additional ToastFactory.create(config) to create a new Toast**

| Properties | Instructions                                       | type | Default | version |
| --- |----------------------------------------------------| --- | --- |---------|
| content | Toast content                                      | string | ReactNode | ''      |  |
| duration | Automatic close delay, no auto-close when set to 0 | number | 3 |         |
| icon | Custom icons                                       | ReactNode |  | 0.25.0  |
| showClose | Toggle Whether show close button                   | boolean | true | 0.25.0  |
| textMaxWidth | Maximum width of content                           | number \| string | 450 | 0.25.0  |
| theme | Style of background fill, one of `light`, `normal` | string | `normal` | 1.0.0   |
| onClose | Callback function when closing toast               | () => void |  |         |
| stack | Whether to stack toast                             | boolean | false | 2.42.0  |

**If not specifically declared in Toast.config(config), the following APIs need to call additional ToastFactory.create(config) to create new Toast settings**

| Properties | Instructions                                                                                                                                                | type | Default | version |
| --- |-------------------------------------------------------------------------------------------------------------------------------------------------------------| --- | --- | --- |
| bottom | Pop-up position bottom                                                                                                                                      | number \| string | - | 0.25.0 |
| getPopupContainer | Specifies the parent DOM, and the bullet layer will be rendered to the DOM, you need to set container and inner .semi-toast-wrapper  'position: relative`   This will change the DOM tree position, but not the view's rendering position.  | () => HTMLElement \| null | () => document.body | 0.34.0 |
| left | Pop-up position left                                                                                                                                        | number \| string | - | 0.25.0 |
| right | Pop-up position right                                                                                                                                       | number \| string | - | 0.25.0 |
| top | Pop-up position top                                                                                                                                         | number \| string | - | 0.25.0 |
| zIndex | Z-index value                                                                                                                                               | number | 1010 |  |

-   `ToastFactory.create(config) => Toast`  
    If you need Toast with different configs in your application, you can use ToastFactory.create(config)to create a new Toast (>= 1.23):

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

Globally Destroy (>= 0.25.0):

-   `Toast.destroyAll()`

HookToast

-   `Toast.useToast` **v>=1.2.0**  
    When you need access Context, you could use `Toast.useToast` to create a `contextHolder` and insert to corresponding DOM tree. Toast created by hooks will be able to access the context where `contextHolder` is inserted. Hook toast has following methods: `info`, `success`, `warning`, `error`, `close`.

## Accessibility

### ARIA

- The role of Toast is alert

## Content Guidelines

<div style={{ border: '1px solid var(--semi-color-border)', padding: 10, marginBottom: 24, justifyContent: 'center', display: 'flex' }}>
    <ToastCard type='success' content='Ticket transferred' />
</div>

- Keep it simple
- Do not use periods at the end of sentences
- Explain using the noun + verb format

| ✅ Recommended usage | ❌ Deprecated usage |
| --- | --- |
| Language added | New language has been added successfully |
| Ticket transfer failed | Can't transfer ticket |

- Provide prompt message for action
  - only provide one action
  - Don't use actions like "read" like OK, Got it, Dismiss, Cancel

| ✅ Recommended usage | ❌ Deprecated usage |
| --- | --- |
|  <ToastCard type='error' content={<div>Ticket transfer failed <span style={{ color: 'var(--semi-color-primary)', marginLeft: 4, cursor: 'pointer' }}>Retry</span> </div>} /> |  <ToastCard type='error' content={<div>Ticket transfer failed <span style={{ color: 'var(--semi-color-primary)', marginLeft: 4, cursor: 'pointer' }}>Dismiss</span> </div>} /> |

## Design Tokens

<DesignToken/>
