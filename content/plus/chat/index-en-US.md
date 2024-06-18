---
localeCode: en-US
order: 78
category: Plus
title:  Chat
icon: doc-configprovider
dir: column
brief: Used to quickly build conversation content
---

## When to use

The Chat component can be used in scenarios such as regular conversations or AI conversations.

The rendering of the conversation content is based on the MarkdownRender component, which supports Markdown and MDX. It allows for common rich text features such as images, tables, links, bold text, code blocks, and more. More complex and customized document writing and display requirements can be achieved using JSX.

## Demos

### How to import

```jsx
import { Chat } from '@douyinfe/semi-ui';
```

### Basic usage

By setting `chats`, `onChatsChange`, and `onMessageSend`, you can achieve basic conversation display and interaction.

Conversations involve multiple participants and multiple rounds of interaction. Role information, including names and avatars, can be passed through the `roleConfig` parameter. For detailed parameter information, refer to [RoleConfig](#RoleConfig).

The align property can be used to set the alignment of the conversation. It supports left-right alignment(`leftRight`, default) and left alignment (`leftAlign`).

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
            content: "This is a mock response",
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
            <span>Align：</span>
            <RadioGroup value={align} onChange={onAlignChange}>
                <Radio value={'leftRight'}>LeftRight</Radio>
                <Radio value={'leftAlign'}>leftAlign</Radio>
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

### Chat status

The chats type is `Message[]`, where each `Message` contains various information about the conversation, such as role, content, attachment, status, unique identifier (id), creation time (createAt), and more. For detailed information, please refer to [Message](#message). The conversation style may vary depending on the different status values.

``` jsx live=true noInline=true dir="column"
import React, {useState, useCallback} from 'react';
import { Chat } from '@douyinfe/semi-ui';

const defaultMessage = [
    {
        role: 'assistant',
        id: '1',
        createAt: 1715676751919,
        content: "Success response",   
    },
    {
        id: 'loading',
        role: 'assistant',
        status: 'loading'
    },
    {
        role: 'assistant',
        id: 'error',
        content: 'Error response',
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
function getId() { return `id-${id++}`}

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
            content: "This is a mock response",
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

### Dynamic update chats

For the case of receiving Server-Sent Event data from the backend, the obtained data can be used to update the `chats`, and the conversation content will be updated in real-time.

The `showStopGenerate` parameter can be used to determine whether to display the stop generation button, with a default value of `false`. The logic for stopping the generation can be handled in the `onStopGenerator` function.

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

### Custom render ChatBox

You can pass custom rendering configurations through `chatBoxRenderConfig`. Here is the type definition for `chatBoxRenderConfig`:

```ts
interface ChatBoxRenderConfig {
    renderChatBoxTitle?: (props: {role?: Metadata, defaultTitle?: ReactNode}) => ReactNode;
    renderChatBoxAvatar?: (props: { role?: Metadata, defaultAvatar?: ReactNode}) => ReactNode;
    renderChatBoxContent?: (props: {message?: Message, role?: Metadata, defaultContent?: ReactNode | ReactNode[], className?: string}) => ReactNode;
    renderChatBoxAction?: (props: {message?: Message, defaultActions?: ReactNode | ReactNode[], className: string}) => ReactNode;
    renderFullChatBox?: (props: {message?: Message, role?: Metadata, defaultNodes?: FullChatBoxNodes, className: string}) => ReactNode;
}
```

Custom render avatar and Title through `renderChatBoxAvatar` and `renderChatBoxTitle`。

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
        content: "Introduce Semi design", 
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: 'Semi Design is a design system designed, developed, and maintained by the front-end team at Douyin (the Chinese version of TikTok) and the MED product design team. It serves as a comprehensive, user-friendly, and high-quality UI solution for modern applications.[[1]](https://semi.design/en-US/start/introduction)'
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
function getId() { return `id-${id++}`}

function CustomRender() {
    const [title, setTitle] = useState('null');
    const [avatar, setAvatar] = useState('null');
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
            content: "This is a mock response",
        }
        setMessage((message) => {
            return [ ...message, newUserMessage, newAssistantMessage ];
        })
    }, []);

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

    return (
        <>
            <div style={{ marginLeft: 12 }}>
                <span >Avatar Render Mode: </span>
                <RadioGroup onChange={onAvatarChange} value={avatar} >
                    <Radio value={'default'}>default</Radio>
                    <Radio value={'null'}>null</Radio>
                    <Radio value={'custom'}>custom</Radio>
                </RadioGroup>
                <br />
                <br />
                <span >Title Render mode: </span>
                <RadioGroup onChange={onTitleChange} value={title} >
                    <Radio value={'default'}>default</Radio>
                    <Radio value={'null'}>null</Radio>
                    <Radio value={'custom'}>custom</Radio>
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
                roleConfig={roleInfo}
                onChatsChange={onChatsChange}
                onMessageSend={onMessageSend}
            />
        </>
    );
}

render(CustomRender);
```

When hovering over a conversation, the conversation action area will be displayed. You can customize the rendering of the action area using `renderChatBoxAction`.

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
        content: "Introduce Semi design", 
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: 'Semi Design is a design system designed, developed, and maintained by the front-end team at Douyin (the Chinese version of TikTok) and the MED product design team.',
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
function getId() { return `id-${id++}`}

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
            content: "This is a mock response",
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

You can customize the content of the action area using `renderChatBoxContent`.

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
        content: "Introduce Semi design", 
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: 'Semi Design is a design system designed, developed, and maintained by the front-end team at Douyin (the Chinese version of TikTok) and the MED product design team.',
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
function getId() { return `id-${id++}`}

function CustomRender() {
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
            content: "This is a mock response",
        }
        setMessage((message) => {
            return [ ...message, newUserMessage, newAssistantMessage ];
        })
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
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

Use `renderFullChatBox` to custom render the entire chat box

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
        content: "Introduce Semi", 
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: 'Semi Design is a design system designed, developed, and maintained by the front-end team at Douyin (the Chinese version of TikTok) and the MED product design team.',
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

const titleStyle = { display:' flex', alignItems: 'center', justifyContent: 'center', columnGap: '10px', padding: '5px 0px', width: 'fit-content' };

let id = 0;
function getId() { return `id-${id++}`}

function CustomFullRender() {
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
            content: "This is a mock response",
        }
        setMessage((message) => {
            return [ ...message, newUserMessage, newAssistantMessage ];
        })
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

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

### Custom render InputArea

The rendering input box can be customized through `renderInputArea`, the parameters are as follows

``` ts
export interface RenderInputAreaProps {
    defaultNode?: ReactNode;
    onSend?: (content?: string, attachment?: FileItem[]) => void;
    onClear?: (e?: any) => void;
}
```

Example:

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
            <strong>Information Chart</strong>
            <Form.Input
                field="name"
                label="Name"
                style={{ width: 250 }}
                trigger='blur'
            />
            <Form.Upload
                field='file'
                label='File'
                action='https://api.semi.design/upload'
            >
                <Button icon={<IconUpload />} theme="light">
                    Upload
                </Button>
            </Form.Upload>
        </Form>
        <Button style={{ width: 'fit-content' }} onClick={onSubmit}>Submit</Button>
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

### Hint

The prompt area content can be set through `hints`. After clicking the prompt content, the prompt content will become the new user input content and trigger the `onHintClick` callback.

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
        content: "Introduce Semi design", 
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: 'Semi Design is a design system designed, developed, and maintained by the front-end team at Douyin (the Chinese version of TikTok) and the MED product design team.',
    }
];

const hintsExample = [
    "Tell me more",
    "What are the components of Semi Design?",
    "What are the addresses of Semi Design’s official website and github warehouse?",
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
            content: "This is a mock response",
        }
        setMessage((message) => {
            return [ ...message, newUserMessage, newAssistantMessage ];
        })
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const onClear = useCallback(() => {
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

### Custom render Hint

Customize the content of the prompt area through `renderHintBox`, the parameters are as follows

```ts
type renderHintBox = (props: {content: string; index: number,onHintClick: () => void}) => React.ReactNode;
```

Example:

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
        content: "Introduce Semi design", 
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: 'Semi Design is a design system designed, developed, and maintained by the front-end team at Douyin (the Chinese version of TikTok) and the MED product design team.',
    }
];

const hintsExample = [
    "Tell me more",
    "What are the components of Semi Design?",
    "What are the addresses of Semi Design’s official website and github warehouse?",
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
            content: "This",
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

    const onClear = useCallback(() => {
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

| PROPERTIES | INSTRUCTIONS | TYPE | DEFAULT |
|------|--------|-------|-------|
| align | Dialog alignment, supports `leftRight`, `leftAlign` | string | `leftRight` |
| chatBoxRenderConfig | chatBox rendering configuration | ChatBoxRenderConfig | - |
| chats | Controlled conversation list | Message | - |
| className | Custom class name | string | - |
| customMarkDownComponents | Custom markdown render, transparently passed to MarkdownRender for conversation content rendering | MDXProps\['components'\]| - |
| hints | prompt information | string | - |
| inputBoxStyle | Input box style | CSSProperties | - |
| inputBoxCls | Input box className | string | - |
| roleConfig | Role information configuration, see [RoleConfig](#RoleConfig) for details | RoleConfig | - |
| renderHintBox | Custom rendering prompt information | (props: {content: string; index: number,onHintClick: () => void}) => React.ReactNode| - |
| onChatsChange | Triggered when the conversation list changes | (chats: Message[]) => void | - |
| onClear | Triggered when context message is cleared | () => void | - |
| onHintClick | Triggered when the prompt message is clicked | (hint: string) => void | - |
| onInputChange | Triggered when input area information changes | (props: { value?: string, attachment?: FileItem[] }) => void; | - |
| onMessageBadFeedback | Triggered when the message is negatively fed back | (message: Message) => void | - |
| onMessageCopy | Triggered when copying a message | (message: Message) => void | - |
| onMessageDelete | Triggered when a message is deleted | (message: Message) => void | - |
| onMessageGoodFeedback | Triggered when the message is fed back positively | (message: Message) => void | - |
| onMessageReset | Triggered when message is reset | (message: Message) => void | - |
| onMessageSend | Triggered when sending a message | (content: string, attachment?: FileItem[]) => void | - |
| onStopGenerator | Fires when the stop generation button is clicked | (message: Message) => void | - |
| renderInputArea | Custom rendering input box | (props: RenderInputAreaProps) => React.ReactNode | - |
| placeHolder | Input box placeholder | string | - |
| topSlot | top slot | React.ReactNode | - |
| showStopGenerate | Whether to display the stop generation button | boolean | false |

#### RoleConfig

| PROPERTIES | INSTRUCTIONS | TYPE | DEFAULT |
|------|--------|-------|-------|
| user | User information | Metadata | - |
| assistant | Assistant information | Metadata | - |
| system | System information | Metadata | - |

#### Metadata

| PROPERTIES | INSTRUCTIONS | TYPE | DEFAULT |
|------|--------|-------|-------|
| name | name | string | - |
| avatar | avatar | string | - |
| color | Avatar background color, same as the color parameter of Avatar component, support `amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow` | string | `grey` |

#### Message

| PROPERTIES | INSTRUCTIONS | TYPE | DEFAULT |
|------|--------|-------|-------|
| role | role  | string | - |
| name | name  | string | - |
| id | Uniquely identifies  | string\| number | - |
| content | Text content | string | - |
| parentId | parent Uniquely identifies | string | - |
| createAt | creation time | number | -|
| status | Information status， `loading` \| `incomplete` \| `complete` \| `error` | string | complete |

#### Methods

| METHOD  | INSTRUCTIONS   |
|------|--------|
| resetMessage | Reset message |
| scrollToBottom(animation: boolean) | Scroll to the bottom, if animation is true, there will be animation, otherwise there will be no animation. |
| clearContext | clear context|
| sendMessage(content: string, attachment: FileItem[]) | send message with content and attachment |

## Design Token

<DesignToken/>