---
localeCode: zh-CN
order: 78
category: Plus
title:  Chat 对话
icon: doc-configprovider
dir: column
brief: 用于快速搭建对话内容
---

## 使用场景

Chat 组件可用于普通会话，AI 会话等场景。

对话内容渲染基于 MarkdownRender 组件，支持 Markdown 和 MDX，可实现图片，表格，链接，加粗，代码区等常用富文本功能。也可通过 JSX 实现更加复杂定制化的文档撰写与展示需求。


## 代码演示

### 如何引入

```jsx
import { Chat } from '@douyinfe/semi-ui';
```

### 基本用法

通过设置 `chats` 和 `onChatsChange`，`onMessageSend` 实现基础对话显示和交互。

对话是多方参与，多轮交互的场景。可通过 `roleConfig` 传入角色信息（包括名称，头像等），具体参数细节 [RoleConfig](#roleConfig)。

使用 `align` 属性可以设置对话的对齐方式，支持左右对齐（`leftRight`， 默认）和左对齐（`leftAlign`）。

```jsx live=true noInline=true dir="column"
import React, {useState, useCallback} from 'react';
import { Chat, Radio } from '@douyinfe/semi-ui';

const defaultMessage = [
    {
        role: 'system',
        id: '1',
        createAt: 1715676751919,
        content: "Hello, I'm your AI assistant.",   
    },
    {
        role: 'user',
        id: '2',
        createAt: 1715676751919,
        content: "This is a  request",   
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: "This is an answer",   
    }
];

const roleInfo = {
    user:  {
        name: 'User',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
        name: 'Assistant',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
        name: 'System',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    }
}

const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 400,
}

let id = 0;
function getId() {
    return `id-${id++}`
}

function DefaultChat() {
    const [message, setMessage] = useState(defaultMessage);
    const [align, setAlign] = useState('leftRight');

    const onMessageSend = useCallback((content, attachment) => {
        const newUserMessage = {
            role: 'user',
            id: getId(),
            content: content,
            createAt: Date.now(),
            attachment: attachment,
        }
        const newAssistantMessage = {
            role: 'assistant',
            id: getId(),
            createAt: Date.now(),
            content: "这是一条 mock 回复信息",
        }
        setMessage((message) => {
            return [ ...message, newUserMessage, newAssistantMessage ];
        })
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const onAlignChange = useCallback((e) => {
        setAlign(e.target.value);
    }, [])

    return (
        <>
            <span>会话对齐方式：</span>
            <RadioGroup value={align} onChange={onAlignChange}>
                <Radio value={'leftRight'}>左右对齐</Radio>
                <Radio value={'leftAlign'}>左对齐</Radio>
            </RadioGroup>
            <Chat 
                key={align}
                align={align}
                style={commonOuterStyle}
                chats={message}
                roleConfig={roleInfo}
                onChatsChange={onChatsChange}
                onMessageSend={onMessageSend}
            />
        </>
    )
}

render(DefaultChat);
```

### 消息状态

chats 类型为 `Message[]`， `Message` 包含对话的各种信息，如角色（role）、内容（content）、附件（attachment）、状态（status）
、唯一标识（id）、创建时间（createAt）等，具体见 [Message](#Message)。其中 status 不同，会话样式不同。

``` jsx live=true noInline=true dir="column"
import React, {useState, useCallback} from 'react';
import { Chat } from '@douyinfe/semi-ui';

const defaultMessage = [
    {
        role: 'assistant',
        id: '1',
        createAt: 1715676751919,
        content: "请求成功",   
    },
    {
        id: 'loading',
        role: 'assistant',
        status: 'loading'
    },
    {
        role: 'assistant',
        id: 'error',
        content: '请求错误',
        status: 'error'
    }
];

const roleInfo = {
    user:  {
        name: 'User',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
        name: 'Assistant',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
        name: 'System',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    }
}

const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 300,
}

let id = 0;
function getId() { return `id-${id++}` }

function MessageStatus() {
    const [message, setMessage] = useState(defaultMessage);

    const onMessageSend = useCallback((content, attachment) => {
        const newUserMessage = {
            role: 'user',
            id: getId(),
            content: content,
            createAt: Date.now(),
            attachment: attachment,
        }
        const newAssistantMessage = {
            role: 'assistant',
            id: getId(),
            createAt: Date.now(),
            content: "这是一条 mock 回复信息",
        }
        setMessage((message) => {
            return [ ...message, newUserMessage, newAssistantMessage ];
        })
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    return (
        <Chat 
            style={commonOuterStyle}
            chats={message}
            roleConfig={roleInfo}
            onChatsChange={onChatsChange}
            onMessageSend={onMessageSend}
        />
    )
}

render(MessageStatus);
```

### 动态更新数据

对于后台返回 Serve Side Event 数据情况，可将获取到的数据用于更新 `chats`，对话内容将实时更新。

`showStopGenerate` 参数可用于设置是否展示停止生成按钮，默认为 `false`。 可以在 `onStopGenerator` 中处理停止生成逻辑。

```jsx live=true noInline=true dir="column"
import React, {useState, useCallback} from 'react';
import { Chat } from '@douyinfe/semi-ui';

const defaultMessage = [
    {
        role: 'system',
        id: '1',
        createAt: 1715676751919,
        content: "Hello, I'm your AI assistant.",   
    }
];

const roleInfo = {
    user:  {
        name: 'User',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
        name: 'Assistant',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
        name: 'System',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    }
}

const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 300,
}

let id = 0;
function getId() {
    return `id-${id++}`
}

function DynamicUpdateChat() {
    const [message, setMessage] = useState(defaultMessage);
    const intervalId = useRef();
    const onMessageSend = useCallback((content, attachment) => {
        setMessage((message) => {
            return [
                ...message,
                {
                    role: 'user',
                    createAt: Date.now(),
                    id: getId(),
                    content: content,
                    attachment: attachment,
                },
                {
                    role: 'assistant',
                    status: 'loading',
                    createAt: Date.now(),
                    id: getId()
                }
            ]
        }); 
        generateMockResponse(content);
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const generateMockResponse = useCallback((content) => {
        const id = setInterval(() => {
            setMessage((message) => {
                const lastMessage = message[message.length - 1];
                let newMessage = {...lastMessage};
                if (lastMessage.status === 'loading') {
                    newMessage = {
                        ...newMessage,
                        content:  `mock Response for ${content} \n`,
                        status: 'incomplete'
                    }
                } else if (lastMessage.status === 'incomplete') {
                    if (lastMessage.content.length > 200) {
                        clearInterval(id);
                        intervalId.current = null
                        newMessage = {
                            ...newMessage,
                            content: `${lastMessage.content} mock stream message`,
                            status: 'complete'
                        }
                    } else {
                        newMessage = {
                            ...newMessage,
                            content: `${lastMessage.content} mock stream message`
                        }
                    }  
                }
                return [ ...message.slice(0, -1), newMessage ]
            })
        }, 400);
        intervalId.current = id;
    }, []);

    const onStopGenerator = useCallback(() => {
        if (intervalId.current) {
            clearInterval(intervalId.current);
            setMessage((message) => {
                const lastMessage = message[message.length - 1];
                if (lastMessage.status && lastMessage.status !== 'complete') {
                    const lastMessage = message[message.length - 1];
                    let newMessage = {...lastMessage};
                    newMessage.status = 'complete';
                    return [
                        ...message.slice(0, -1),
                        newMessage
                    ]
                } else {
                    return message;
                }
            })
        }
    }, [intervalId]);

    return (
        <Chat 
            chats={message}
            showStopGenerate={true}
            style={commonOuterStyle}
            onStopGenerator={onStopGenerator}
            roleConfig={roleInfo}
            onChatsChange={onChatsChange}
            onMessageSend={onMessageSend}
        />
    )
}

render(DynamicUpdateChat);
```

### 自定义渲染会话框

通过 `chatBoxRenderConfig` 传入自定义渲染配置, chatBoxRenderConfig 类型如下

```ts
interface ChatBoxRenderConfig {
    renderChatBoxTitle?: (props: {role?: Metadata, defaultTitle?: ReactNode}) => ReactNode;
    renderChatBoxAvatar?: (props: { role?: Metadata, defaultAvatar?: ReactNode}) => ReactNode;
    renderChatBoxContent?: (props: {message?: Message, role?: Metadata, defaultContent?: ReactNode | ReactNode[], className?: string}) => ReactNode;
    renderChatBoxAction?: (props: {message?: Message, defaultActions?: ReactNode | ReactNode[], className: string}) => ReactNode;
    renderFullChatBox?: (props: {message?: Message, role?: Metadata, defaultNodes?: FullChatBoxNodes, className: string}) => ReactNode;
}
```

自定义渲染头像和标题，可通过 `renderChatBoxAvatar` 和 `renderChatBoxTitle` 实现。

```jsx live=true noInline=true dir="column"

import React, {useState, useCallback} from 'react';
import { Chat, Avatar, Tag } from '@douyinfe/semi-ui';

const defaultMessage = [
    {
        role: 'system',
        id: '1',
        createAt: 1715676751919,
        content: "Hello, I'm your AI assistant.",   
    },
    {
        role: 'user',
        id: '2',
        createAt: 1715676751919,
        content: "介绍一下 semi design", 
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: 'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统。作为一个全面、易用、优质的现代应用UI解决方案[[1]](https://semi.design/zh-CN/start/introduction)'
    },

];

const roleInfo = {
    user:  {
        name: 'User',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
        name: 'Assistant',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
        name: 'System',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    }
}

const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 300,
}

let id = 0;
function getId() { return `id-${id++}`; }

function CustomRender() {
    const [title, setTitle] = useState('null');
    const [avatar, setAvatar] = useState('null');
    const [message, setMessage] = useState(defaultMessage);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const customRenderAvatar = useMemo(()=> {
        switch(avatar) {
            case 'custom': return (props) => {
                    const { role, defaultAvatar } = props;
                    return <Avatar size="extra-small" shape="square" style={{ flexShrink: '0'}}>{role.name}</Avatar >
                }
            case 'null': return () => null
            case 'default': return undefined;
        }
    }, [avatar]);

    const customRenderTitle = useMemo(()=> {
        switch(title) {
            case 'custom': return (props) => {
                    const { role, defaultTitle } = props;
                    return <Tag shape='circle' style={{marginBottom: 8}}>{defaultTitle}</Tag>
            }
            case 'null': return () => null
            case 'default': return undefined;
        }
    }, [title]);;

    const onAvatarChange = useCallback((e) => { setAvatar(e.target.value) }, []);
    const onTitleChange = useCallback((e) => { setTitle(e.target.value) }, []);

     const onMessageSend = useCallback((content, attachment) => {
        const newUserMessage = {
            role: 'user',
            id: getId(),
            content: content,
            attachment: attachment
        }
        const newAssistantMessage = {
            role: 'assistant',
            id: getId(),
            content: `This is a mock response`
        }
        setMessage((message) => ([...message, newUserMessage, newAssistantMessage]));
    }, []);

    return (
        <>
            <div style={{ marginLeft: 12 }}>
                <span >头像渲染模式: </span>
                <RadioGroup onChange={onAvatarChange} value={avatar} aria-label="单选组合示例" name="demo-radio-group">
                    <Radio value={'default'}>默认头像</Radio>
                    <Radio value={'null'}>无头像</Radio>
                    <Radio value={'custom'}>自定义头像</Radio>
                </RadioGroup>
                <br />
                <br />
                <span >标题渲染模式: </span>
                <RadioGroup onChange={onTitleChange} value={title} aria-label="单选组合示例" name="demo-radio-group">
                    <Radio value={'default'}>默认标题</Radio>
                    <Radio value={'null'}>无标题</Radio>
                    <Radio value={'custom'}>自定义标题</Radio>
                </RadioGroup>
            </div>
            <br />
            <Chat
                chatBoxRenderConfig={{
                    renderChatBoxTitle: customRenderTitle,
                    renderChatBoxAvatar: customRenderAvatar
                }} 
                key={`${avatar}${title}`}
                style={commonOuterStyle}
                chats={message}
                onChatsChange={onChatsChange}
                onMessageSend={onMessageSend}
                roleConfig={roleInfo}
            />
        </>
    );
}

render(CustomRender);
```

鼠标移动到会话上，即可显示会话操作区，通过 `renderChatBoxAction` 自定义渲染操作区

```jsx live=true noInline=true dir="column"
import React, {useState, useCallback} from 'react';
import { Chat, Dropdown } from '@douyinfe/semi-ui';
import { IconForward } from '@douyinfe/semi-icons';

const defaultMessage = [
    {
        role: 'system',
        id: '1',
        createAt: 1715676751919,
        content: "Hello, I'm your AI assistant.",   
    },
    {
        role: 'user',
        id: '2',
        createAt: 1715676751919,
        content: "介绍一下 semi design", 
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: 'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统',
    }
];

const roleInfo = {
    user:  {
        name: 'User',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
        name: 'Assistant',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
        name: 'System',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    }
}

const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 300,
}

let id = 0;
function getId() { return `id-${id++}`; }

const CustomActions = React.memo((props) => {
    const { role, message, defaultActions, className } = props;
    const myRef = useRef();
    const getContainer = useCallback(() => {
        if (myRef.current) {
            const element = myRef.current;
            let parentElement = element.parentElement;
            while (parentElement) {
                if (parentElement.classList.contains('semi-chat-chatBox-wrap')) {
                    return parentElement;
                }
                parentElement = parentElement.parentElement;
            }
        }
    }, [myRef]);

    return <span 
        className={className}
        ref={myRef}
    >
        {defaultActions.map((item, index)=> {
            return <span key={index}>{item}</span>
        })}
        {<Dropdown
            key="dropdown"
            render={
                <Dropdown.Menu >
                    <Dropdown.Item icon={<IconForward />}>分享</Dropdown.Item>
                </Dropdown.Menu>
            }
            trigger="click"
            position="top"
            getPopupContainer={getContainer}
        >
            <Button 
                className='semi-chat-chatBox-action-btn'
                icon={<IconMoreStroked/>}
                theme='borderless'
                type='tertiary'
            />
        </Dropdown>}
    </span>
});

function CustomRender() {
    const [message, setMessage] = useState(defaultMessage);

    const customRenderAction = useCallback((props) => {
        return <CustomActions {...props} />
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

     const onMessageSend = useCallback((content, attachment) => {
        const newUserMessage = {
            role: 'user',
            id: getId(),
            content: content,
            attachment: attachment
        }
        const newAssistantMessage = {
            role: 'assistant',
            id: getId(),
            content: `This is a mock response`
        }
        setMessage((message) => ([...message, newUserMessage, newAssistantMessage]));
    }, []);

    return (
        <Chat
            chatBoxRenderConfig={{ 
                renderChatBoxAction: customRenderAction 
            }}
            style={commonOuterStyle}
            chats={message}
            onChatsChange={onChatsChange}
            onMessageSend={onMessageSend}
            roleConfig={roleInfo}
        />
    );
}

render(CustomRender);
```

通过 `renderChatBoxContent` 自定义操作区域

```jsx live=true noInline=true dir="column"
import React, {useState, useCallback} from 'react';
import { Chat, MarkdownRender } from '@douyinfe/semi-ui';

const defaultMessage = [
    {
        role: 'system',
        id: '1',
        createAt: 1715676751919,
        content: "Hello, I'm your AI assistant.",   
    },
    {
        role: 'user',
        id: '2',
        createAt: 1715676751919,
        content: "介绍一下 semi design", 
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: 'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统',
    }
];

const roleInfo = {
    user:  {
        name: 'User',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
        name: 'Assistant',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
        name: 'System',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    }
}

const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 300,
}

let id = 0;
function getId() { return `id-${id++}` }

function CustomRender() {
    const [message, setMessage] = useState(defaultMessage);

    const customRenderAction = useCallback((props) => {
        return <CustomActions {...props} />
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

     const onMessageSend = useCallback((content, attachment) => {
        const newUserMessage = {
            role: 'user',
            id: getId(),
            content: content,
            attachment: attachment
        }
        const newAssistantMessage = {
            role: 'assistant',
            id: getId(),
            content: `This is a mock response`
        }
        setMessage((message) => ([...message, newUserMessage, newAssistantMessage]));
    }, []);

    const renderContent = useCallback((props) => {
        const { role, message, defaultNode, className } = props;
        return <div className={className}>
            <strong style={{color: message.role === 'user' ? 'var(--semi-color-white)' : 'var(--semi-color-text-0)'}}>---custom render content---</strong>
            <MarkdownRender raw={message.content}/>
        </div>
    }, []);

    return (
        <Chat
            style={commonOuterStyle}
            chats={message}
            roleConfig={roleInfo}
            chatBoxRenderConfig={{ renderChatBoxContent: renderContent }}
            onChatsChange={onChatsChange}
            onMessageSend={onMessageSend}
        />
    );
}

render(CustomRender);
```

使用 `renderFullChatBox` 自定义渲染整个会话框

```jsx live=true noInline=true dir="column"
import React, {useState, useCallback} from 'react';
import { Chat, Avatar } from '@douyinfe/semi-ui';

const defaultMessage = [
    {
        role: 'system',
        id: '1',
        createAt: 1715676751919,
        content: "Hello, I'm your AI assistant.",   
    },
    {
        role: 'user',
        id: '2',
        createAt: 1715676751919,
        content: "介绍一下 semi design", 
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: 'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统',
    }
];

const roleInfo = {
    user:  {
        name: 'User',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
        name: 'Assistant',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
        name: 'System',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    }
}

const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 300,
}

let id = 0;
function getId() { return `id-${id++}`; }

const titleStyle = { display:' flex', alignItems: 'center', justifyContent: 'center', columnGap: '10px', padding: '5px 0px', width: 'fit-content' };

function CustomFullRender() {
    const [message, setMessage] = useState(defaultMessage);

    const customRenderChatBox = useCallback((props) => {
        const { role, message, defaultNodes, className } = props;
        let titleNode = null;
        if (message.role !== 'user') {
            titleNode = <span style={titleStyle}>
            <Avatar size="extra-small" shape="square" src={role.avatar} />
            {defaultNodes.title}
        </span>
        }
        return <div className={className}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: message.role === 'user' ? 'end' : ''}}>
                {titleNode}
                <div style={{ width: 'fit-content'}}>
                    {defaultNodes.content}
                </div>
                {defaultNodes.action}
            </div>
        </div>
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats)
    } ,[]);

     const onMessageSend = useCallback((content, attachment) => {
        const newUserMessage = {
            role: 'user',
            id: getId(),
            content: content,
            attachment: attachment
        }
        const newAssistantMessage = {
            role: 'assistant',
            id: getId(),
            content: `This is a mock response`
        }
        setMessage((message) => ([...message, newUserMessage, newAssistantMessage]));
    }, []);
    
    return ( <Chat
        chatBoxRenderConfig={{ renderFullChatBox: customRenderChatBox }}
        style={commonOuterStyle} 
        chats={message}
        onChatsChange={onChatsChange}
        onMessageSend={onMessageSend}
        roleConfig={roleInfo}
    />);
}

render(CustomFullRender)
```

### 自定义渲染输入框

可通过 `renderInputArea` 自定义渲染输入框，参数如下

``` ts
export interface RenderInputAreaProps {
    defaultNode?: ReactNode;
    onSend?: (content?: string, attachment?: FileItem[]) => void;
    onClear?: (e?: any) => void;
}
```

使用示例如下

```jsx live=true noInline=true dir="column"
import React, {useState, useCallback} from 'react';
import { Form, Chat } from '@douyinfe/semi-ui';

const defaultMessage = [
    {
        role: 'system',
        id: '1',
        createAt: 1715676751919,
        content: "Hello, I'm your AI assistant.",   
    },
];

const roleInfo = {
    user:  {
        name: 'User',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
        name: 'Assistant',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
        name: 'System',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    }
}

const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 400,
};

let id = 0;
function getId() {
    return `id-${id++}`
}

const inputStyle = {   
    display: 'flex', 
    flexDirection: 'column', 
    border: '1px solid var(--semi-color-border)',
    margin: '8px 16px',
    borderRadius: 8,
    padding: 8
}

function CustomInputRender(props) {
    const { defaultNode, onClear, onSend } = props;
    const api = useRef();
    const onSubmit = useCallback(() => {
        if (api.current) {
            const values = api.current.getValues();
            if ((values.name && values.name.length !== 0) || (values.file && values.file.length !== 0)) {
                onSend(values.name, values.file);
                api.current.reset();
            } 
        }
    }, []);

    return (<div style={inputStyle}>
        <Form
            getFormApi={formApi => api.current = formApi}
        >
            <strong>输入信息</strong>
            <Form.Input
                field="name"
                label="名称（Input）"
                style={{ width: 250 }}
                trigger='blur'
            />
            <Form.Upload
                field='file'
                label='文档'
                action='https://api.semi.design/upload'
            >
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Form.Upload>
        </Form>
        <Button style={{ width: 'fit-content' }} onClick={onSubmit}>提交</Button>
    </div>);
}

function CustomRenderInputArea() {
    const [message, setMessage] = useState(defaultMessage);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const onMessageSend = useCallback((content, attachment) => {
        const newUserMessage = {
            role: 'user',
            id: getId(),
            content: content,
            attachment: attachment
        }
        const newAssistantMessage = {
            role: 'assistant',
            id: getId(),
            content: `This is a mock response`
        }
        setMessage((message) => ([...message, newUserMessage, newAssistantMessage]));
    }, []);

    const renderInputArea = useCallback((props) => {
        return (<CustomInputRender {...props} />)
    }, []);    

    return (
        <Chat
            renderInputArea={renderInputArea}
            style={commonOuterStyle}
            chats={message}
            roleConfig={roleInfo}
            onChatsChange={onChatsChange}
            onMessageSend={onMessageSend}
        />
    )
}
render(CustomRenderInputArea);
```

### 提示信息

通过 `hints` 可设置提示区域内容, 点击提示内容后，提示内容将成为新的用户输入内容，并触发 `onHintClick` 回调。

```jsx live=true noInline=true dir="column"
import React, {useState, useCallback} from 'react';
import { Chat } from '@douyinfe/semi-ui';

const defaultMessage = [
    {
        role: 'system',
        id: '1',
        createAt: 1715676751919,
        content: "Hello, I'm your AI assistant.",   
    },
    {
        role: 'user',
        id: '2',
        createAt: 1715676751919,
        content: "介绍一下 semi design", 
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: 'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统',
    }
];

const hintsExample = [
    "告诉我更多",
    "Semi Design 的组件有哪些？",
    "Semi Design 官网及 github 仓库地址是？",
]

const roleInfo = {
    user:  {
        name: 'User',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
        name: 'Assistant',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
        name: 'System',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    }
}

const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 400,
};

let id = 0;
function getId() {
    return `id-${id++}`
}

function DefaultChat() {
    const [message, setMessage] = useState(defaultMessage);
    const [hints, setHints] = useState(hintsExample);

    const onHintClick = useCallback(() => {
        setHints([]);
    }, [])

    const onMessageSend = useCallback((content, attachment) => {
        const newUserMessage = {
            role: 'user',
            id: getId(),
            content: content,
            createAt: Date.now(),
            attachment: attachment,
        }
        const newAssistantMessage = {
            role: 'assistant',
            id: getId(),
            createAt: Date.now(),
            content: "这是一条 mock 回复信息",
        }
        setMessage((message) => {
            return [ ...message, newUserMessage, newAssistantMessage ];
        })
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    onClear = useCallback(() => {
        setHints([]);
    }, [])

    return (
        <Chat 
            hints={hints}
            onHintClick={onHintClick}
            style={commonOuterStyle}
            chats={message}
            roleConfig={roleInfo}
            onChatsChange={onChatsChange}
            onMessageSend={onMessageSend}
            onClear={onClear}
        />
    )
}

render(DefaultChat);
```

### 自定义提示信息渲染

通过 `renderHintBox` 自定义提示区域内容， 参数如下

```ts
type renderHintBox = (props: {content: string; index: number,onHintClick: () => void}) => React.ReactNode;
```

使用示例如下：

```jsx live=true noInline=true dir="column"
import React, {useState, useCallback} from 'react';
import { Chat } from '@douyinfe/semi-ui';

const defaultMessage = [
    {
        role: 'system',
        id: '1',
        createAt: 1715676751919,
        content: "Hello, I'm your AI assistant.",   
    },
    {
        role: 'user',
        id: '2',
        createAt: 1715676751919,
        content: "介绍一下 semi design", 
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: 'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统',
    }
];

const hintsExample = [
    "告诉我更多",
    "Semi Design 的组件有哪些？",
    "Semi Design 官网及 github 仓库地址是？",
]

const roleInfo = {
    user:  {
        name: 'User',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
        name: 'Assistant',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
        name: 'System',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    }
}

const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 400,
};

let id = 0;
function getId() {
    return `id-${id++}`
}

function DefaultChat() {
    const [message, setMessage] = useState(defaultMessage);
    const [hints, setHints] = useState(hintsExample);

    const onHintClick = useCallback(() => {
        setHints([]);
    }, [])

    const onMessageSend = useCallback((content, attachment) => {
        const newUserMessage = {
            role: 'user',
            id: getId(),
            content: content,
            createAt: Date.now(),
            attachment: attachment,
        }
        const newAssistantMessage = {
            role: 'assistant',
            id: getId(),
            createAt: Date.now(),
            content: "这是一条 mock 回复信息",
        }
        setMessage((message) => {
            return [ ...message, newUserMessage, newAssistantMessage ];
        })
        setHints([]);
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const commonHintStyle = useMemo(() => ({
        border: '1px solid var(--semi-color-border)',
        padding: '10px',
        borderRadius: '10px',
        width: 'fit-content',
        color: 'var( --semi-color-text-1)',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: '14px'
    }), []);
    
    const renderHintBox = useCallback((props) => {
        const { content, onHintClick, index } = props;
        return <div style={commonHintStyle} onClick={onHintClick} key={index}>
            {content}
            <IconArrowRight style={{ marginLeft: 10 }}>click me</IconArrowRight>
        </div>
    }, []);

    onClear = useCallback(() => {
        setHints([]);
    }, [])

    return (
        <Chat 
            renderHintBox={renderHintBox}
            hints={hints}
            onHintClick={onHintClick}
            style={commonOuterStyle}
            chats={message}
            roleConfig={roleInfo}
            onChatsChange={onChatsChange}
            onMessageSend={onMessageSend}
            onClear={onClear}
        />
    )
}

render(DefaultChat);
```

### API

| 属性  | 说明   | 类型   | 默认值 |
|------|--------|-------|-------|
| align | 对话对齐方式，支持 `leftRight`、`leftAlign` | string | `leftRight` |
| chatBoxRenderConfig | chatBox 渲染配置 | ChatBoxRenderConfig | - |
| chats | 受控对话列表 | Message | - |
| className | 自定义类名 | string | - |
| customMarkDownComponents | 自定义 markdown render， 透传给对话内容渲染的 MarkdownRender | MDXProps\['components'\]| - |
| hints | 提示信息 | string | - |
| inputBoxStyle | 输入框样式 | CSSProperties | - |
| inputBoxCls | 输入框类名 | string | - |
| roleConfig | 角色信息配置，具体见[RoleConfig](#RoleConfig) | RoleConfig | - |
| renderHintBox | 自定义渲染提示信息 | (props: {content: string; index: number,onHintClick: () => void}) => React.ReactNode| - |
| onChatsChange | 对话列表变化时触发 | (chats: Message[]) => void | - |
| onClear | 清除上下文消息时候触发 | () => void | - |
| onHintClick | 点击提示信息时触发 | (hint: string) => void | - |
| onInputChange | 输入区域信息变化时触发 | (props: { value?: string, attachment?: FileItem[] }) => void; | - |
| onMessageBadFeedback | 消息负向反馈时触发 | (message: Message) => void | - |
| onMessageCopy | 复制消息时触发 | (message: Message) => void | - |
| onMessageDelete | 删除消息时触发 | (message: Message) => void | - |
| onMessageGoodFeedback | 消息正向反馈时触发 | (message: Message) => void | - |
| onMessageReset | 重置消息时触发 | (message: Message) => void | - |
| onMessageSend | 发送消息时触发 | (content: string, attachment?: FileItem[]) => void | - |
| onStopGenerator | 点击停止生成按钮时触发 | (message: Message) => void | - |
| renderInputArea | 自定义渲染输入框 | (props: RenderInputAreaProps) => React.ReactNode | - |
| placeHolder | 输入框占位符 | string | - |
| topSlot | 顶部插槽 | React.ReactNode | - |
| showStopGenerate | 是否展示停止生成按钮| boolean | false |

#### RoleConfig

| 属性  | 说明   | 类型   | 默认值 |
|------|--------|-------|-------|
| user | 用户信息 | Metadata | - |
| assistant | 助手信息 | Metadata | - |
| system | 系统信息 | Metadata | - |

#### Metadata

| 属性  | 说明   | 类型   | 默认值 |
|------|--------|-------|-------|
| name | 名称 | string | - |
| avatar | 头像 | string | - |
| color | 头像背景色，同 Avatar 组件的 color 参数, 支持 `amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow` | string | `grey` |

#### Message

| 属性  | 说明   | 类型   | 默认值 |
|------|--------|-------|-------|
| role | 角色  | string | - |
| name | 名称  | string | - |
| id | 唯一标识  | string\| number | - |
| content | 文本内容 | string | - |
| parentId | 父节点id | string | - |
| createAt | 创建时间 | number | -|
| status | 消息状态，可选值为 `loading` \| `incomplete` \| `complete` \| `error` | string | complete |

#### Methods

| 方法  | 说明   |
|------|--------|
| resetMessage | 重置消息 |
| scrollToBottom(animation: boolean) | 滚动到最底部, animation 为 true，则有动画，反之无动画 |
| clearContext | 清除上下文|
| sendMessage(content: string, attachment: FileItem[]) |发送消息 |

## 设计变量

<DesignToken/>

