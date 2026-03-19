---
localeCode: zh-CN
order: 102
category: Ai
title: AIChatDialogue AI对话
icon: doc-aiDialogue
width: 60%
brief: 用户展示 AI 聊天中的对话信息
showNew: true
---

## 使用场景

AIChatDialogue 组件可搭配 AIChatInput 使用，实现更丰富的、功能覆盖更全面、定制更加便捷的 AI 会话场景。
组件消息格式以 OpenAI 的 [Response Object](https://platform.openai.com/docs/api-reference/responses/object) 为原型，默认支持 OpenAI 社区 [Response](https://platform.openai.com/docs/api-reference/responses/create) / [Chat Completion](https://platform.openai.com/docs/api-reference/chat/create) 格式标准，对 GPT-5、GPT-4o 系列模型的响应均支持开箱即用，详见[消息数据转换](/zh-CN/ai/aiChatDialogue#%E6%B6%88%E6%81%AF%E6%95%B0%E6%8D%AE%E8%BD%AC%E6%8D%A2)。


## 代码演示

### 如何引入

```jsx import
import { AIChatDialogue } from '@douyinfe/semi-ui';
```

### 基本用法
通过设置 `chats` 和 `onChatsChange` 实现基础对话显示和交互。

使用 `align` 属性可以设置对话的布局，支持左右分布（`leftRight`， 默认）和左对齐（`leftAlign`）。

```jsx live=true dir="column" noInline=true
import React, { useState, useCallback } from 'react';
import { AIChatDialogue, RadioGroup, Radio } from '@douyinfe/semi-ui';

const defaultMessages = [
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
        content: "给一个 Semi Design 的 Button 组件的使用示例",
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: "以下是一个 Semi 代码的使用示例：\n\`\`\`jsx \nimport React from 'react';\nimport { Button } from '@douyinfe/semi-ui';\n\nconst MyComponent = () => {\n  return (\n    <Button>Click me</Button>\n );\n};\nexport default MyComponent;\n\`\`\`\n",
    }
];

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

function AlignAndMode () {
    const [messages, setMessage] = useState(defaultMessages);
    const [mode, setMode] = useState('bubble');
    const [align, setAlign] = useState('leftRight');

    const onAlignChange = useCallback((e) => {
        setAlign(e.target.value);
    }, []);

    const onModeChange = useCallback((e) => {
        setMode(e.target.value);
    }, []); 

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    return (
        <>
            <span style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
                    模式
                    <RadioGroup onChange={onModeChange} value={mode} type={"button"}>
                        <Radio value={'bubble'}>气泡</Radio>
                        <Radio value={'noBubble'}>非气泡</Radio>
                        <Radio value={'userBubble'}>用户会话气泡</Radio>
                    </RadioGroup>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
                    会话布局方式
                    <RadioGroup onChange={onAlignChange} value={align} type={"button"}>
                        <Radio value={'leftRight'}>左右分布</Radio>
                        <Radio value={'leftAlign'}>左对齐</Radio>
                    </RadioGroup>
                </span>
            </span>
            <div style={{ border: '1px solid var(--semi-color-border)', borderRadius: 12, marginTop: 10, padding: 20 }}>
                <AIChatDialogue 
                    key={align + mode}
                    align={align}
                    mode={mode}
                    chats={messages}
                    roleConfig={roleConfig}
                    onChatsChange={onChatsChange}
                />
            </div>
        </>
    );
}

render(AlignAndMode);

```

### 消息状态
chats 类型为 `Message[]`， `Message` 包含对话的各种信息，如角色 `role`、内容 `content`、状态 `status`
、唯一标识 `id`、创建时间 `createdAt` 等，具体见 [Message](#Message)。其中 status 和 [Response API Status](https://platform.openai.com/docs/api-reference/responses/object#responses/object-status) 相同，存在 6 种状态，对应 3 种官方样式（成功 / 请求中 / 失败）。

```jsx live=true dir="column" noInline=true
import React, { useState, useCallback } from 'react';
import { AIChatDialogue } from '@douyinfe/semi-ui';

const defaultMessages = [
    {
        role: 'assistant',
        id: '1',
        createAt: 1715676751919,
        content: "请求成功", 
        // 默认的 status 为 completed 
    },
    {
        id: 'loading',
        role: 'assistant',
        status: 'in_progress' // 状态展示同 queued、incomplete
    },
    {
        role: 'assistant',
        id: 'error',
        content: '请求错误',
        status: 'failed' // 状态展示同 cancelled
    }
];

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

function StatusDemo () {
    const [messages, setMessage] = useState(defaultMessages);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    return (
        <AIChatDialogue 
            chats={messages}
            roleConfig={roleConfig}
            onChatsChange={onChatsChange}
        />
    );
}

render(StatusDemo);

```

### 消息展示
消息内容展示的类型为 [ContentItem[]](https://platform.openai.com/docs/api-reference/responses/list#responses/list-data)，支持文本 `text`、文件 `file`、图片 `image`、代码 `code`、思考块 `reasoning`、参考来源 `annotation`、工具调用 `tool call` 等消息块的展示，同时提供 `AIChatDialogue.Step` 组件用于步骤等信息的分步展示。

```jsx live=true dir="column" noInline=true
import React, { useState, useCallback } from 'react';
import { AIChatDialogue } from '@douyinfe/semi-ui';
import { IconSearchStroked, IconCodeStroked, IconBriefStroked } from '@douyinfe/semi-icons';


const defaultMessages = [
    {
        role: 'assistant',
        id: '1',
        createAt: 1715676751919,
        content: '普通文本', 
    },
    {
        id: '2',
        role: 'user',
        content: [
            {
                type: 'message',
                content: [
                    {
                        type: 'input_text',
                        text: '帮我生成类似的图片',
                    },
                    {
                        type: 'input_image',
                        image_url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
                        file_id: 'demo-file-id'
                    },
                    {
                        type: 'input_text',
                        text: '以下是文件展示',
                    },
                    {
                        type: 'input_file',
                        file_url: 'https://www.semi.pdf',
                        filename: 'semi.pdf',
                        size: '100KB',
                    },
                    {
                        type: 'input_file',
                        file_url: 'https://www.semi.json',
                        filename: 'semi.json',
                        size: '100KB',
                    },
                    {
                        type: 'input_file',
                        file_url: 'https://www.semi.docx',
                        filename: 'semi.docx',
                        size: '100KB',
                    }
                ],
            },
        ],
        status: 'completed',
    },
    {
        id: '3',
        role: 'assistant',
        content: [
            {
                type: 'reasoning',
                status: 'completed',
                summary: [
                    {
                        'type': 'summary_text',
                        'text': '\n我需要思考并回答用户关于什么是 Semi 组件库的问题...'
                    }
                ],
            },
            {
                type: 'message',
                content: [
                    {
                        type: 'output_text',
                        text: 'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统。'
                    }
                ],
                status: 'completed',
            },
            {
                id: 'fc_12345xyz',
                call_id: 'call_12345xyz',
                type: 'function_call',
                name: 'get_weather',
                status: 'completed',
                arguments: '{\'location\':\'Paris, France\'}'
            },
            {
                type: 'message',
                content: [
                    {
                        type: 'output_text',
                        text: '恭喜你，你已经掌握了 semi design 的所有知识！',
                        annotations: [
                            {
                                title: 'semi.design',
                                url: 'https://semi.design/',
                                detail: 'semi design page',
                                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
                            },
                            {
                                title: 'semi.design',
                                url: 'https://semi.design/',
                                detail: 'semi design page',
                                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
                            },
                        ]
                    }
                ]
            },
            {
                type: 'plan',
                content: [
                    {
                        summary: '创建一份全面的北京旅游攻略，包含景点、住宿、交通、美食和实用旅行建议',
                        steps: [
                            {
                                summary: '搜索北京旅游景点介绍及门票信息',
                                description: '正在搜索: 北京旅游景点介绍及门票信息',
                                type: 'search',
                            }, 
                            {
                                summary: '读取指定文件的指定行内容',
                                description: '正在创建文档:  北京旅游攻略',
                                type: 'docs',
                            }, 
                            {
                                summary: '创建包含北京旅游攻略的文件',
                                description: '正在创建代码文件: beijing_travel_guide.html',
                                type: 'code',
                            }, 
                        ],
                        statues: 'completed'
                    },
                    {
                        summary: '总结北京旅游攻略的创建成果并呈现给用户',
                        steps: []
                    }
                ],
            }
        ],
        status: 'completed',
    },
];

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

function AllTypeMessageDemo () {
    const [messages, setMessage] = useState(defaultMessages);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const mapStep = useCallback((steps) => {
        if (!steps) {
            return [];
        }
        return steps.map((item) => {
            let icon = null;
            switch (item.type) {
                case 'search':
                    icon = <IconSearchStroked />;
                    break;
                case 'docs':
                    icon = <IconBriefStroked />;
                    break;
                case 'code':
                    icon = <IconCodeStroked />;
                    break;
            }
            return {
                summary: item.summary,
                description: item.description,
                icon: icon,
            };
        });
    }, []);

    const customRender = useMemo(() => ({
        'plan': (item) => { // plan 为用户自定义类型
            let steps = item.content.map((item) => {
                return {
                    summary: item.summary,
                    actions: mapStep(item.steps),
                    status: 'completed'
                };
            });
            return <AIChatDialogue.Step steps={steps} />;
        },
    }), [mapStep]);

    return (
        <AIChatDialogue 
            chats={messages}
            roleConfig={roleConfig}
            onChatsChange={onChatsChange}
            renderDialogueContentItem={customRender}
        />
    );
}

render(AllTypeMessageDemo);

```


### 引用
通过 `references` 字段定义当前消息引用的文件或者文本， `showReference` 配置当前消息是否显示可被引用样式, `onReferenceClick` 配置引用按钮点击回调。具体和 AIChatInput 的搭配使用见 [AI 组件构建对话](/zh-CN/ai/aiComponent#AI%20%E7%BB%84%E4%BB%B6%E6%9E%84%E5%BB%BA%E5%AF%B9%E8%AF%9D)

```jsx live=true dir="column" noInline=true
import React, { useState, useCallback } from 'react';
import { AIChatDialogue } from '@douyinfe/semi-ui';

const defaultMessages = [
    {
        id: '1',
        role: 'user',
        content: '当前消息为引用 demo 的示例',
        references: [
            {
                id: '1',
                type: 'text',
                content: '测试文本，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字,这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字',
            },
            {
                id: '2',
                name: '飞书文档.docx',
            },
            {
                id: '3',
                name: 'Music.mp4',
            },
            {
                id: '4',
                name: 'Image.jpeg',
                url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/Resso.png'
            },
            {
                id: '5',
                name: 'code.json',
            }
        ]
    }
];

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

function ReferencesDemo () {
    const [messages, setMessage] = useState(defaultMessages);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const onReferenceClick = () => {
        console.log('You click the reference button!');
    };

    return (
        <AIChatDialogue 
            chats={messages}
            roleConfig={roleConfig}
            onChatsChange={onChatsChange}
            showReference
            onReferenceClick={onReferenceClick}
        />
    );
}

render(ReferencesDemo);
```


### 选择
```jsx live=true dir="column" noInline=true
import React, { useState, useCallback } from 'react';
import { AIChatDialogue, RadioGroup, Radio } from '@douyinfe/semi-ui';

const defaultMessages = [
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
        content: "给一个 Semi Design 的 Button 组件的使用示例",
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: "以下是一个 Semi 代码的使用示例：\n\`\`\`jsx \nimport React from 'react';\nimport { Button } from '@douyinfe/semi-ui';\n\nconst MyComponent = () => {\n  return (\n    <Button>Click me</Button>\n );\n};\nexport default MyComponent;\n\`\`\`\n",
    }
];

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

function SelectingDemo () {
    const ref = useRef(null);
    const [messages, setMessage] = useState(defaultMessages);
    const [align, setAlign] = useState('leftRight');
    const [select, setSelect] = useState(true);
    const [selection, setSelection] = useState('allSelect');

    useEffect(() => {
        ref.current.selectAll();
    }, []);

    const onSelectChange = useCallback((e) => {
        setSelect(e.target.value);
    }, []);

    const onSelectionChange = useCallback((e) => {
        if (e.target.value === 'allSelect') {
            ref.current.selectAll();
        } else {
            ref.current.deselectAll();
        }
        setSelection(e.target.value);
    }, []);

    const onSelect = useCallback((selectionId) => {
        console.log('onSelect', selectionId);
    }, []);

    const onAlignChange = useCallback((e) => {
        setAlign(e.target.value);
    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    return (
        <div>
            <span style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
                    会话布局方式
                    <RadioGroup onChange={onAlignChange} value={align} type={"button"}>
                        <Radio value={'leftRight'}>左右分布</Radio>
                        <Radio value={'leftAlign'}>左对齐</Radio>
                    </RadioGroup>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
                    是否开启选择
                    <RadioGroup onChange={onSelectChange} value={select} type={"button"}>
                        <Radio value={true}>开启</Radio>
                        <Radio value={false}>关闭</Radio>
                    </RadioGroup>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
                    选择方式
                    <RadioGroup onChange={onSelectionChange} value={selection} type={"button"}>
                        <Radio value={'allSelect'}>全选</Radio>
                        <Radio value={'cancelSelect'}>取消全选</Radio>
                    </RadioGroup>
                </span>
            </span>

            <div style={{ border: '1px solid var(--semi-color-border)', borderRadius: 12, marginTop: 10, padding: 20 }}>
                <AIChatDialogue 
                    ref={ref}
                    align={align}
                    mode="bubble"
                    chats={messages}
                    selecting={select}
                    onSelect={onSelect}
                    roleConfig={roleConfig}
                />
            </div>
        </div>
    );
}

render(SelectingDemo);

```

<!-- todo -->
<!-- ### 编辑消息 -->
<!-- ```jsx live=true dir="column" noInline=true

``` -->


### 提示
通过 `hints` 可设置提示区域内容, 点击提示内容后，提示内容将成为新的用户输入内容，并触发 `onHintClick` 回调。

```jsx live=true dir="column"
import React, { useState, useCallback } from 'react';
import { AIChatDialogue } from '@douyinfe/semi-ui';

() => {
    const defaultMessages = [
        {
            role: 'assistant',
            id: '1',
            createAt: 1715676751919,
            content: 'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统，你可以向我提问任何关于 Semi 的问题。',
        }
    ];

    const hintsExample = [
        "Semi 组件库有哪些常用组件？",
        "能否展示一个使用 Semi 组件库构建的页面示例？",
        "Semi 组件库有官方文档吗？",
    ];

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
    const [messages, setMessage] = useState(defaultMessages);
    const [hints, setHints] = useState(hintsExample);
  
    const onChatsChange = useCallback((chats) => {
        console.log('onChatsChange', chats);
        setMessage(chats);
    }, []);

    const onHintClick = useCallback((hint) => {
        setHints([]);
    }, []);

    return (
        <AIChatDialogue 
            align="leftRight"
            mode="bubble"
            chats={messages}
            roleConfig={roleConfig}
            onChatsChange={onChatsChange}
            hints={hints}
            onHintClick={onHintClick}
        />
    );
};

```



### 自定义渲染提示
通过 `renderHintBox` 可自定义提示区域内容， 参数如下

```ts
type renderHintBox = (props: {content: string; index: number,onHintClick: () => void}) => React.ReactNode;
```

```jsx live=true dir="column"
import React, { useState, useCallback } from 'react';
import { AIChatDialogue } from '@douyinfe/semi-ui';
import { IconArrowRight } from '@douyinfe/semi-icons';


() => {
    const defaultMessages = [
        {
            role: 'assistant',
            id: '1',
            createAt: 1715676751919,
            content: 'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统，你可以向我提问任何关于 Semi 的问题。',
        }
    ];

    const hintsExample = [
        "Semi 组件库有哪些常用组件？",
        "能否展示一个使用 Semi 组件库构建的页面示例？",
        "Semi 组件库有官方文档吗？",
    ];

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
    const [messages, setMessage] = useState(defaultMessages);
    const [hints, setHints] = useState(hintsExample);
  
    const onChatsChange = useCallback((chats) => {
        console.log('onChatsChange', chats);
        setMessage(chats);
    }, []);

    const onHintClick = useCallback((hint) => {
        setHints([]);
    }, []);

    const commonHintStyle = useMemo(() => ({
        border: '1px solid var(--semi-color-border)',
        padding: '10px',
        borderRadius: '10px',
        color: 'var( --semi-color-text-1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: '14px'
    }), []);

    const renderHintBox = useCallback((props) => {
        const { content, onHintClick, index } = props;
        return (
            <div style={commonHintStyle} onClick={onHintClick} key={index}>
                {content}
                <IconArrowRight style={{ marginLeft: 10 }}>click me</IconArrowRight>
            </div>
        );
    }, []);
    

    return (
        <AIChatDialogue 
            align="leftRight"
            mode="bubble"
            chats={messages}
            roleConfig={roleConfig}
            onChatsChange={onChatsChange}
            hints={hints}
            onHintClick={onHintClick}
            renderHintBox={renderHintBox}
        />
    );
};
```

### 自定义渲染会话框
通过 `chatBoxRenderConfig` 传入自定义渲染配置, chatBoxRenderConfig 类型如下

```ts
export interface RenderTitleProps {
    message?: Message;
    role?: Metadata;
    defaultTitle?: ReactNode
}

export interface RenderAvatarProps {
    message?: Message; 
    role?: Metadata, 
    defaultAvatar?: ReactNode
}

export interface RenderContentProps {
    message?: Message;
    role?: Metadata | Map<string, Metadata>;
    defaultContent?: ReactNode | ReactNode[]; 
    className?: string;
}

export interface DefaultActionNodeObj {
    copyNode: ReactNode;
    likeNode: ReactNode;
    dislikeNode: ReactNode;
    resetNode: ReactNode;
    moreNode: ReactNode;
}

export interface RenderActionProps {
    message?: Message;
    defaultActions?: ReactNode | ReactNode[];
    className: string;
    defaultActionsObj?: DefaultActionNodeObj;
};

export interface FullDialogueNodes {
    avatar?: ReactNode;
    title?: ReactNode; 
    content?: ReactNode; 
    action?: ReactNode
}

export interface RenderFullDialogueProps {
    message?: Message;
    role?: Metadata;
    defaultNodes?: FullDialogueNodes;
    className: string
}


export interface DialogueRenderConfig {
    /* 自定义渲染标题 */
    renderDialogueAction?: (props: RenderActionProps) => ReactNode;
    /* 自定义渲染头像 */
    renderDialogueAvatar?: (props: RenderAvatarProps) => ReactNode;
    /* 自定义渲染内容区域 */
    renderDialogueContent?: (props: RenderContentProps) => ReactNode;
    /* 自定义渲染消息操作栏 */
    renderDialogueTitle?: (props: RenderTitleProps) => ReactNode;
    /* 完全自定义渲染整个聊天框 */
    renderFullDialogue?: (props: RenderFullDialogueProps) => ReactNode
}
```

自定义渲染头像和标题，可通过 `renderChatBoxAvatar` 和 `renderChatBoxTitle` 实现。
```jsx live=true dir="column" 
import React, { useState, useCallback } from 'react';
import { AIChatDialogue, Avatar } from '@douyinfe/semi-ui';

() => {
    const defaultMessages = [
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
            content: "给一个 Semi Design 的 Button 组件的使用示例",
        },
        {
            role: 'assistant',
            id: '3',
            createAt: 1715676751919,
            content: "以下是一个 Semi 代码的使用示例：\n\`\`\`jsx \nimport React from 'react';\nimport { Button } from '@douyinfe/semi-ui';\n\nconst MyComponent = () => {\n  return (\n    <Button>Click me</Button>\n );\n};\nexport default MyComponent;\n\`\`\`\n",
        }
    ];

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

    const [messages, setMessage] = useState(defaultMessages);
    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const renderConfig = {
        renderDialogueTitle: (props) => {
            return <div className="semi-ai-chat-dialogue-title">My-{props.role.name}</div>;
        },
        renderDialogueAvatar: (props) => {
            return <Avatar
                src={props.role.avatar}
                size="extra-small"
                shape="square"
            >
            </Avatar>;
        },
        renderDialogueAction: (props) => {
            return <div className={props.className}>{props.defaultActions[0]}</div>;
        },
    };

    return (
        <AIChatDialogue 
            align="leftRight"
            mode="bubble"
            chats={messages}
            roleConfig={roleConfig}
            onChatsChange={onChatsChange}
            dialogueRenderConfig={renderConfig}
        />
    );
};

```

### 自定义渲染消息内容

通过 `renderDialogueContentItem` 按照消息类型返回内容渲染，用法如下

```jsx live=true dir="column" noInline=true
import React, { useState, useCallback } from 'react';
import { AIChatDialogue, MarkdownRender } from '@douyinfe/semi-ui';

const defaultMessages = [
    {
        id: '1',
        role: 'user',
        content: '你好',
    }, 
    {
        id: '2',
        role: 'assistant',
        content: '你好呀，请问有什么可以帮助你的吗~',
        status: 'completed',
    }, 
    {
        id: '3',
        role: 'user',
        content: [
            {
                type: 'message',
                role: 'user',
                content: [
                    {
                        type: 'input_text',
                        text: '帮我生成类似的图片',
                    }, 
                    {
                        type: 'input_image',
                        image_url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
                        file_id: 'demo-file-id'
                    }, 
                    {
                        type: 'input_image',
                        image_url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
                        file_id: 'demo-file-id'
                    }
                ],
            }],
    }, 
    {
        id: '4',
        role: 'assistant',
        content: [{
            type: "reasoning",
            summary: [
                {
                    "type": "summary_text",
                    "text": "\n用户问需要我帮助他生成类似图片，我需要先分析图片内容，然后生成类似的图片..."
                }
            ],
            annotations: [
                {
                    title: 'semi.design',
                    url: 'https://semi.design/',
                    detail: 'semi design page',
                    logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
                },
                {
                    title: 'semi.design',
                    url: 'https://semi.design/',
                    detail: 'semi design page',
                    logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
                },
            ],
            status: "completed"
        }, 
        {
            type: 'function_call',
            name: 'create_travel_guide',
            arguments: "{\n\"city\": \"北京\"\n}",
            status: 'completed',
        }
        ],
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

function CustomRender () {
    const [messages, setMessage] = useState(defaultMessages);
    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const userTextStyle = {
        backgroundColor: 'var(--semi-color-fill-1)',
        color: 'var(--semi-color-text-0)',
        borderRadius: '25px',
        padding: '6px 16px',
    };

    const assistantStyle = {
        color: 'var(--semi-color-text-0)',
        padding: '6px 16px',
    };

    const functionCallStyle = {
        backgroundColor: 'var(--semi-color-fill-1)',
        padding: '6px 16px',
        borderRadius: '25px',
    };

    const customRenderReasoningContent = useCallback((props) => {
        return <React.Fragment>
            <AIChatDialogue.Annotation 
                annotation={props.annotations} 
                description={'参考资料'} 
                maxCount={3}
                onClick={(e) => {
                    e && e.stopPropagation();
                    Toast.success('Ready to open the sidebar!');
                }}
            />
            <div style={{ marginTop: '8px' }}>
                <MarkdownRender
                    format='md'
                    raw={props.summary[0].text}
                    {...props.markdownRenderProps}
                />
            </div>
        </React.Fragment>;
    }, []);

    const customRender = {
        "function_call": {
            "create_travel_guide": (item) => {
                return <div style={functionCallStyle}>Function Tool Call: {item.name} {item.arguments}</div>;
            }
        },
        "input_text": (item, message) => {
            if (message.role === 'user') {
                return <div style={userTextStyle} className={'userTextStyle'}>{item.text}</div>;
            }
            return <div style={assistantStyle}>{item.text}</div>;
        },
        "reasoning": (item) => {
            return <AIChatDialogue.Reasoning {...item} customRenderer={customRenderReasoningContent} />;
        },
        "default": (item, message) => {
            if (message.role === 'user') {
                return <div style={userTextStyle} className={'userTextStyle'}>{item}</div>;
            } else {
                return <div style={assistantStyle}>{item}</div>;
            }
        }
    };

    return (
        <AIChatDialogue 
            chats={messages}
            roleConfig={roleConfig}
            onChatsChange={onChatsChange}
            renderDialogueContentItem={customRender}
        />
    );
}

render(CustomRender);
```



### 消息数据转换
当前组件的对话消息以 OpenAI 的 [Response Object](https://platform.openai.com/docs/api-reference/responses/object) 为原型，为了支持用户更好地无缝集成 [Chat Completion API](https://platform.openai.com/docs/api-reference/chat/create) 和 [Response API](https://platform.openai.com/docs/api-reference/responses/create)，我们提供了四种 `Adapter` 转换函数，用户可直接使用该函数转换 API 的返回结果，得到可直接用于消息展示的数据，提供两种 `Adapter` 用于将 `ChatInput` 组件的数据处理成适配于 `Response API` 的 `input Message` 或者 `Chat Completion API` 中的 `Input Message` 格式。 

```ts
// 将 Chat Completion API 返回的数据转换为 Chat Dialogue 中的 Message 格式
function chatCompletionToMessage(chatCompletion: ChatCompletion): Message[]

// 将 Chat Completion API 流式返回数据转换为 Chat Dialogue 中的 Message 格式
function streamingChatCompletionToMessage(chatCompletionChunks: ChatCompletionChunk[], state?: StreamingChatState): { messages: Message[]; state?: StreamingChatState }

// 将 Response API 返回的数据转换为 Chat Dialogue 中的 Message 格式
function responseToMessage(response: Response): Message

// 将 Response API 返回流式数据转换为 Chat Dialogue 中的 Message 格式
function streamingResponseToMessage(chunks: ResponseChunk[], prevState: StreamingResponseState): { messages: Message[]; state?: StreamingResponseState }

// 将 Chat Input 数据转换为 Chat Dialogue 中的 Message 格式，（同 Response API Input Message 格式）
function chatInputToMessage(inputContent: MessageContent): Message

// 将 Chat Input 数据转换为 Chat Completion API 中的 Input Message 格式
function chatInputToChatCompletion(inputContent: MessageContent): ChatCompletionInput
```

比如，当用户使用 [Chat Completion API](https://platform.openai.com/docs/api-reference/chat/create) 接口返回非流式数据时，可以通过 `chatCompletionToMessage` 函数将 Chat Completion Object 转换为 Dialogue Message 消息块格式。注意，因为 `Chat Completion API` 可以通过 `n` 来控制每条输入消息生成多少个结果所以该函数的返回值为数组。(注意：如果 n > 1，用户需要自行决定将哪条数据添加到 message 中展示)

```jsx live=true noInline=true dir="column"
import React, { useState, useCallback } from 'react';
import { AIChatDialogue } from '@douyinfe/semi-ui';

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

function ChatCompletionToMessageDemo() {
    const [messages, setMessage] = useState([]);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    useEffect(() => {
        const message = chatCompletionToMessage(CHAT_COMPLETION_DATA);
        setMessage([...message]);
    }, []);
  
    return (
        <AIChatDialogue 
            align="leftRight"
            mode="bubble"
            chats={messages}
            roleConfig={roleConfig}
            onChatsChange={onChatsChange}
        />
    );
};

const CHAT_COMPLETION_DATA = {
    "id": "chatcmpl-B9MBs8CjcvOU2jLn4n570S5qMJKcT",
    "object": "chat.completion",
    "created": 1741569952,
    "model": "gpt-4.1-2025-04-14",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "Hello! How can I assist you today?",
                "refusal": null,
                "annotations": [],
                "tool_calls": [
                    {
                        "id": "call_abc123",
                        "type": "function",
                        "function": {
                            "name": "get_current_weather",
                            "arguments": "{\n\"location\": \"Boston, MA\"\n}"
                        }
                    }
                ]
            },
            "logprobs": null,
            "finish_reason": "stop"
        }
    ],
    // ...
};

render(ChatCompletionToMessageDemo);
```


比如，当用户使用 [Chat Completion API](https://platform.openai.com/docs/api-reference/chat/create) 接口返回流式数据时，可以通过 `streamingChatCompletionToMessage` 函数将 Chat Completion Chunk Object List 转换为 Dialogue Message 消息块格式。

```jsx live=true noInline=true dir="column"
import React, { useState, useCallback } from 'react';
import { AIChatDialogue } from '@douyinfe/semi-ui';

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

function StreamingChatCompletionToMessageDemo() {
    const [messages, setMessage] = useState([]);
    const [state, setState] = useState();

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    useEffect(() => {
        const total = STREAMING_CHAT_COMPLETION_DATA.length;
        let i = 1;

        const timer = setInterval(() => {
            if (i > total) {
                clearInterval(timer);
                return;
            }

            const slice = STREAMING_CHAT_COMPLETION_DATA.slice(0, i);
            const { messages: partialMessages, state: nextState } = streamingChatCompletionToMessage(slice, state);
            setState(nextState);

            const merged = [...messages, partialMessages[0]];
            setMessage(merged);

            i += 1;
        }, 100);

        return () => clearInterval(timer);
    }, []);
  
    return (
        <AIChatDialogue 
            align="leftRight"
            mode="bubble"
            chats={messages}
            roleConfig={roleConfig}
            onChatsChange={onChatsChange}
        />
    );
};

const STREAMING_CHAT_COMPLETION_DATA = [
    { "id": "chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT", "object": "chat.completion.chunk", "created": 1760011843, "model": "o3-mini-2025-01-31", "service_tier": "default", "system_fingerprint": "fp_6c43dcef8c", "choices": [{ "index": 0, "delta": { "role": "assistant", "content": "", "refusal": null }, "finish_reason": null }], "obfuscation": "ahPqlzj6DD" },
    { "id": "chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT", "object": "chat.completion.chunk", "created": 1760011843, "model": "o3-mini-2025-01-31", "service_tier": "default", "system_fingerprint": "fp_6c43dcef8c", "choices": [{ "index": 0, "delta": { "content": "" }, "finish_reason": null }], "obfuscation": "i2PXRIwvc3D" },
    // index 0: 输出文本增量
    { "id": "chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT", "object": "chat.completion.chunk", "created": 1760011843, "model": "o3-mini-2025-01-31", "service_tier": "default", "system_fingerprint": "fp_6c43dcef8c", "choices": [{ "index": 0, "delta": { "content": "我正在使用 " }, "finish_reason": null }], "obfuscation": "3sslO5QylW" },
    { "id": "chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT", "object": "chat.completion.chunk", "created": 1760011843, "model": "o3-mini-2025-01-31", "service_tier": "default", "system_fingerprint": "fp_6c43dcef8c", "choices": [{ "index": 0, "delta": { "content": "streamingChatCompletionToMessage" }, "finish_reason": null }], "obfuscation": "3sslO5QylW" },

    // index 1: 工具调用增量（function_call / tool_calls）
    { "id": "chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT", "object": "chat.completion.chunk", "created": 1760011845, "model": "o3-mini-2025-01-31", "service_tier": "default", "system_fingerprint": "fp_6c43dcef8c", "choices": [{ "index": 1, "delta": { "tool_calls": [{ "id": "call_1", "function": { "name": "searchWeather", "arguments": "{\"city\":\"北京\"" } }] }, "finish_reason": null }], "obfuscation": "T1" },
    { "id": "chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT", "object": "chat.completion.chunk", "created": 1760011846, "model": "o3-mini-2025-01-31", "service_tier": "default", "system_fingerprint": "fp_6c43dcef8c", "choices": [{ "index": 1, "delta": { "tool_calls": [{ "id": "call_1", "function": { "name": null, "arguments": ",\"day\":\"today\"}" } }] }, "finish_reason": null }], "obfuscation": "T2" },

    { "id": "chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT", "object": "chat.completion.chunk", "created": 1760011844, "model": "o3-mini-2025-01-31", "service_tier": "default", "system_fingerprint": "fp_6c43dcef8c", "choices": [{ "index": 0, "delta": { "content": " 转换 Chat Completion Chunks" }, "finish_reason": null }], "obfuscation": "X1" },
    { "id": "chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT", "object": "chat.completion.chunk", "created": 1760011844, "model": "o3-mini-2025-01-31", "service_tier": "default", "system_fingerprint": "fp_6c43dcef8c", "choices": [{ "index": 0, "delta": { "content": " 🥳" }, "finish_reason": null }], "obfuscation": "X2" },

    // 终止信号
    { "id": "chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT", "object": "chat.completion.chunk", "created": 1760011843, "model": "o3-mini-2025-01-31", "service_tier": "default", "system_fingerprint": "fp_6c43dcef8c", "choices": [{ "index": 0, "delta": {}, "finish_reason": "stop" }], "obfuscation": "n13SLf" },
    { "id": "chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT", "object": "chat.completion.chunk", "created": 1760011843, "model": "o3-mini-2025-01-31", "service_tier": "default", "system_fingerprint": "fp_6c43dcef8c", "choices": [{ "index": 1, "delta": {}, "finish_reason": "stop" }], "obfuscation": "jt9rDb" }
];

render(StreamingChatCompletionToMessageDemo);

```

当用户使用 [Response API](https://platform.openai.com/docs/api-reference/responses/create) 接口返回非流式数据时，可以通过 `responseToMessage` 函数将 Response Object 转换为 Dialogue Message 消息块格式。
```jsx live=true noInline=true dir="column"
import React, { useState, useCallback } from 'react';
import { AIChatDialogue } from '@douyinfe/semi-ui';

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

function ResponseToMessageDemo() {
    const [messages, setMessage] = useState([]);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    useEffect(() => {
        const responseMessage = responseToMessage(RESPONSE_DATA);

        setMessage([responseMessage]);
    }, []);
  
    return (
        <AIChatDialogue 
            align="leftRight"
            mode="bubble"
            chats={messages}
            roleConfig={roleConfig}
            onChatsChange={onChatsChange}
        />
    );
};

const RESPONSE_DATA = {
    "id": "resp_67ccd3a9da748190baa7f1570fe91ac604becb25c45c1d41",
    "object": "response",
    "created_at": 1741476777,
    "status": "completed",
    "error": null,
    "incomplete_details": null,
    "instructions": null,
    "max_output_tokens": null,
    "model": "gpt-4o-2024-08-06",
    "output": [
        {
            "id": "rs_6876cf02e0bc8192b74af0fb64b715ff06fa2fcced15a5ac",
            "type": "reasoning",
            "status": "completed",
            "summary": [
                {
                    "type": "summary_text",
                    "text": "**用户询问什么是 Semi Design** 用户问 “Semi Design”需整合多源信息。首先发现抖音的 Semi Design 是设计系统，支持多平台且含 Design Token 和代码转换工具。印度 Semi Design 专注半导体培训，但用户可能更关注抖音案例。其他结果涉及半定制设计，但关联性较低。需确认是否有其他解释，但当前信息已覆盖主要维度。虽然继续推理可能提高完备性，但现阶段已足够支撑答案，可以开始输出给用户。"
                }
            ]
        },
        {
            "type": "message",
            "id": "msg_67ccd3acc8d48190a77525dc6de64b4104becb25c45c1d41",
            "status": "completed",
            "role": "assistant",
            "content": [
                {
                    "type": "output_text",
                    "text": "Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统",
                    "annotations": [
                        {
                            "title": 'Semi Design',
                            "url": 'https://semi.design/zh-CN/start/getting-started',
                            "detail": 'Semi Design 快速开始',
                            "logo": 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
                        },
                        {
                            "title": 'Semi Design',
                            "url": 'https://semi.design/zh-CN/start/getting-started',
                            "detail": 'Semi Design 快速开始',
                            "logo": 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
                        },
                        {
                            "title": 'Semi Design',
                            "url": 'https://semi.design/zh-CN/start/getting-started',
                            "detail": 'Semi Design 快速开始',
                            "logo": 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
                        },
                    ]
                }
            ]
        },
        {
            "id": "fc_12345xyz",
            "call_id": "call_12345xyz",
            "type": "function_call",
            "name": "get_semi_page",
            "status": "completed",
            "arguments": "{\"pageName\":\"AIChatDialogue\"}"
        },
    ],
    // ...
};

render(ResponseToMessageDemo);
```

当用户使用 [Response API](https://platform.openai.com/docs/api-reference/responses/create) 接口返回流式数据时，可以通过 `streamingResponseToMessage` 函数将 Response Chunk Object List 转换为 Dialogue Message 消息块格式。
```jsx live=true noInline=true dir="column"
import React, { useState, useCallback } from 'react';
import { AIChatDialogue } from '@douyinfe/semi-ui';

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

const FIXED_SHUFFLED_INDICES = [
    0,  // sequence_number: 0
    1,  // sequence_number: 1
    2,  // sequence_number: 2
    3,  // sequence_number: 3
    4,  // sequence_number: 4
    6,  // sequence_number: 6 (块5被跳过 / chunk 5 skipped)
    6,  // sequence_number: 6 (块6重复到达)
    7,  // sequence_number: 7
    5,  // sequence_number: 5 (块5延迟到达 / chunk 5 arrives late)
    8,  // sequence_number: 8
    9,  // sequence_number: 9
    10, // sequence_number: 10
    11, // sequence_number: 11
    12, // sequence_number: 12 
    13, // sequence_number: 13 
    14, // sequence_number: 14
    15, // sequence_number: 15
    16, // sequence_number: 16
];

function StreamingResponseToMessageDemo() {
    const [messages, setMessage] = useState([]);
    const [currentState, setCurrentState] = useState(null);
    const [currentLength, setCurrentLength] = useState(0);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    useEffect(() => {
        if (currentLength > FIXED_SHUFFLED_INDICES.length) {
            return;
        }

        const timer = setTimeout(() => {
            if (currentLength === 0) {
                setCurrentLength(1);
                return;
            }

            const currentIndices = FIXED_SHUFFLED_INDICES.slice(0, currentLength);
            const currentChunks = currentIndices.map(index => REASONING_CHUNKS[index]);

            const result = streamingResponseToMessage(currentChunks, currentState);
            
            if (result) {
                const { message: responseMessage, nextState } = result;
                if (responseMessage) {
                    setMessage([responseMessage]);
                    // 更新状态供下次使用 / Update state for next iteration
                    setCurrentState(nextState);
                }
            }
            setCurrentLength(prev => prev + 1);
        }, 200);

        return () => clearTimeout(timer);
    }, [currentLength, currentState]);
  
    return (
        <AIChatDialogue 
            align="leftRight"
            mode="bubble"
            chats={messages}
            roleConfig={roleConfig}
            onChatsChange={onChatsChange}
        />
    );
};

const REASONING_CHUNKS = [
    { "type": "response.created", "sequence_number": 0, "response": { "id": "resp_reason_001", "object": "response", "created_at": 1760091777, "status": "in_progress", "background": false, "error": null, "incomplete_details": null, "instructions": null, "max_output_tokens": null, "max_tool_calls": null, "model": "o3-mini-2025-01-31", "output": [], "parallel_tool_calls": true, "previous_response_id": null, "prompt_cache_key": null, "reasoning": { "effort": "medium", "summary": null }, "safety_identifier": null, "service_tier": "auto", "store": true, "temperature": 1.0, "text": { "format": { "type": "text" }, "verbosity": "medium" }, "tool_choice": "auto", "tools": [], "top_logprobs": 0, "top_p": 1.0, "truncation": "disabled", "usage": null, "user": null, "metadata": {} } },
    { "type": "response.in_progress", "sequence_number": 1, "response": { "id": "resp_reason_001", "object": "response", "created_at": 1760091777, "status": "in_progress", "background": false, "error": null, "incomplete_details": null, "instructions": null, "max_output_tokens": null, "max_tool_calls": null, "model": "o3-mini-2025-01-31", "output": [], "parallel_tool_calls": true, "previous_response_id": null, "prompt_cache_key": null, "reasoning": { "effort": "medium", "summary": null }, "safety_identifier": null, "service_tier": "auto", "store": true, "temperature": 1.0, "text": { "format": { "type": "text" }, "verbosity": "medium" }, "tool_choice": "auto", "tools": [], "top_logprobs": 0, "top_p": 1.0, "truncation": "disabled", "usage": null, "user": null, "metadata": {} } },

    // reasoning item（输出索引 0）
    { "type": "response.output_item.added", "sequence_number": 2, "output_index": 0, "item": { "id": "rs_reason_001", "type": "reasoning", "summary": [] } },
    { "type": "response.reasoning_summary_part.added", "sequence_number": 3, "output_index": 0, "summary_index": 0, "part": { "type": "reasoning", "text": "" } },
    { "type": "response.reasoning_summary_text.delta", "sequence_number": 4, "output_index": 0, "summary_index": 0, "delta": "思" },
    { "type": "response.reasoning_summary_text.delta", "sequence_number": 5, "output_index": 0, "summary_index": 0, "delta": "考" },
    { "type": "response.reasoning_summary_text.delta", "sequence_number": 6, "output_index": 0, "summary_index": 0, "delta": "完" },
    { "type": "response.reasoning_summary_text.delta", "sequence_number": 7, "output_index": 0, "summary_index": 0, "delta": "成" },
    { "type": "response.reasoning_summary_text.delta", "sequence_number": 8, "output_index": 0, "summary_index": 0, "delta": "！" },
    { "type": "response.reasoning_summary_text.done", "sequence_number": 9, "output_index": 0, "summary_index": 0, "text": "思考完成！" },
    { "type": "response.output_item.done", "sequence_number": 10, "output_index": 0, "item": { "id": "rs_reason_001", "type": "reasoning", "summary": [ { "type": "reasoning", "text": "思考完成！" } ] } },

    // assistant message（输出索引 1）
    { "type": "response.output_item.added", "sequence_number": 11, "output_index": 1, "item": { "id": "msg_reason_001", "type": "message", "status": "in_progress", "content": [], "role": "assistant" } },
    { "type": "response.content_part.added", "sequence_number": 12, "item_id": "msg_reason_001", "output_index": 1, "content_index": 0, "part": { "type": "output_text", "annotations": [], "text": "" } },
    { "type": "response.output_text.delta", "sequence_number": 13, "item_id": "msg_reason_001", "output_index": 1, "content_index": 0, "delta": "基于上述思考，" },
    { "type": "response.output_text.delta", "sequence_number": 14, "item_id": "msg_reason_001", "output_index": 1, "content_index": 0, "delta": "结论如下：" },
    { "type": "response.output_text.done", "sequence_number": 15, "item_id": "msg_reason_001", "output_index": 1, "content_index": 0, "text": "基于上述思考，结论如下：..." },

    { "type": "response.completed", "sequence_number": 16, "response": { "id": "resp_reason_001", "object": "response", "created_at": 1760091777, "status": "completed", "background": false, "error": null, "incomplete_details": null, "instructions": null, "max_output_tokens": null, "max_tool_calls": null, "model": "o3-mini-2025-01-31", "output": [ { "id": "rs_reason_001", "type": "reasoning", "summary": [ { "type": "reasoning", "text": "思考完成！" } ] }, { "id": "msg_reason_001", "type": "message", "status": "completed", "content": [ { "type": "output_text", "annotations": [], "text": "基于上述思考，结论如下：..." } ], "role": "assistant" } ], "parallel_tool_calls": true, "previous_response_id": null, "prompt_cache_key": null, "reasoning": { "effort": "medium", "summary": null }, "safety_identifier": null, "service_tier": "default", "store": true, "temperature": 1.0, "text": { "format": { "type": "text" }, "verbosity": "medium" }, "tool_choice": "auto", "tools": [], "top_logprobs": 0, "top_p": 1.0, "truncation": "disabled", "usage": { "input_tokens": 12, "input_tokens_details": { "cached_tokens": 0 }, "output_tokens": 120, "output_tokens_details": { "reasoning_tokens": 16 }, "total_tokens": 132 }, "user": null, "metadata": {} } }
];

render(StreamingResponseToMessageDemo);

```

## API 参考
| 属性 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| align | 对话布局方式 | 'leftRight' \| 'leftAlign' | 'leftRight' |
| chats | 受控对话消息列表 | Message[] | - |
| className | 自定义类名 | string | - |
| disabledFileItemClick | 是否禁用文件点击 | boolean | false |
| hintCls | 提示区最外层样式类名 | string | - |
| hints | 提示信息 | string[] | - |
| hintStyle | 提示区最外层样式 | CSSProperties | - |
| markdownRenderProps | 该参数将透传给对话框渲染所用的 MarkdownRender 组件，详见 [MarkdownRenderProps](/zh-CN/plus/markdownrender#API) | MarkdownRenderProps | - |
| messageEditRender | 自定义消息编辑渲染 | (props: MessageContent) => React.ReactNode | - |
| mode | 对话模式 | 'bubble' \| 'noBubble' \| 'userBubble' | 'bubble' |
| onAnnotationClick | annotation 点击回调 | (annotation?: Annotation) => void | - |
| onChatsChange | 对话消息列表变更回调 | (chats?: Message[]) => void | - |
| onFileClick | 附件文件点击回调 | (file?: InputFile) => void | - |
| onHintClick | 点击提示词回调 | (hint: string) => void | - |
| onImageClick | 图片点击回调 | (image?: InputImage) => void | - |
| onMessageBadFeedback | 消息负向反馈回调 | (message?: Message) => void | - |
| onMessageCopy | 复制消息回调 | (message?: Message) => void | - |
| onMessageDelete | 删除消息回调 | (message?: Message) => void | - |
| onMessageEdit | 编辑消息回调 | (message?: Message) => void | - |
| onMessageGoodFeedback | 消息正向反馈回调 | (message?: Message) => void | - |
| onMessageReset | 重置消息回调 | (message?: Message) => void | - |
| onMessageShare | 分享消息回调 | (message?: Message) => void | - |
| onReferenceClick | 引用按钮点击回调 | (item?: Reference) => void | - |
| onSelect | 选择项变更回调 | (selectedIds: string[]) => void | - |
| dialogueRenderConfig | 自定义各区块渲染 | DialogueRenderConfig | - |
| renderDialogueContentItem | 按消息类型返回内容渲染映射 | DialogueContentItemRendererMap | - |
| renderHintBox | 自定义提示项渲染 | (props: { content: string; index: number; onHintClick: () => void }) => React.ReactNode | - |
| roleConfig | 角色配置（user/assistant/system 等元数据） | [RoleConfig](/zh-CN/ai/aiChatDialogue#RoleConfig) | 必填 |
| selecting | 是否开启选择模式 | boolean | false |
| showReset | 是否展示重置操作 | boolean | true |
| showReference | 是否在文字或者文件消息中展示可被引用图标，仅对用户消息生效 | boolean | false |
| style | 样式 | CSSProperties | - |

### RoleConfig
| 属性  | 说明   | 类型   | 默认值 |
|------|--------|-------|-------|
| user | 用户信息 | Metadata \| Map<string, Metadata> | - |
| assistant | 助手信息 | Metadata \| Map<string, Metadata> | - |
| system | 系统信息 | Metadata \| Map<string, Metadata> | - |

### MetaData
| 属性  | 说明   | 类型   | 默认值 |
|------|--------|-------|-------|
| name | 名称 | string | - |
| avatar | 头像 | string | - |
| color | 头像背景色，同 Avatar 组件的 color 参数, 支持 `amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow` | string | `grey` |

### Message
| 属性  | 说明   | 类型   | 默认值 |
|------|--------|-------|-------|
| role | 角色  | string | - |
| name | 名称  | string | - |
| id | 唯一标识  | string\| number | - |
| content | 消息内容 | string\| ContentItem[] | - |
| createdAt | 创建时间 | number | -|
| model | 模型名称 | string | -|
| status | 消息状态，可选值为 `queued` \| `in_progress` \| `incomplete` \| `completed` \| `failed`  \| `cancelled` |string | completed |

### Reference
| 属性  | 说明   | 类型   | 默认值 |
|------|--------|-------|-------|
| id | 唯一标识  | string \| number | - |
| type | 类型  | string | - |
| name | 名称  | string | - |
| url | 地址  | string | - |
| content | 文本内容  | string | - |


### Methods
| 方法  | 说明   |
|------|--------|
| selectAll | 全选所有消息 |
| deselectAll | 取消全选所有消息 |
| scrollToBottom(animation: boolean) | 滚动到最底部, animation 为 true，则有动画，反之无动画 |
| scrollToTop(animation: boolean) | 滚动到最顶部, animation 为 true，则有动画，反之无动画 |

### ContentItem
`ContentItem` 支持所有 OpenAI Response [InputItem](https://platform.openai.com/docs/api-reference/responses/create#responses-create-input) 和 [OutputItem](https://platform.openai.com/docs/api-reference/responses/object#responses/object-output) 类型，具体类型定义如下

```ts
type ContentItem = InputContentItem | OutputContentItem;

type InputContentItem = InputMessage | ItemReference;
type OutputContentItem = OutputMessage | MCPToolCall | Reasoning FileSearchToolCall | 
                        WebSearchToolCall | FunctionToolCall | CustomToolCall | ImageGenerationCall| CustomObject;

interface CommonContentItem {
    id?: string;
    type?: string;
    status?: string;
    role?: string
}

interface CustomObject {
    [key: string]: any
}

// input item
interface InputMessage extends CommonContentItem {
    content?: string | (InputText | InputImage | InputFile)[]
}

interface InputText extends CommonContentItem {
    text?: string
}

interface InputImage extends CommonContentItem {
    detail?: string;
    file_id?: string;
    image_url?: string
}

interface InputFile extends CommonContentItem {
    file_id?: string;
    file_data?: string;
    file_url?: string;
    filename?: string;
    size?: string;
    file_type?: string;
    fileInstance?: any
}

interface ItemReference extends CommonContentItem {
    file_id?: string
}


// output item
interface OutputMessage extends CommonContentItem {
    content?: (OutputText | Refusal)[]
}

interface OutputText {
    text?: string;
    type?: string;
    annotations?: Annotation[]
}

interface Refusal extends CommonContentItem {
    refusal?: string;
    type?: string
}

type Annotation = URLCitation | CustomObject;

interface URLCitation {
    end_index?: number;
    start_index?: number;
    title?: string;
    type?: string;
    url?: string
}

interface Reasoning extends CommonContentItem {
    summary?: {
        text?: string;
        type?: string
    }[];
    content?: {
        text?: string;
        type?: string
    }[]
}

interface FileSearchToolCallResult {
    attributes?: Map<string, string>;
    score?: number;
    file_id?: string;
    filename?: string;
    text?: string
}

interface FileSearchToolCall extends CommonContentItem {
    queries?: string[];
    results?: FileSearchToolCallResult[]
}

interface WebSearchToolCall extends CommonContentItem {
    action?: SearchAction | OpenPageAction | FindAction
}

interface SearchAction {
    type?: string;
    query?: string;
    sources?: { type: string; url: string }[]
}

interface OpenPageAction {
    type?: string;
    url?: string
}

interface FindAction {
    action?: string;
    type?: string;
    query?: string
}

interface FunctionToolCall extends CommonContentItem {
    call_id?: string;
    name?: string;
    arguments?: string
}

interface CustomToolCall extends CommonContentItem {
    call_id?: string;
    name?: string;
    input?: string
}

interface ImageGenerationCall extends CommonContentItem {
    result?: string
}

interface MCPToolCall extends CommonContentItem {
    arguments?: string;
    server_label?: string;
    name?: string;
    result?: string;
    output?: string
}

interface FileUploadToolCall extends CommonContentItem {
    result?: string
}

```

## 设计变量
<DesignToken/>