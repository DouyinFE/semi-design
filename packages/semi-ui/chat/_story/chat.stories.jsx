import { getUuidv4 } from '@douyinfe/semi-foundation/utils/uuid';
import Chat from '../index';
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Form, Button, Avatar, Dropdown } from '@douyinfe/semi-ui';
import { IconUpload, IconForward, IconMoreStroked, IconArrowRight } from '@douyinfe/semi-icons';
import MarkdownRender from '../../markdownRender';
import * as semiComponents from '../../markdownRender/components/index';
import { initMessage, roleInfo, commonOuterStyle, hintsExample, infoWithAttachment, simpleInitMessage } from './constant';

export default {
    title: 'Chat',
    parameters: {
      chromatic: { disableSnapshot: true },
    }
}

export const _Chat = () => {
    const [message, setMessage] = useState(initMessage);
    const [hints, setHints] = useState(hintsExample);

    const onClear = useCallback((clearMessage) => {
       console.log('onClear');
    }, []);

    const onMessageSend = useCallback((content, attachment) => {
        const newUserMessage = {
            role: 'user',
            id: getUuidv4(),
            content: content,
            attachment: attachment,
        }
        const newAssistantMessage = {
            role: 'assistant',
            id: getUuidv4(),
            content: "这是一条 mock 回复信息",
        }
        setMessage((message) => {
            return [
                ...message,
                newUserMessage,
                newAssistantMessage
            ]
        })
    }, []);

    const onMessageDelete = useCallback((message) => {
       console.log('message delete', message);
    }, []);

    const onChatsChange = useCallback((chats) => {
        console.log('onChatsChange', chats);
        setMessage(chats);
    }, []);

    const onMessageGoodFeedback = useCallback((message) => {
        console.log('message good feedback', message);
    }, []);

    const onMessageBadFeedback = useCallback((message) => {
        console.log('message bad feedback', message);
    }, []);

    const onMessageReset = useCallback((message) => {
        console.log('message reset', message);
    }, []);

    const onInputChange = useCallback((props) => {
        console.log('onInputChange', props);
    }, []);

    const onHintClick = useCallback((hint) => {
        setHints([]);
    }, []);

    return (
        <div
            style={{ height: 600}}
        >
            <Chat 
                style={commonOuterStyle}
                chats={message}
                hints={hints}
                roleConfig={roleInfo}
                onClear={onClear}
                onMessageSend={onMessageSend}
                onMessageDelete={onMessageDelete}
                onMessageGoodFeedback={onMessageGoodFeedback}
                onMessageBadFeedback={onMessageBadFeedback}
                onChatsChange={onChatsChange}
                onMessageReset={onMessageReset}
                onInputChange={onInputChange}
                onHintClick={onHintClick}
            />
        </div>
    )
}

export const Attachment = () => {
    const [message, setMessage] = useState(infoWithAttachment);

    return (
        <div
            style={{ height: 600}}
        >
            <Chat 
                placeHolder={'不处理输入信息，仅用于展示附件'}
                style={commonOuterStyle}
                chats={message}
                roleConfig={roleInfo}
            />
        </div>
    )
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

    return (<div style={{   
        display: 'flex', 
        flexDirection: 'column', 
        border: '1px solid var(--semi-color-border)',
        margin: '8px 16px',
        borderRadius: 8,
        padding: 8
    }}>
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

export const CustomRenderInputArea = () => {
    const [message, setMessage] = useState(initMessage.slice(0, 1));

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const onMessageSend = useCallback((content, attachment) => {
        const newUserMessage = {
            role: 'user',
            id: getUuidv4(),
            content: content,
            attachment: attachment
        }
        const newAssistantMessage = {
            role: 'assistant',
            id: getUuidv4(),
            content: `This is a mock response`
        }
        setMessage((message) => ([...message, newUserMessage, newAssistantMessage]));
    }, []);

    const renderInputArea = useCallback((props) => {
        return (<CustomInputRender {...props} />)
    }, []);     

    return (
        <div
            style={{ height: 600}}
        >
            <Chat 
                style={commonOuterStyle}
                chats={message}
                roleConfig={roleInfo}
                onChatsChange={onChatsChange}
                onMessageSend={onMessageSend}
                renderInputArea={renderInputArea}
            />
        </div>
    )
}

export const CustomRenderAvatar = (props) => {
    const customRenderAvatar = useCallback((props)=> {
        const { role, defaultAvatar } = props;
        return <Avatar size="extra-small" shape="square" style={{ flexShrink: '0'}}>{role.name}</Avatar >
    }, []);

    const customRenderTitle =  useCallback((props)=> null, []);

    return (<div
        style={{ height: 600 }}
    >
        <Chat 
            style={commonOuterStyle}
            chats={initMessage.slice(0, 4)}
            roleConfig={roleInfo}
            chatBoxRenderConfig={{
                renderChatBoxTitle: customRenderTitle,
                renderChatBoxAvatar: customRenderAvatar
            }}
        />
    </div>);
}

export const CustomRenderTitle = (props) => {
    const customRenderTitle = useCallback((props) => {
        const { role, message, defaultTitle } = props;
        if (message.role === 'user') {
            return null;
        }
        return <span style={{ display:' flex', alignItems: 'center', justifyContent: 'center', columnGap: '10px', padding: '5px 0px'}}>
            <Avatar size="extra-small" shape="square" src={role.avatar} />
            {defaultTitle}
        </span>
    }, []);

    const customRenderAvatar = useCallback((props)=> null, []);

    return (<div
        style={{ height: 600}}
    >
        <Chat
            placeHolder={"不处理输入信息，仅用于展示自定义头像和标题"}
            style={commonOuterStyle}
            chats={simpleInitMessage}
            roleConfig={roleInfo}
            chatBoxRenderConfig={{
                renderChatBoxTitle: customRenderTitle,
                renderChatBoxAvatar: customRenderAvatar
            }}
        />
    </div>);
}

export const CustomFullChatBox = () => {
    const customRenderChatBox = useCallback((props) => {
        const { role, message, defaultNodes, className } = props;
        const date = new Date(message.createAt);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return <div className={className}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: message.role === 'user' ? 'end' : ''}}>
                <span style={{color: 'var(--semi-color-text-2', fontSize: '12px'}}>{formattedDate}</span>
                <div style={{ width: 'fit-content'}}>
                    {defaultNodes.content}
                </div>
                {defaultNodes.action}
            </div>
        </div>
    }, []);

    return (<div
        style={{ height: 600}}
    >
        <Chat
            style={commonOuterStyle} 
            chats={simpleInitMessage}
            roleConfig={roleInfo}
            chatBoxRenderConfig={{
                renderFullChatBox: customRenderChatBox
            }}
        />
    </div>);
}

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

export const CustomRenderAction = () => {
    const [message, setMessage] = useState(simpleInitMessage);
    const customRenderAction = useCallback((props) => {
        return <CustomActions {...props} />
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    return (<div
        style={{ height: 600}}
    >
        <Chat 
            chats={message}
            onChatsChange={onChatsChange}
            style={commonOuterStyle}
            roleConfig={roleInfo}
            chatBoxRenderConfig={{
                renderChatBoxAction: customRenderAction
            }}
        />
    </div>);
}

export const CustomRenderContent = () => {
    const renderContent = useCallback((props) => {
        const { role, message, defaultNode, className } = props;
        return <div className={className}>
            <span>---custom render content---</span>
            <MarkdownRender raw={message?.content}/>
        </div>
    }, []);

    return (<div
        style={{ height: 600}}
    >
        <Chat 
            style={commonOuterStyle}
            chats={simpleInitMessage}
            roleConfig={roleInfo}
            chatBoxRenderConfig={{
                renderChatBoxContent: renderContent
            }}
        />
    </div>);
}

export const LeftAlign =  () => {
    return (<div
        style={{ height: 600}}
    >
        <Chat
            style={commonOuterStyle} 
            chats={simpleInitMessage}
            roleConfig={roleInfo}
            align='leftAlign'
        />
    </div>);
}

export const MessageStatus = () => {
    const messages = [
        initMessage[1],
        {
            id: 'loading',
            role: 'assistant',
            status: 'loading'
        },
        {
            ...initMessage[2],
            content: '请求错误',
            status: 'error'
        }
    ]
    return (<div
        style={{ height: 600}}
    >
        <Chat
            style={commonOuterStyle} 
            chats={messages}
            roleConfig={roleInfo}
        />
    </div>);
}

export const MockResponseMessage = () => {
    const [message, setMessage] = useState([ initMessage[0]]);
    const intervalId = useRef();

    const onChatsChange = useCallback((chats) => {
        console.log('onChatsChange', chats);
        setMessage(chats);
    }, []);

    const onMessageSend = useCallback((content, attachment) => {
        setMessage((message) => {
            return [
                ...message,
                {
                    role: 'user',
                    createAt: Date.now(),
                    id: getUuidv4(),
                    content: content,
                    attachment: attachment,
                },
                {
                    role: 'assistant',
                    status: 'loading',
                    createAt: Date.now(),
                    id: getUuidv4()
                }
            ]
        }); 
        generateMockResponse(content);
    },[])

    const generateMockResponse = useCallback((content) => {
        const id = setInterval(() => {
            setMessage((message) => {
                const lastMessage = message[message.length - 1];
                let newMessage = {};
                if (lastMessage.status === 'loading') {
                    newMessage =  {
                        role: 'assistant',
                        id: getUuidv4(),
                        content:  `mock Response for ${content} \n`,
                        status: 'incomplete'
                    }
                } else if (lastMessage.status === 'incomplete') {
                    if (lastMessage.content.length > 200) {
                        clearInterval(id);
                        intervalId.current = null
                        newMessage = {
                            role: 'assistant',
                            id: getUuidv4(),
                            content: `${lastMessage.content} mock stream message`,
                            status: 'complete'
                        }
                    } else {
                        newMessage =  {
                            role: 'assistant',
                            id: getUuidv4(),
                            content: `${lastMessage.content} mock stream message`,
                            status: 'incomplete'
                        }
                    }  
                }
                return [
                    ...message.slice(0, -1),
                    newMessage
                ]
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
    <div
        style={{ height: 300}}
    >
        <Chat 
            style={commonOuterStyle}
            chats={message}
            roleConfig={roleInfo}
            onChatsChange={onChatsChange}
            onMessageSend={onMessageSend}
            onStopGenerator={onStopGenerator}
            showStopGenerate={true}
        />
    </div>
    );
}

export const CustomRenderHint = () => {
    const [message, setMessage] = useState(initMessage.slice(0, 3));
    const [hint, setHint] = useState(hintsExample);

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

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const onHintClick = useCallback((hint) => {
        setHint([]);
    }, []);

    return <div
        style={{ height: 600}}
    >
        <Chat 
            style={commonOuterStyle}
            chats={message}
            onChatsChange={onChatsChange}
            onHintClick={onHintClick}
            hints={hint}
            roleConfig={roleInfo}
            renderHintBox={renderHintBox}
        />
    </div>
}

