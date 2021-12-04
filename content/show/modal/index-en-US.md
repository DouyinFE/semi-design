---
localeCode: en-US
order: 51
category: Show
title:  Modal
subTitle: Modal
icon: doc-modal
brief: Modals are used to wait for the user to interact, inform the user of important information, or display more information without losing context.
---


## Demos

### How to import

```jsx import 
import { Modal } from '@douyinfe/semi-ui';
```
### Basic Usage

```jsx live=true
import React from 'react';
import { Modal, Button } from '@douyinfe/semi-ui';

class modalDemo extends React.Component {
    constructor() {
        super();
        this.state = {visible: false};
        this.showDialog = this.showDialog.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    showDialog() {
        this.setState({
            visible: true
        });
    }
    handleOk(e) {
        this.setState({
            visible: false
        });
        console.log('Ok button clicked');
    }
    handleAfterClose(){
        console.log('After Close callback executed');
    }
    handleCancel(e) {
        this.setState({
            visible: false
        });
        console.log('Cancel button clicked');
    }
    render() {
        return (
            <>
                <Button onClick={this.showDialog}>Open Modal</Button>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    afterClose={this.handleAfterClose} // >= 1.16.0
                    onCancel={this.handleCancel}
                >
                    This is the content of a basic modal.
                    <br/>
                    More content...
                </Modal>
            </>
        );
    }
}

```

### Mask Closable

You can set `maskClosable={false}` to prevent modal from closing when clicking on the mask.

```jsx live=true
import React from 'react';
import { Modal, Button } from '@douyinfe/semi-ui';

class modalDemo extends React.Component {
    constructor() {
        super();
        this.state = {visible: false};
        this.showDialog = this.showDialog.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    showDialog() {
        this.setState({
            visible: true
        });
    }
    handleOk(e) {
        this.setState({
            visible: false
        });
    }
    handleCancel(e) {
        this.setState({
            visible: false
        });
    }
    render() {
        return (
            <>
                <Button onClick={this.showDialog}>Mask Not Closable</Button>
                <Modal
                    title="Modal Title"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                >
                    <p>This is a modal that cannot be closed by clicking on the mask.</p>
                    <p>More content...</p>
                </Modal>
            </>
        );
    }
}
```

### Custom Button Text

You can set button text using `okText` and `cancelText`.

> In the case of creating a modal with static methods, you will have to use these two properties to set i18 texts at this moment. Because we cannot modify the React component tree, imperatively inserted components cannot consume Locale-related Context

```jsx live=true
import React from 'react';
import { Modal, Button } from '@douyinfe/semi-ui';

class modalDemo extends React.Component {
    constructor() {
        super();
        this.state = {visible: false};
        this.showDialog = this.showDialog.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    showDialog() {
        this.setState({
            visible: true
        });
    }
    handleOk(e) {
        this.setState({
            visible: false
        });
    }
    handleCancel(e) {
        this.setState({
            visible: false
        });
    }
    render() {
        return (
            <>
                <Button onClick={this.showDialog}>Custom Button Text</Button>
                <Modal
                    title="Custom Button Text"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={'Sounds great!'}
                    cancelText={'No, thanks.'}
                >
                    <p>This is a modal with customized button texts.</p>
                    <p>More content...</p>
                </Modal>
            </>
        );
    }
}
```

### Custom Button Properties

You can set button properties using `okButtonProps` and `cancelButtonProps`.

```jsx live=true
import React from 'react';
import { Modal, Button } from '@douyinfe/semi-ui';

class modalDemo extends React.Component {
    constructor() {
        super();
        this.state = {visible: false};
        this.showDialog = this.showDialog.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    showDialog() {
        this.setState({
            visible: true
        });
    }
    handleOk(e) {
        this.setState({
            visible: false
        });
    }
    handleCancel(e) {
        this.setState({
            visible: false
        });
    }
    render() {
        return (
            <>
                <Button onClick={this.showDialog}>Custom Button Properties</Button>
                <Modal
                    title="Custom Button Properties"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okButtonProps={{size: 'small', type: 'warning'}}
                    cancelButtonProps={{size: 'small', disabled: true}}
                >
                    <p>This is a modal with customized button props.</p>
                    <p>More content...</p>
                </Modal>
            </>
        );
    }
}
```

### Custom Header & Footer

For more customized modal, you could use `header` and `footer`. Set `header={null}` if you do not want header area, or `footer={null}` to remove footer area including buttons.

```jsx live=true
import React from 'react';
import { Modal, Button } from '@douyinfe/semi-ui';

class modalDemo extends React.Component {
    constructor() {
        super();
        this.state = {visible: false};
        this.showDialog = this.showDialog.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    showDialog() {
        this.setState({
            visible: true
        });
    }
    handleOk(e) {
        this.setState({
            visible: false
        });
    }
    handleCancel(e) {
        this.setState({
            visible: false
        });
    }
    render() {
        return (
            <>
                <Button onClick={this.showDialog}>Customized Footer</Button>
                <Modal
                    title="Customized Footer"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={
                        <Button type="primary" onClick={this.handleOk}>
                            Yes, I Understand
                        </Button>
                    }
                >
                    <p>This is a modal with a customized footer.</p>
                    <p>More content...</p>
                </Modal>
            </>
        );
    }
}
```

### Custom Style

You can use `style` to customize styling or position e.g. `style.top = '30vh'`, or use `centered` to center modal. Also, you could use `maskStyle` to customize mask style or `bodyStyle` for content style.

```jsx live=true
import React from 'react';
import { Modal, Button } from '@douyinfe/semi-ui';

class modalDemo extends React.Component {
    constructor() {
        super();
        this.state = {visible: false};
        this.showDialog = this.showDialog.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    showDialog() {
        this.setState({
            visible: true
        });
    }
    handleOk(e) {
        this.setState({
            visible: false
        });
    }
    handleCancel(e) {
        this.setState({
            visible: false
        });
    }
    render() {
        return (
            <>
                <Button onClick={this.showDialog}>Custom Style</Button>
                <Modal
                    title="Custom Style"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    centered
                    bodyStyle={{overflow: 'auto', height: 200}}
                >
                    <p style={{lineHeight: 1.8}}>Semi Design is a design system developed and maintained by IES Front-end Team and UED Team</p>
                    <p style={{lineHeight: 1.8}}>Semi Design create a consistent, good-looking, easy-to-use, and efficient user experience with a user-centric, content-first, and human-friendly design system.
                    </p>
                    <ul>
                        <li><p>Content-first</p></li>
                        <li><p>Customized theming</p></li>
                        <li><p>Internationalized</p></li>
                        <li><p>Humanism</p></li>
                    </ul>
                </Modal>
            </>
        );
    }
}
```

### Custom Modal

By using `header`, `footer`, etc, you could create any modal to your needs.

```jsx live=true
import React from 'react';
import { Modal, Button, List } from '@douyinfe/semi-ui';
import { IconVigoLogo, IconSemiLogo } from '@douyinfe/semi-icons';

class modalDemo extends React.Component {
    constructor() {
        super();
        this.state = {visible: false};
        this.showDialog = this.showDialog.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    showDialog() {
        this.setState({
            visible: true
        });
    }
    handleOk(e) {
        this.setState({
            visible: false
        });
    }
    handleCancel(e) {
        this.setState({
            visible: false
        });
    }
    render() {
        const data = [
            {
                icon: <IconSemiLogo style={{fontSize: 48}} />,
                title: 'Boost new feature adoption with Integration',
                content: 'Sample data is prepared for you to demostrate how Integration may be useful for your team'
            },
            {
                icon: <IconVigoLogo style={{fontSize: 48}} />,
                title: 'Introducing Dark Mode',
                content: 'Sample data is prepared for you to demostrate how Integration may be useful for your team'
            },
            {
                icon: <IconSemiLogo style={{fontSize: 48}} />,
                title: 'New List Component',
                content: 'Sample data is prepared for you to demostrate how Integration may be useful for your team'
            },
        ];
        const btnStyle = {
            width: 240,
            margin: '4px 50px',
        };
        const footer = (
            <div style={{textAlign: 'center'}}>
                <Button type="primary" theme="solid" onClick={this.handleOk} style={btnStyle}>
                    Continue
                </Button>
                <Button type="primary" theme="borderless" onClick={this.handleCancel} style={btnStyle}>
                    Learn more features
                </Button>
            </div>
        );
        return (
            <>
                <Button onClick={this.showDialog}>Customized Modal</Button>
                <Modal
                    header={null}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={footer}
                >
                    <h3 style={{textAlign: 'center', fontSize: 24, margin: 40}}>Semi Design New Features</h3>
                    <List
                        dataSource={data}
                        split={false}
                        renderItem={item => (
                            <List.Item
                                header={item.icon}
                                main={
                                    <div>
                                        <h6 style={{margin: 0, fontSize: 16}}>{item.title}</h6>
                                        <p style={{marginTop: 4, color: 'var(--semi-color-text-1)'}}>{item.content}</p>
                                    </div>
                                }
                            />)
                        }
                    />
                </Modal>
            </>
        );
    }
}
```

### Full Screen Modal

set `fullScreen={true}` can use full screen Modal

```jsx live=true
import React from 'react';
import { Modal, Button } from '@douyinfe/semi-ui';

() => {
    const [visible, setVisible] = useState(false);
    const onClose = () => {
        setVisible(false);
    };
    return (
        <>
            <Button onClick={() => setVisible(true)}>Open Full Screen Modal</Button>
            <Modal
                title="Title of Modal"
                fullScreen
                visible={visible}
                onOk={onClose}
                onCancel={onClose}
            >
                <p>This is a full screen modal</p>
                <p>More content...</p>
            </Modal>
        </>
    );
};
```

### Confirm Modal

You could use static methods to create a confirm Modal. Use `icon` to customize icon.

```jsx live=true hideInDSM
import React from 'react';
import { Modal, Button } from '@douyinfe/semi-ui';
import { IconSend } from '@douyinfe/semi-icons';

ModalComponent = function(props) {
    function success() {
        Modal.success({ 'title': 'This is a success message', 'content': 'bla bla bla...'});
    }

    function info() {
        Modal.info({ 'title': 'Here is some info', 'content': 'bla bla bla...' });
    }

    function error() {
        Modal.error({ 'title': 'Unfortunately, there is an error', 'content': 'bla bla bla...' });
    }

    function warning() {
        Modal.warning({ 'title': 'Warning: be cautious ahead', 'content': 'bla bla bla...' });
    }

    function confirm() {
        Modal.confirm({ 'title': 'Are you sure ?', 'content': 'bla bla bla...' });
    }

    function custom() {
        Modal.info({ 'title': 'This is a custom modal', 'content': 'bla bla bla...', icon: <IconSend />, cancelButtonProps: { theme: 'borderless' }, okButtonProps: { theme: 'solid' }, });
    }

    return (
        <div>
            <Button onClick={info}>Info</Button>
            <br/>
            <br/>
            <Button onClick={success}>Success</Button>
            <br/>
            <br/>
            <Button onClick={error} type="danger">Error</Button>
            <br/>
            <br/>
            <Button onClick={warning} type="warning">Warning</Button>
            <br/>
            <br/>
            <Button onClick={confirm} type="primary">Confirm</Button>
            <br/>
            <br/>
            <Button onClick={custom}>Custom</Button>
        </div>
    );
};
```

### useModal Hooks
You could use `Modal.useModal` to create a `contextHolder` that could access context.
```jsx live=true hideInDSM
import React from 'react';
import { ConfigProvider, Modal, Button } from '@douyinfe/semi-ui';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';

function Demo(props = {}) {
    const [modal, contextHolder] = Modal.useModal();
    const config = { 'title': 'This is a success message', 'content': 'Context consumer' };

    return (
        <ConfigProvider locale={en_GB}>
            <div>
                <Button
                    onClick={() => {
                        modal.confirm(config);
                    }}
                >
                    Confirm Modal
                </Button>
            </div>
            {contextHolder}
        </ConfigProvider>
    );
}
```

## API Reference

### Modal

| Properties        | Instructions                                       | type      | Default |
| ----------------- | -------------------------------------------------- | --------- | ------- |
| afterClose             | Callback function when modal closed completely   <br/>**>= v1.16.0**           | () => void  | -    |
| bodyStyle         | Content style                                      | CSSProperties    | -       |
| cancelButtonProps | Properties for cancel button                       | [ButtonProps](/en-US/input/button#API-reference)    | -       |
| cancelText        | Text for cancel button                             | string    | -       |
| centered          | Toggle whether to center modal                     | boolean   | false   |
| closable          | Toggle whether to show close button                | boolean   | true    |
| closeIcon         | Icon for close button  <br/>**>= v1.0.0** | ReactNode   | <IconClose /\>    |
| closeOnEsc        | Toggle whether to allow close modal by keyboard event Esc  <br/>**>= v1.0.0** | boolean | false       | 
| confirmLoading    | Toggle loading state of confirm button             | boolean   | false   |
| content            | Content            | ReactNode         | -      |
| footer            | Footer                                             | ReactNode | -       |
| fullScreen        | Is modal FullScreen（will override width and height） <br/>**>= v1.18.0**      | boolean            | false      |
| getPopupContainer | Specifies the parent DOM, and the bullet layer will be rendered to the DOM, you need to set 'position: relative` <br/>** >= v0.33.0 **  | () => HTMLElement |() => document.body |   
| hasCancel        | Toggle whether to show cancal button               | boolean    | true      |
| header            | Header                                             | ReactNode | -       |
| height            | Height                                             | number    | -       |
| icon              | Custom icon       <br/>**v1.1.0**                                          | ReactNode | -       |
| keepDOM | Keep dom tree when close modal <br/>**>= v1.0.0**  | boolean  | false |
| lazyRender | Lazy render modal, used with `keepDOM` <br/>**>=v1.0.0**  | boolean  | true |      
| mask              | Toggle whether to show mask                        | boolean   | true    |
| maskClosable      | Toggle whether to allow closing when clicking mask | boolean   | true    |
| maskStyle         | Mask style                                         | CSSProperties    | -       |
| motion            | animation switch           | object \| boolean | true    |
| okButtonProps     | Properties for confirm button                      | [ButtonProps](/en-US/input/button#API-reference)    | -       |
| okText            | Text for confirm button                            | string    | -       |
| okType            | Type for confirm button, optional: 'primary'、'secondary'、'tertiary'、'warning'、'danger'                            | string    | primary |
| size | Size of modal, one of `small`(448px), `medium`(684px), `large`(920px), `full-width`(100vw - 64px) <br/>**>= v1.0.0**  | string  | 'small' |
| style             | Inline style                                       | CSSProperties    | -       |
| title             | Title                                              | ReactNode    | -       |
| visible           | Toggle visibility of the modal                     | boolean   | false   |
| width             | Width                                              | number    | 448     |
| zIndex            | Z-index value for mask                             | number    | 1000    |
| onCancel          | Callback function when clicking cancel button      | (e: any) => void \| Promise<any\>  | -       |
| onOk              | Callback function when clicking confirm button     | (e: any) => void \| Promise<any\>  | -       |

### Static Method

-   `Modal.info`
-   `Modal.success`
-   `Modal.error`
-   `Modal.warning`
-   `Modal.confirm`

| Properties        | Instructions                                       | type              | Default |
| ----------------- | -------------------------------------------------- | ----------------- | ------- |
| bodyStyle         | Content style                                      | CSSProperties     | -       |
| cancelButtonProps | Properties for cancel button                       | ButtonProps       | -       |
| cancelText        | Text for cancel button                             | string            | -       |
| centered          | Toggle whether to center modal                     | boolean           | false   |
| closable          | Toggle whether to show close button                | boolean           | true    |
| content           | Content                                            | ReactNode         | -      |
| confirmLoading    | Toggle loading state of confirm button             | boolean           | false   |
| footer            | Footer                                             | ReactNode         | -       |
| header            | Header                                             | ReactNode         | -       |
| height            | Height                                             | number            | -       |
| icon              | Customized icon                                    | ReactNode         | -       |
| mask              | Toggle whether to show mask                        | boolean           | true    |
| maskClosable      | Toggle whether to allow closing when clicking mask | boolean           | true    |
| maskStyle         | Mask style                                         | CSSProperties     | -       |
| okButtonProps     | Properties for confirm button                      | ButtonProps       | -       |
| okText            | Text for confirm button                            | string            | -       |
| okType            | Type for confirm button                            | string            | primary |
| size | Size of modal, one of `small`(448px), `medium`(684px), `large`(920px), `full-width`(100vw - 64px) <br/>**v >= 0.33.0**  | string  | 'small' |  
| style             | Inline style                                       | CSSProperties     | -       |
| title             | Title                                              | ReactNode            | -       |
| width             | Width                                              | number            | 520     |
| zIndex            | Z-index value for mask                             | number            | 1000    |
Creating modal with the above methods will return a reference to the instance. You could use it to update or close the modal.|
| onCancel          | Callback function when clicking cancel button      | (e: any) => void \| Promise<any\>          | -       |
| onOk              | Callback function when clicking confirm button     | (e: any) => void \| Promise<any\>          | -       |

```
const modal = Modal.info();

modal.update({
  title: 'Updated Title',
  content: 'Updated Content',
});

modal.destroy();
```

-   `Modal.destroyAll` **v>=0.37.0**  

You could use Modal.destroyAll() to destroy Modal that created by methods above e.g. `.info()`

-   `Modal.useModal` **v>=1.2.0**  
When you need access Context, you could use `Modal.useModal` to create a `contextHolder` and insert to corresponding DOM tree. Modal created by hooks will be able to access the context where `contextHolder` is inserted. Hook modal shares the same methods with Modal.method.

## Design Tokens
<DesignToken/>

## FAQ

-   Why the button texts in Modal.confirm are not internationalized even when I use LocaleProvider? 
    In version >= 1.2.0, you could use `Modal.useModal` to create a `contextHolder` that is accessible to config from ConfigProvider or LocaleProvider.

    For version before 1.2 or if you don't want to use Hooks, you could also use `okText` and `cancelText` to set i18 texts at this moment.  
    
<!-- ## Related Material
```material
1, 55
``` -->