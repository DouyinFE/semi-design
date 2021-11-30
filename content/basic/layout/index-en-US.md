---
localeCode: en-US
order: 11
category: Basic
title:  Layout
subTitle: Layout
icon: doc-layout
dir: column
brief: Assist in the overall layout of a page.
---


## Overview

-   `Layout`: Layout containers. You can nest `Header` `Sider` `Content` `Footer` or `Layout` itself inside.
-   `Header`: Head component, can only be used inside `Layout`.
-   `Sider`: Sidebar, can only be used inside `Layout`.
-   `Content`: Content component, can only be used inside `Layout`.
-   `Footer`: Footer component, can only be used inside `Layout`.

> Note: Layout components are implemented with Flex layout. Browser compatibility may need to be considered.

## Demos

### How to import

```jsx import
import { Layout } from '@douyinfe/semi-ui';
```
### Three-section Layout

```jsx live=true dir="column" hideInDSM
import React from 'react';
import { Layout } from '@douyinfe/semi-ui';

() => {
    const { Header, Footer, Content } = Layout;
    return (
        <Layout className='components-layout-demo'>
            <Header>Header</Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Layout>
    );
};
```

### Left-sidebar Layout

```jsx live=true dir="column" hideInDSM
import React from 'react';
import { Layout } from '@douyinfe/semi-ui';

() => {
    const { Header, Footer, Sider, Content } = Layout;
    return (
        <Layout className='components-layout-demo'>
            <Header>Header</Header>
            <Layout >
                <Sider>Sider</Sider>
                <Content>Content</Content>
            </Layout>
            <Footer>Footer</Footer>
        </Layout>
    );
};
```

### Right-sidebar Layout

```jsx live=true dir="column" hideInDSM
import React from 'react';
import { Layout } from '@douyinfe/semi-ui';

() => {
    const { Header, Footer, Sider, Content } = Layout;
    return (
        <Layout className='components-layout-demo'>
            <Header>Header</Header>
            <Layout >
                <Content>Content</Content>
                <Sider>Sider</Sider>
            </Layout>
            <Footer>Footer</Footer>
        </Layout>
    );
};
```

### Sidebar Layout

```jsx live=true dir="column" hideInDSM
import React from 'react';
import { Layout } from '@douyinfe/semi-ui';

() => {
    const { Header, Footer, Sider, Content } = Layout;
    return (
        <Layout className='components-layout-demo' >
            <Sider>Sider</Sider>
            <Layout>
                <Header>Header</Header>
                <Content>Content</Content>
                <Footer>Footer</Footer>
            </Layout>
        </Layout>
    );
};
```

### Responsive Layout

Six response sizes are preset in the sidebar: `xs`,`sm`,`md`,`lg`,`xl`,`xxl`. You can use `breakpoint` to set breakpoints, and use `onBreakpoint` to call callback functions.

```jsx live=true dir="column" hideInDSM
import React from 'react';
import { Layout } from '@douyinfe/semi-ui';

() => {
    const onbreakpoint = (screen, bool) => {
        console.log(screen, bool);
    };
    const { Header, Footer, Sider, Content } = Layout;
    return (
        <Layout className='components-layout-demo'>
            <Header>Header</Header>
            <Layout >
                <Sider breakpoint={['md']} onBreakpoint={onbreakpoint}>Sider</Sider>
                <Content>Content</Content>
            </Layout>
            <Footer>Footer</Footer>
        </Layout>
    );
};
```

## Layout Examples

### Top-nav Layout

```jsx live=true dir="column" hideInDSM
import React from 'react';
import { Layout, Nav, Button, Breadcrumb, Skeleton, Avatar } from '@douyinfe/semi-ui';
import { IconSemiLogo, IconBell, IconHelpCircle, IconBytedanceLogo, IconHome, IconLive, IconSetting } from '@douyinfe/semi-icons';

() => {
    const { Header, Footer, Content } = Layout;
    return (
        <Layout style={{border: '1px solid var(--semi-color-border)'}}>
            <Header style={{backgroundColor: 'var(--semi-color-bg-1)'}}>
                <div>
                    <Nav mode='horizontal' defaultSelectedKeys={['Home']}>
                        <Nav.Header>
                            <IconSemiLogo style={{ fontSize: 36 }} />
                        </Nav.Header>
                        <Nav.Item itemKey='Home' text='Home' icon={<IconHome size="large" />} />
                        <Nav.Item itemKey='Live' text='Live' icon={<IconLive size="large" />} />
                        <Nav.Item itemKey='Setting' text='Setting' icon={<IconSetting size="large" />} />
                        <Nav.Footer>
                            <Button
                                theme="borderless"
                                icon = {<IconBell size="large"/>}
                                style={{
                                    color:'var(--semi-color-text-2)',
                                    marginRight: '12px',
                                }}
                            />
                            <Button
                                theme="borderless"
                                icon = {<IconHelpCircle size="large"/>}
                                style={{
                                    color:'var(--semi-color-text-2)',
                                    marginRight: '12px',
                                }}
                            />
                            <Avatar color='orange' size='small'>YJ</Avatar>
                        </Nav.Footer>
                    </Nav>
                </div>
            </Header>
            <Content
                style={{
                    padding: '24px',
                    backgroundColor: 'var(--semi-color-bg-0)'
                }}
            >
                <Breadcrumb
                    style={{
                        marginBottom: '24px'
                    }}
                    routes={['Home', 'Page Section', 'Pagge Ssection', 'Detail']} />
                <div
                    style={{
                        borderRadius: '10px',
                        border: '1px solid var(--semi-color-border)',
                        height: '376px',
                        padding: '32px'
                    }}
                >
                    <Skeleton placeholder={(<Skeleton.Paragraph rows={2}/>)} loading={true}>
                        <p>Hi, Bytedance dance dance.</p>
                        <p>Hi, Bytedance dance dance.</p>
                    </Skeleton>
                </div>
            </Content>
            <Footer
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '20px',
                    color: 'var(--semi-color-text-2)',
                    backgroundColor: 'rgba(var(--semi-grey-0), 1)',
                }}
            >
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <IconBytedanceLogo size='large' style={{marginRight: '8px'}}/>
                    <span>Copyright © 2019 ByteDance. All Rights Reserved. </span>
                </span>
                <span>
                    <span style={{marginRight: '24px'}}>Customer Service</span>
                    <span>Feedback</span>
                </span>
            </Footer>
        </Layout>
    );
};
```

### Top-Nav SideBar Layout

```jsx live=true dir="column" hideInDSM
import React from 'react';
import { Layout, Nav, Button, Breadcrumb, Skeleton, Avatar } from '@douyinfe/semi-ui';
import { IconSemiLogo, IconBell, IconHelpCircle, IconBytedanceLogo, IconHome, IconHistogram, IconLive, IconSetting } from '@douyinfe/semi-icons';

() => {
    const { Header, Footer, Sider, Content } = Layout;
    return (
        <Layout style={{border: '1px solid var(--semi-color-border)'}}>
            <Header style={{backgroundColor: 'var(--semi-color-bg-1)'}}>
                <div >
                    <Nav mode='horizontal' defaultSelectedKeys={['Home']}>
                        <Nav.Header>
                            <IconSemiLogo style={{fontSize: 36}} />
                        </Nav.Header>
                        <span
                            style={{
                                color: 'var(--semi-color-text-2)'
                            }}
                        >
                            <span
                                style={{
                                    marginRight: '24px',
                                    color: 'var(--semi-color-text-0)',
                                    fontWeight: '600',
                                }}>Semi Design</span>
                            <span style={{marginRight: '24px'}}>Semi Theme</span>
                            <span>Semi Blocks</span>
                        </span>
                        <Nav.Footer>
                            <Button
                                theme="borderless"
                                icon = {<IconBell size="large"/>}
                                style={{
                                    color:'var(--semi-color-text-2)',
                                    marginRight: '12px',
                                }}
                            />
                            <Button
                                theme="borderless"
                                icon = {<IconHelpCircle size="large"/>}
                                style={{
                                    color:'var(--semi-color-text-2)',
                                    marginRight: '12px',
                                }}
                            />
                            <Avatar color='orange' size='small'>YJ</Avatar>
                        </Nav.Footer>
                    </Nav>
                </div>
            </Header>
            <Layout >
                <Sider style={{backgroundColor: 'var(--semi-color-bg-1)'}}>
                    <Nav
                        style={{ maxWidth: 220, height: '100%' }}
                        defaultSelectedKeys={['Home']}
                        items={[
                            { itemKey: 'Home', text: 'Home', icon: <IconHome size="large" /> },
                            { itemKey: 'Histogram', text: 'Histogram', icon: <IconHistogram size="large" /> },
                            { itemKey: 'Live', text: 'Live', icon: <IconLive size="large" /> },
                            { itemKey: 'Setting', text: 'Setting', icon: <IconSetting size="large" /> },
                        ]}
                        footer={{
                            collapseButton: true,
                        }}
                    />
                </Sider>
                <Content
                    style={{
                        padding: '24px',
                        backgroundColor: 'var(--semi-color-bg-0)'
                    }}
                >
                    <Breadcrumb
                        style={{
                            marginBottom: '24px'
                        }}
                        routes={['Home', 'Page Section', 'Ppage Ssection', 'Detail']} />
                    <div
                        style={{
                            borderRadius: '10px',
                            border: '1px solid var(--semi-color-border)',
                            height: '376px',
                            padding: '32px'
                        }}
                    >
                        <Skeleton placeholder={(<Skeleton.Paragraph rows={2}/>)} loading={true}>
                            <p>Hi, Bytedance dance dance.</p>
                            <p>Hi, Bytedance dance dance.</p>
                        </Skeleton>
                    </div>
                </Content>
            </Layout>
            <Footer
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '20px',
                    color: 'var(--semi-color-text-2)',
                    backgroundColor: 'rgba(var(--semi-grey-0), 1)',
                }}
            >
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <IconBytedanceLogo size="large" style={{ marginRight: '8px' }} />
                    <span>Copyright © 2019 ByteDance. All Rights Reserved. </span>
                </span>
                <span>
                    <span style={{marginRight: '24px'}}>Customer Service</span>
                    <span>Feedback</span>
                </span>
            </Footer>
        </Layout>
    );
};
```

### SideBar Navigation

```jsx live=true dir="column" hideInDSM
import React from 'react';
import { Layout, Nav, Button, Breadcrumb, Skeleton, Avatar } from '@douyinfe/semi-ui';
import { IconBell, IconHelpCircle, IconBytedanceLogo, IconHome, IconHistogram, IconLive, IconSetting } from '@douyinfe/semi-icons';

() => {
    const { Header, Footer, Sider, Content } = Layout;
    return (
        <Layout style={{border: '1px solid var(--semi-color-border)'}}>
            <Sider style={{backgroundColor: 'var(--semi-color-bg-1)'}}>
                <Nav
                    defaultSelectedKeys={['Home']}
                    style={{ maxWidth: 220, height: '100%' }}
                    items={[
                        { itemKey: 'Home', text: 'Home', icon: <IconHome size="large" /> },
                        { itemKey: 'Histogram', text: 'Histogram', icon: <IconHistogram size="large" /> },
                        { itemKey: 'Live', text: 'Live', icon: <IconLive size="large" /> },
                        { itemKey: 'Setting', text: 'Setting', icon: <IconSetting size="large" /> },
                    ]}
                    header={{
                        logo: <img src="//lf1-cdn-tos.bytescm.com/obj/ttfe/ies/semi/webcast_logo.svg" />,
                        text: 'Webcast'
                    }}
                    footer={{
                        collapseButton: true,
                    }}
                />
            </Sider>
            <Layout>
                <Header style={{backgroundColor: 'var(--semi-color-bg-1)'}}>
                    <Nav
                        mode='horizontal'
                        footer={
                            <>
                                <Button
                                    theme="borderless"
                                    icon = {<IconBell size="large" />}
                                    style={{
                                        color:'var(--semi-color-text-2)',
                                        marginRight: '12px',
                                    }}
                                />
                                <Button
                                    theme="borderless"
                                    icon = {<IconHelpCircle size="large" />}
                                    style={{
                                        color:'var(--semi-color-text-2)',
                                        marginRight: '12px',
                                    }}
                                />
                                <Avatar color='orange' size='small'>YJ</Avatar>
                            </>
                        }
                    >
                    </Nav>
                </Header>
                <Content
                    style={{
                        padding: '24px',
                        backgroundColor: 'var(--semi-color-bg-0)'
                    }}
                >
                    <Breadcrumb
                        style={{
                            marginBottom: '24px'
                        }}
                        routes={['Home', 'Page Section', 'Pagge Ssection', 'Detail']} />
                    <div
                        style={{
                            borderRadius: '10px',
                            border: '1px solid var(--semi-color-border)',
                            height: '376px',
                            padding: '32px'
                        }}
                    >
                        <Skeleton placeholder={(<Skeleton.Paragraph rows={2}/>)} loading={true}>
                            <p>Hi, Bytedance dance dance.</p>
                            <p>Hi, Bytedance dance dance.</p>
                        </Skeleton>
                    </div>
                </Content>
                <Footer
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '20px',
                        color: 'var(--semi-color-text-2)',
                        backgroundColor: 'rgba(var(--semi-grey-0), 1)',
                    }}
                >
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <IconBytedanceLogo size="large" style={{ marginRight: '8px' }} />
                        <span>Copyright © 2019 ByteDance. All Rights Reserved. </span>
                    </span>
                    <span>
                        <span style={{marginRight: '24px'}}>Customer Service</span>
                        <span>Feedback</span>
                    </span>
                </Footer>
            </Layout>
        </Layout>
    );
};
```

## API Reference

### Layout

> `Layout.Header`, `Layout.Footer`, `Layout.Content` use same API as `Layout`

| Properties | Instructions                                                                                                                               | type    | Default |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ------- |
| className  | Class name                                                                                                                                 | string  | -       |
| hasSider   | Indicates that there is a Sider in the child element, which is generally not specified. It can be used to avoid style flashing during SSR. | boolean | -       |
| style      | Style                                                                                                                                      | CSSProperties  | -       |

### Layout.Sider

| Properties   | Instructions                                                                           | type                                 | Default |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------ | ------- |
| breakpoint   | Breakpoints that trigger responsive layout, one of 'xs', 'sm', 'md', 'lg', 'xl', 'xxl' | String[]                             | -       |
| className    | Class name                                                                             | string                               | -       |
| style        | Style                                                                                  | CSSProperties                               | -       |
| onBreakpoint | Callback function when triggering a responsive layout breakpoint                       | (screen: string, broken: bool) => void | -       |

### responsive map

```text
{
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
}
```

<!-- ## Related Material
```material
2, 43
``` -->