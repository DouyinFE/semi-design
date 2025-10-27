---
localeCode: zh-CN
order: 100
category: Ai
title: AIComponent AI组件
icon: doc-input
width: 60%
brief: 介绍 AI 应用场景下的组件
showNew: true
---

<!-- 1. 整体介绍：什么是semi AI 组件（理念），主要服务的场景？目前主要包括哪些组件？待上线的组件？ -->
Semi AI 组件是一套专为 AI 应用场景设计的创新组件库。面对 AI 正在成为产品主角的时代，传统的设计体系已难以支撑日益复杂的智能交互。Semi AI 组件以「人机智能协同」为核心理念，致力于让用户与 AI 系统协作更高效、可控、可感知、可信赖。主要服务场景涵盖但不限于：智能问答与助手、多模态输入与多轮对话等。Semi AI 组件库包含以下内容：AI 基础能力以及 AI 组件.

AI 基础能力包括：

- AI Token：新增加 AI 场景下的基础 token，构建了一套以紫蓝渐变系为核心的品牌色板
- AI Icon: 新增加 AI 场景下的 25 个 icon。
- Button/Tag/FloatButton：对基础组件新增 AI 模式，支持 AI 场景下的使用

AI 组件包括 AIChatInput、 AIDialogue，用于支持 AI 应用的输入、结果展示

在未来，我们将支持聊天应用场景的下 ChatBox， 支持更多信息展示以及负责内容编辑的 SideBar 等组件。


<!-- 2. Token & icon & button & tag & FloatButton 的简单展示 -->

### AI 基础能力

AI 基础能力包括 AI Token、AI Icon、Button/Tag/FloatButton 的 AI 模式。


对于 AI Token，我们构建了一套以紫蓝渐变系为核心的品牌色板，在基础色中，新增加了 AI purple 和 AI general 两个色相，20 个颜色的色盘，详见 [AI Token](/zh-CN/basic/tokens)。

对于 AI Icon，支持 Icon 场景下的单色、双色、及多色 Icon，共 25 个图标， 详见 [AI Icon](zh-CN/basic/icon)。

对于 Button/Tag/FloatButton 的 AI 模式，可通过组件的 Colorful 属性开启。详见 [AI Button](/zh-CN/basic/button#AI%20%E9%A3%8E%E6%A0%BC%20-%20%E5%A4%9A%E5%BD%A9%E6%8C%89%E9%92%AE), [AI Tag](/zh-CN/show/tag#AI%20%E9%A3%8E%E6%A0%BC%20-%20%E5%A4%9A%E5%BD%A9%E6%A0%87%E7%AD%BE), [AI floatButton](/zh-CN/basic/floatbutton#AI%20%E9%A3%8E%E6%A0%BC%20-%20%E5%A4%9A%E5%BD%A9%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE)。


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


