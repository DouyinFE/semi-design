---
localeCode: zh-CN
order: 98
category: Ai
title: AIComponent 能力介绍
icon: doc-aiComponent
width: 60%
brief: 整体介绍 AI 应用场景下的组件能力
showNew: true
---

<!-- 1. 整体介绍：什么是semi AI 组件（理念），主要服务的场景？目前主要包括哪些组件？待上线的组件？ -->
Semi AI 组件是一套专为 AI 应用场景设计的创新组件库。面对 AI 正在成为产品主角的时代，传统的设计体系已难以支撑日益复杂的智能交互, Semi AI 组件以「人机智能协同」为核心理念，致力于让用户与 AI 系统协作更高效、可控、可感知、可信赖。Semi AI 组件库包含以下内容：AI 基础能力以及 AI 组件，用于服务智能问答与助手、多模态输入与多轮对话等场景。

AI 基础能力包括：

- `AI Token`：新增加 AI 场景下的基础 token
- `AI Icon`: 新增加 AI 场景下的 25 个 icon
- `Button/Tag/FloatButton`：对基础组件新增 AI 风格，支持 AI 场景下的使用

AI 组件包括 `AIChatInput`、 `AIChatDialogue`，用于支持 AI 应用的输入、结果展示。

在未来，我们将支持聊天应用场景下的 `ChatBox`， 支持更多信息展示以及负责内容编辑功能的 `SideBar` 等组件。


<!-- 2. Token & icon & button & tag & FloatButton 的简单展示 -->

### AI 基础能力

AI 基础能力包括 `AI Token`、`AI Icon`、AI 风格 的`Button / Tag / FloatButton`。

对于 `AI Token`，我们构建了一套以紫蓝渐变系为核心的品牌色板，在基础色中，新增加了 AI purple 和 AI general 两个色相，20 个颜色的色盘。

对于 `AI Icon`，支持 Icon 场景下的单色、双色、及多色 Icon，共 25 个图标。

对于 AI 风格的 `Button / Tag / FloatButton`，可通过组件的 Colorful 属性开启。

以下是 AI 基础能力的一些示例，更多示例及使用场景详见 [AI Token](/zh-CN/basic/tokens)、[AI Icon](zh-CN/basic/icon)、[AI Button](/zh-CN/basic/button#AI%20%E9%A3%8E%E6%A0%BC%20-%20%E5%A4%9A%E5%BD%A9%E6%8C%89%E9%92%AE)、[AI Tag](/zh-CN/show/tag#AI%20%E9%A3%8E%E6%A0%BC%20-%20%E5%A4%9A%E5%BD%A9%E6%A0%87%E7%AD%BE)、[AI FloatButton](/zh-CN/basic/floatbutton#AI%20%E9%A3%8E%E6%A0%BC%20-%20%E5%A4%9A%E5%BD%A9%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE)。


```jsx live=true dir="column"
import React from 'react';
import { Typography, Button, Tag, FloatButton } from '@douyinfe/semi-ui';
import { IconAIBellLevel1, IconAIEditLevel2, IconAIFileLevel3, IconAIFilledLevel3, IconAIImageLevel3, IconAISearchLevel3, IconAIStrokedLevel3, IconAIWandLevel3, IconAILoading, IconAIFilledLevel1, IconAIEditLevel1 } from '@douyinfe/semi-icons';

() => {
    return (<div style={{ display: 'flex', flexDirection: 'column', rowGap: 20 }}>
        <div key="AIToken" style={{ display: 'flex', flexDirection: 'column', rowGap: 10 }}>
            <Typography.Title heading={5}>AI Token</Typography.Title>
            <div style={{ display: 'flex', alignItems: 'center', columnGap: 10 }}>
                <span>Purple</span>
                <div style={{ display: 'inline-flex', columnGap: 4 }}>
                    {(new Array(10).fill(1).map((i, index) => (
                        <div key={index} style={{ width: 40, height: 40, backgroundColor: `rgba(var(--semi-ai-purple-${index}), 1)`, borderRadius: '50%' }} />
                    )))}
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', columnGap: 10 }}>
                <span>General</span>
                <div style={{ display: 'inline-flex', columnGap: 4, }}>
                    {(new Array(10).fill(1).map((i, index) => (
                        <div key={index} style={{ width: 40, height: 40, background: `var(--semi-ai-general-${index})`, borderRadius: '50%' }} />
                    )))}
                </div>
            </div>
        </div>
        <div key="AIIcon" style={{ display: 'flex', flexDirection: 'column', rowGap: 10 }}>
            <Typography.Title heading={5} >AI Icon</Typography.Title>
            <div style={{ display: 'flex', columnGap: 10 }}>
                <IconAIBellLevel1 size="extra-large"/>
                <IconAIEditLevel2 size="extra-large"/>
                <IconAIFileLevel3 size="extra-large" />
                <IconAIFilledLevel3 size="extra-large" />
                <IconAIImageLevel3 size="extra-large" />
                <IconAISearchLevel3 size="extra-large" />
                <IconAIStrokedLevel3 size="extra-large" />
                <IconAIWandLevel3 fill={['var(--semi-color-danger)', 'var(--semi-color-success)', 'var(--semi-color-primary)', 'var(--semi-color-warning)']} size="extra-large"/>
                <IconAILoading size="extra-large"/>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 10 }}>
            <Typography.Title heading={5}>AI Button</Typography.Title>
            <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                <div style={{ display: 'flex', columnGap: 16 }}>
                    <Button colorful theme="solid" type="primary" icon={<IconAIFilledLevel1 />}>Colorful</Button>
                    <Button colorful theme="solid" type="primary" loading >Colorful</Button>
                    <Button colorful theme="solid" type="primary" icon={<IconAIFilledLevel1 />} disabled >Colorful</Button>
                </div>
                <div style={{ display: 'flex', columnGap: 16 }}>
                    <Button colorful theme="solid" type="tertiary" icon={<IconAIFilledLevel3 />}>Colorful</Button>
                    <Button colorful theme="solid" type="tertiary" loading >Colorful</Button>
                    <Button colorful theme="solid" type="tertiary" icon={<IconAIFilledLevel3 />} disabled >Colorful</Button>
                </div>
                <div style={{ display: 'flex', columnGap: 16 }}>
                    <Button colorful theme="solid" type="primary" icon={<IconAIFilledLevel1 />} />
                    <Button colorful theme="solid" type="primary" loading />
                    <Button colorful theme="solid" type="primary" icon={<IconAIFilledLevel1 />} disabled />
                    <Button colorful theme="solid" type="tertiary" icon={<IconAIFilledLevel3 />} />
                    <Button colorful theme="solid" type="tertiary" loading />
                    <Button colorful theme="solid" type="tertiary" icon={<IconAIFilledLevel3 />} />
                </div>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 10 }}>
            <Typography.Title heading={5} style={{ marginTop: 10 }}>AI Tag</Typography.Title>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridGap: '10px', width: 'fit-content' }}>
                <Tag colorful prefixIcon={<IconAIFilledLevel1 size="small"/>} type="solid" shape='circle' gradient>AI</Tag>
                <Tag colorful prefixIcon={<IconAIFilledLevel3 size="small" />} type="light" shape='circle' gradient>AI</Tag>
                <Tag colorful prefixIcon={<IconAIFilledLevel3 size="small"/>} type="ghost" shape='circle' gradient >AI</Tag>
                <Tag colorful prefixIcon={<IconAIFilledLevel1 size="small"/>} type="solid" shape='circle' >AI</Tag>
                <Tag colorful prefixIcon={<IconAIFilledLevel1 size="small" />} type="light" shape='circle'>AI</Tag>
                <Tag colorful prefixIcon={<IconAIFilledLevel1 size="small"/>} type="ghost" shape='circle'>AI</Tag>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 10 }}>
            <Typography.Title heading={5} style={{ marginTop: 10 }}>AI FloatButton</Typography.Title>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridGap: '10px', width: 'fit-content' }}>
                <FloatButton 
                    icon={<IconAIEditLevel1 />}
                    colorful
                    size="large"
                    badge={{ count: 'VIP', type: "danger" }}
                    style={{ position: 'static' }} 
                />
            </div>
        </div>
    </div>);
};
```

### AI 组件构建对话
本例中我们将联合使用 `AIChatInput` 和 `AIChatDialogue` 组件，构建一个适用于 `Multiple Agent` 场景的对话用例。
更多示例及使用场景详见 [AIChatInput](/zh-CN/ai/aiChatInput)、[AIChatDialogue](/zh-CN/ai/aiChatDialogue)

```jsx live=true dir="column" noInline=true
import React, { useState, useCallback } from 'react';
import { AIChatDialogue, AIChatInput, chatInputToMessage } from '@douyinfe/semi-ui';
import { IconFixedStroked, IconFeishuLogo, IconBookOpenStroked, IconGit, IconFigma } from '@douyinfe/semi-icons';

const { Configure } = AIChatInput;


function AIChatInputWithDialogue() {
    const inputOuterStyle = { margin: '12px', maxHeight: 300, flexShrink: 0 };
    const editingInputOuterStyle = { margin: '12px 0px', maxHeight: 300, flexShrink: 0 };
    const dialogueOuterStyle = { flex: 1, overflow: 'auto' };

    const [messages, setMessages] = useState(defaultMessages);
    const [generating, setGenerating] = useState(false);
    const [references, setReferences] = useState([]);

    const renderLeftMenu = useCallback(() => (<>
        <Configure.Select optionList={modelOptions} field="model" initValue="GPT-4o" />
        <Configure.Button icon={<IconFixedStroked />} field="deepThink">深度思考</Configure.Button>
        <Configure.Button icon={<IconBookOpenStroked />} field="onlineSearch">联网搜索</Configure.Button>
        <Configure.Mcp options={mcpOptions} />
        <Configure.RadioButton options={radioButtonProps} field="thinkType" initValue="fast"/>
    </>), []);

    const onChatsChange = useCallback((chats) => {
        console.log('onChatsChange', chats);
        setMessages(chats);
    }, []);

    const onContentChange = useCallback((content) => {
        // console.log('onContentChange', content);
    }, []);


    const onReferenceClick = useCallback((item) => {
        setReferences((references) => [...references, { ...item, id: `reference-${Date.now()}` }]);
    }, []);

    const handleReferenceDelete = useCallback((item) => {
        const newReference = references.filter((ref) => ref.id !== item.id);
        setReferences(newReference);
    }, [references]);

    const onMessageSend = useCallback((props) => {
        setGenerating(true);
        // 模拟发送请求
        setMessages((messages) => [...messages, {
            id: `message-${Date.now()}`,
            ...chatInputToMessage(props),
        }]);
        setReferences([]);
        setTimeout(() => {
            setGenerating(false);
        }, 100);
        setTimeout(() => {
            // 模拟接口返回
            setMessages((messages) => {
                return [...messages, {
                    id: `message-${Date.now()}`,
                    role: 'assistant',
                    content: "这是一条 mock 回复信息",
                }];
            });
        }, 1000);
    }, []);

    const onEditMessageSend = useCallback((props) => {
        const index = messages.findIndex((message) => message.editing);
        const newMessages = [...messages.slice(0, index), {
            id: `message-${Date.now()}`,
            ...chatInputToMessage(props),
        }];
        setMessages(newMessages);
    }, [messages]);

    const handleEditingReferenceDelete = useCallback((item) => {
        const newMessages = messages.map((message) => {
            if (message.editing) {
                message.references = message.references.filter((ref) => ref.id !== item.id);
            }
            return message;
        });
        setMessages(newMessages);
    }, [messages]);

    const messageEditRender = useCallback((props) => {
        return (
            <AIChatInput 
                style={editingInputOuterStyle}
                generating={false}
                references={props.references}
                uploadProps={{ ...uploadProps, defaultFileList: props.attachments }}
                defaultContent={props.inputContents[0].text}
                renderConfigureArea={renderLeftMenu} 
                onMessageSend={onEditMessageSend}
                onReferenceDelete={handleEditingReferenceDelete}
            />
        );
    }, [messages, handleEditingReferenceDelete]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '1000px', overflow: 'hidden' }}>
            <AIChatDialogue 
                style={dialogueOuterStyle}
                roleConfig={roleConfig}
                showReference={true}
                align="leftRight"
                mode="bubble"
                chats={messages}
                onChatsChange={onChatsChange}
                onReferenceClick={onReferenceClick}
                messageEditRender={messageEditRender}
            />
            <AIChatInput 
                style={inputOuterStyle}
                placeholder={'输入内容或者上传内容'} 
                defaultContent={'我是一名<input-slot placeholder="[职业]">程序员</input-slot>，帮我写一段面向<input-slot placeholder="[输入对象]">产品经理</input-slot>的话术内容'}
                generating={generating}
                references={references}
                uploadProps={uploadProps}
                renderConfigureArea={renderLeftMenu} 
                onContentChange={onContentChange}
                onMessageSend={onMessageSend}
                onStopGenerate={() => setGenerating(false)}
                onReferenceDelete={handleReferenceDelete}
            />
        </div>
    );
}


const defaultMessages = [{
    id: '1',
    role: 'assistant',
    content: '你好呀，请问有什么可以帮助您的吗~',
    status: 'completed',
}, {
    id: '2',
    role: 'user',
    content: [{
        type: 'message',
        role: 'user',
        content: [{
            type: 'input_image',
            name: 'edit-bag.jpeg',
            image_url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
            file_id: 'demo-file-id',
            size: '100KB',
        }, {
            type: 'input_text',
            text: '帮我生成类似的图片',
        }],
    }],
}, {
    id: '3',
    role: 'assistant',
    content: [{
        "id": "rs_02175871288540800000000000000000000ffffac1598778c9aa5",
        "type": "reasoning",
        "summary": [
            {
                "type": "summary_text",
                "text": "\n用户问需要我帮助他生成类似图片，我需要先分析图片内容分析图片内容分析图片内容分析图片内容分析图片内容分析图片内容，然后生成类似的图片..."
            }
        ],
        "annotations": [
            {
                title: '快乐星球',
                url: 'https://semi.design/zh-CN/start/getting-started',
                detail: '快乐星球是一个快乐的地方',
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
            },
            {
                title: '快乐星球',
                url: 'https://semi.design/zh-CN/start/getting-started',
                detail: '快乐星球是一个快乐的地方',
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
            },
            {
                title: '快乐星球',
                url: 'https://semi.design/zh-CN/start/getting-started',
                detail: '快乐星球是一个快乐的地方',
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
            }
        ],
        "status": "completed"
    }, {
        "type": 'message',
        "content": [{
            "type": "output_text",
            "text": "现在需要生成了一张黄色背包的图片...",
            "annotations": [
                {
                    title: '黄色背包',
                    url: 'https://semi.design/zh-CN/start/getting-started',
                    detail: '黄色背包',
                    logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
                },
                {
                    title: '黄色背包',
                    url: 'https://semi.design/zh-CN/start/getting-started',
                    detail: '黄色背包',
                    logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
                },
                {
                    title: '黄色背包',
                    url: 'https://semi.design/zh-CN/start/getting-started',
                    detail: '黄色背包',
                    logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
                }
            ],
        }],
        "status": "completed"
    }, {
        type: 'function_call',
        name: 'create_image',
        arguments: "{\"description\":\"生成一个黄色背包的图片\"}",
        status: 'completed',
    }],
    status: 'completed',
}];

const roleConfig = {
    user: {
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
};

const uploadProps = {
    action: "https://api.semi.design/upload"
};

const modelOptions = [
    {
        value: 'GPT-5',
        label: 'GPT-5',
        type: 'gpt',
    },
    {
        value: 'GPT-4o',
        label: 'GPT-4o',
        type: 'gpt',
    },
    {
        value: 'Claude 3.5 Sonnet',
        label: 'Claude 3.5 Sonnet',
        type: 'claude',
    },
];

const mcpOptions = [
    {
        icon: <IconFeishuLogo />,
        label: "飞书文档",
        value: "feishu",
    },
    {
        icon: <IconGit />,
        label: "Github Mcp",
        value: "github",
    },
    {
        icon: <IconFigma />,
        label: "IconFigma Mcp",
        value: "IconFigma",
    }
];

const radioButtonProps = [
    {
        label: '极速',
        value: 'fast',
    },
    { 
        label: '思考',
        value: 'think',
    },
    {
        label: '超能',
        value: 'super',
    }
];

render(AIChatInputWithDialogue);
```


