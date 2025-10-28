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
import { AIChatDialogue, AIChatInput, chatInputToMessage, Typography, Button } from '@douyinfe/semi-ui';
import { IconFixedStroked, IconFeishuLogo, IconBookOpenStroked, IconGit, IconFigma, IconWord } from '@douyinfe/semi-icons';

const { Configure } = AIChatInput;


function AIChatInputWithDialogue() {
    const inputOuterStyle = { margin: '12px', minHeight: 150, maxHeight: 300, flexShrink: 0 };
    const editingInputOuterStyle = { margin: '12px 0px', maxHeight: 300, flexShrink: 0 };
    const dialogueOuterStyle = { flex: 1, overflow: 'auto' };
    const [sideBarVisible, setSideBarVisible] = useState(false);
    const [messages, setMessages] = useState(defaultMessages); 
    const [generating, setGenerating] = useState(false);
    const [references, setReferences] = useState([]); 
    const [sideBarContent, setSideBarContent] = useState({});

    const renderLeftMenu = useCallback(() => (<>
        <Configure.Select optionList={modelOptions} field="model" initValue="GPT-4o" />
        <Configure.Button icon={<IconBookOpenStroked />} field="onlineSearch">联网搜索</Configure.Button>
        <Configure.Mcp options={mcpOptions} />
        <Configure.RadioButton options={radioButtonProps} field="thinkType" initValue="template"/>
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
                    name: 'FE',
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
                // onContentChange={onContentChange}
                onMessageSend={onEditMessageSend}
                onReferenceDelete={handleEditingReferenceDelete}
            />
        );
    }, [messages, handleEditingReferenceDelete]);

    const onAnnotationClick = useCallback((annotations) => {
        console.log('annotations', annotations);
        toggleSideBar();
        setSideBarContent({
            type: 'annotation',
            value: annotations
        });
    }, [toggleSideBar]);

    const toggleSideBar = useCallback(() => {
        setSideBarVisible(v => !v);
    }, []);

    const renderSideBarTitle = useCallback((content) => {
        const { type, value } = content;
        return <div style={{ display: 'flex', alignItems: 'center ', justifyContent: 'space-between', padding: 12, color: 'var(--semi-color-text)' }}>
            {type === 'annotation' && <div style={{ fontSize: '16px', lineHeight: '22px', fontWeight: 600 }}>参考资料</div>}
            {type === 'resource' && <div style={{ fontSize: '16px', lineHeight: '22px', fontWeight: 600 }}>产物列表</div>}
            <Button onClick={toggleSideBar} theme="borderless" type="tertiary" icon={<IconClose />} style={{ padding: '0px', width: 24, height: 24 }} />
        </div>;
    }, [toggleSideBar]);

    const renderSideBarBody = useCallback((content) => {
        const { type, value = {} } = content;
        console.log('value')
        if (type === 'annotation') {
            return <div style={{ display: 'flex', flexDirection: 'column', rowGap: '12px', padding: '12px' }} >
                {value.map((item, index) => (<div key={index} style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }} >
                    <span style={{ display: 'flex', alignItems: 'center ', columnGap: 4 }}>
                        <img style={{ width: 20, height: 20, borderRadius: '50%' }} src={item.logo}/>
                        <span style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 600, color: 'var(--semi-color-text-0)' }}>{item.title}</span>
                    </span>
                    <Typography.Paragraph ellipsis={{ rows: 3 }} style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--semi-color-text-1)' }} >{item.detail}</Typography.Paragraph>
                </div>))}
            </div>;
        } else if (type === 'resource') {
            return <div style={{ display: 'flex', flexDirection: 'column', rowGap: '12px', padding: '12px' }} >
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', }}>
                    <IconWord style={{ color: 'var(--semi-color-primary)' }} size='extra-large' /> {value.name}
                </div>
            </div>;
        }
        return <div>

        </div>;
    }, []);

    const customRender = {
        "resource": (item, message) => {
            return <div 
                style={{ 
                    display: 'flex', 
                    gap: 8, 
                    backgroundColor: 'var(--semi-color-fill-0)', 
                    padding: '12px 16px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '12px',
                    cursor: 'pointer'
                }}
                onClick={() => {
                    toggleSideBar();
                    setSideBarContent({
                        type: 'resource',
                        value: item
                    });
                }}
            >
                <IconWord style={{ color: 'var(--semi-color-primary)' }} />
                {item.name}
            </div>;
        },
    };

    return (
        <div style={{ display: 'flex', columnGap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 32px)', overflow: 'hidden', flexGrow: 1 }}>
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
                    onAnnotationClick={onAnnotationClick}
                    renderDialogueContentItem={customRender}
                />
                <AIChatInput 
                    style={inputOuterStyle}
                    placeholder={'输入内容或者上传内容'} 
                    defaultContent={'我是一名<input-slot placeholder="[职业]">程序员</input-slot>，帮我实现<input-slot placeholder="[需求描述]">multi agent 场景下的聊天应用</input-slot>需求'}
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
            {sideBarVisible && <div 
                style={{ flexShrink: 0, width: 300, height: 'calc(100vh - 32px)', borderRadius: '12px', border: '1px solid var(--semi-color-border)', flexShrink: 0 }}
            >
                {renderSideBarTitle(sideBarContent)}
                {renderSideBarBody(sideBarContent)}
            </div>}
        </div>
    );
}


const defaultMessages = [{
    id: '1',
    role: 'user',
    content: '我想开发一个 multi Agent 场景下的聊天应用，你能帮我设计一下吗？',
    status: 'completed',
}, {
    id: '2',
    role: 'assistant',
    name: 'PM',
    content: [{
        type: 'message',
        content: [{
            type: 'input_text',
            text: '收到。为保证方案可落地，我先明确目标与范围：\n\n- 目标：支持多 Agent 协同回复，用户可选择 Agent 或由系统自动分配\n- MVP 功能：\n  1) 基础对话（文本/图片/文件）\n  2) Agent 身份标识与头像\n  3) 正在输入与流式输出\n  4) 引用来源与工具结果展示\n- 约束：先做单会话，不做云端持久化；优先移动端适配\n\n接下来我会整理 PRD 要点并同步给设计与前端。',
            annotations: [
                {
                    title: 'Semi Design',
                    url: 'https://semi.design/zh-CN/start/getting-started',
                    detail: 'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户',
                    logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg'
                },
                {
                    title: 'Semi DSM',
                    url: 'https://semi.design/zh-CN/start/getting-started',
                    detail: 'Semi DSM 支持全局、组件级别的样式定制，并在 Figma 和线上代码之间保持同步。使用 DSM，将 Semi Design 适配为 Any Design',
                    logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg'
                },
                {
                    title: 'Semi D2C',
                    url: 'https://semi.design/zh-CN/start/getting-started',
                    detail: 'Semi D2C 提供开箱即用的设计稿转代码：支持一键识别 Figma 页面中图层布局 + 设计系统组件，像素级还原设计稿，转译为 React JSX 和 CSS 代码。此外还提供了丰富的扩展能力，基于自定义插件系统快速打造团队专属的设计研发协作工具。',
                    logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg'
                }
            ],
        }],
    }],
}, {
    id: '3',
    role: 'assistant',
    name: 'PM',
    content: [{
        type: 'message',
        content: [{
            type: 'input_text',
            text: '生成的PRD如下，设计师会先根据此摘要出信息架构与关键页面',
        }, {
            type: 'resource',
            name: 'PRD.doc',
            size: '100KB',
        }]
    }],
}, {
    id: '4',
    role: 'assistant',
    name: 'UI',
    content: [{
        id: "rs_02175871288540800000000000000000000ffffac1598778c9aa5",
        type: "reasoning",
        summary: [
            {
                "type": "summary_text",
                "text": "\n根据产品经理给的 PRD 绘制关键页面，我需要...."
            }
        ],
        status: "completed"
    }, {
        type: 'function_call',
        name: 'paint_key_pages',
        arguments: "{\"file\":\"PRD\"}",
        status: 'completed',
    }, {
        type: 'message',
        content: [{
            "type": "output_text",
            "text": `设计初稿如下：\n\n- 信息架构：对话页（历史列表 | 消息流 | 工具卡片区）\n- 视觉：左侧展示 Agent 头像与名称标签，色块区分角色\n- 交互：\n  - 输入区支持 @Agent 快速切换与建议提示\n  - 流式输出时展示打字气泡与进度占位\n  - 工具结果以卡片/步骤条形式插入，可展开详情与复制\n\n我先出低保真线框，稍后补高保真与动效说明。`,
        }],
        status: "completed"
    }],
    status: 'completed',
}, {
    id: '5',
    role: 'assistant',
    name: 'FE',
    content: `技术方案建议：\n\n- 技术栈：React + Semi UI，后端采用 WebSocket 或 SSE 支持流式响应\n- 数据模型：消息包含 id、role、name、content、status、references 等字段\n- 组件拆分：AIChatInput + AIChatDialogue；内容采用 Markdown 渲染，支持图片与文件点击\n- 性能：虚拟列表与滚动置底；长文本分块渲染；图片懒加载\n- 可观测性：埋点消息延迟、出错率、工具调用耗时\n\n若确认，我可先搭建页面骨架并接入 mock 数据进行联调。`,
}];

const roleConfig = {
    user: {
        name: 'User',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/22606991eh7uhfups/img/user.png'
    },
    assistant: new Map([
        ['PM', {
            name: '产品经理',
            avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/22606991eh7uhfups/PM.png'
        }],
        ['UI', {
            name: '设计师',
            avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/22606991eh7uhfups/UI.png'
        }],
        ['FE', {
            name: '前端开发',
            avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/22606991eh7uhfups/FE.png'
        }],
    ]),
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


