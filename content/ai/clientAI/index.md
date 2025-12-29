---
localeCode: zh-CN
order: 100
category: Ai
title: ClientAI 端侧AI
icon: doc-clientAI
width: 60%
brief: 在浏览器中直接运行 AI 大模型
showNew: true
---

## 简介

`ClientAI` 是一个基于 [MLC Engine](https://github.com/mlc-ai/mlc-llm) 实现的客户端 AI 聊天组件，支持在浏览器中直接运行 AI 模型，无需后端服务器，适合快速为网站接入 LLM。

### 典型应用场景

`ClientAI` 组件适用于以下典型应用场景：

- **网页知识问答**：基于网站内容构建本地化知识问答系统，用户可直接在页面内获取答案，无需跳转或调用外部服务
- **智能客服助手**：集成 Tool Calling 能力的智能客服系统，可调用业务接口查询订单、账户等信息，提供更精准的客户服务
- **搜索查询改写**：对用户输入的搜索关键词进行语义理解和改写优化，提升搜索结果的准确性和相关性
- **多文本提交校验**：对用户提交的多段文本内容进行一致性校验、格式检查和质量评估，确保内容符合业务规范
- **用户输入预审核**：实时对用户输入内容进行合规性检测和敏感信息识别，在提交前进行风险提示和内容过滤
- **复杂地址智能解析**：对用户输入的复杂邮寄地址进行自动分割，提取省市区、街道、门牌号等结构化信息，提升表单填写效率
- **离线 AI 应用**：需要完全离线运行的 AI 应用场景，不依赖网络连接即可提供智能交互能力
- **隐私敏感场景**：对数据隐私要求极高的应用场景，所有数据处理在本地完成，数据不上传到服务器

### 核心特性

- **完全本地运行**：模型在浏览器中运行，数据不上传到服务器，保护用户隐私
- **支持多种模型**：支持 Qwen、Hermes 等多种模型系列
- **Qwen 模型增强**：针对底层推理引擎不支持深度思考和 Tool Calling 的情况，为 Qwen 系列模型在 MLC Engine 下支持了深度思考 CoT 和 Tool Calling 功能
- **Worker 支持**：支持在 Web Worker 中运行，避免阻塞主线程
- **单例模式**：多个组件实例共享同一个模型，避免重复下载

### Qwen 模型实现说明

`ClientAI` 对 Qwen 系列模型进行了特殊优化和扩展：

1. **深度思考 CoT**：
   - 通过分析 Qwen 的训练过程和 tokenizer config，我们在 Qwen 的非 instruct 模型下实现了自由开关深度思考 CoT 的能力
   - Qwen3 模型支持 `<think>` 标签来显示思考过程
   - 组件会自动解析并渲染思考内容
   - 可以通过 `/no_think` 标签关闭思考过程，直接输出答案

2. **Tool Calling（函数调用）**：
   - 底层 MLC Engine 原生的 Function Calling 仅支持 Hermes 系列模型
   - 通过分析 Qwen 的训练过程和 tokenizer config，在 MLC Engine 下为 Qwen 系列模型扩展了 Tool Calling 支持

## 代码演示

### 如何引入

```jsx import
import { ClientAI } from '@douyinfe/semi-ui';
```

### 基本用法

`ClientAI` 组件提供了预配置的引擎配置，你需要根据你的网站用户所在地区选择合适的配置：

- **如果你的网站面向中国大陆用户**，请使用 `ClientAI.Qwen3_1_7B_EngineConfigCN`（使用 ModelScope + jsDelivr CDN）
- **如果你的网站面向国际用户**，请使用 `ClientAI.Qwen3_1_7B_EngineConfig`（使用 Hugging Face + GitHub）

`modelId` 可以从引擎配置中获取，如：`ClientAI.Qwen3_1_7B_EngineConfigCN.appConfig.model_list[0].model_id`。

以下示例适用于中国大陆用户：

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function Basic() {
    // 从引擎配置中获取 modelId
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfigCN;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            showDeepThinkButton={true}
            roleConfig={{
                user: {
                    name: '用户',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI 助手',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: '系统',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
        />
    );
}

render(<Basic />);
```

### 自部署模型文件

`ClientAI` 组件在第一次运行时需要联网自动从外部数据源下载模型文件：
- **国际用户**：从 Hugging Face 和 GitHub Raw 下载模型权重和 WASM 运行时文件
- **中国大陆用户**：从 ModelScope 和 jsDelivr CDN 下载模型权重和 WASM 运行时文件

下载的模型文件会缓存在浏览器的 IndexedDB 中，后续使用无需重复下载。

如果你不希望从外部数据源下载依赖，可以选择将模型文件下载到自己的 CDN 或 OSS 上，然后修改配置指向自己的地址。这样可以避免依赖第三方服务的可用性，并获得更好的下载速度和稳定性。

**步骤 1：下载模型文件**

你需要下载以下两类文件：
- **模型权重文件**：从 [Hugging Face](https://huggingface.co/mlc-ai/Qwen3-1.7B-q4f32_1-MLC) 或 [ModelScope](https://modelscope.cn/models/mlc-ai/Qwen3-1.7B-q4f32_1-MLC) 下载完整的模型仓库
- **WASM 文件**：从 [GitHub](https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_80/Qwen3-1.7B-q4f32_1-ctx4k_cs1k-webgpu.wasm) 下载 WebGPU 运行时

**步骤 2：部署到你的 CDN/OSS**

将下载的文件部署到你的云存储服务，获取访问 URL。

**步骤 3：配置自定义 URL**

```jsx
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function CustomModel() {
    // 自部署配置示例
    const customEngineConfig = {
        appConfig: {
            useIndexedDBCache: true,
            model_list: [
                {
                    // 替换为你自己的模型权重 URL
                    model: 'https://your-cdn.com/models/Qwen3-1.7B-q4f32_1-MLC',
                    model_id: 'Qwen3-1.7B-q4f32_1-MLC',
                    // 替换为你自己的 WASM 文件 URL
                    model_lib: 'https://your-cdn.com/wasm/Qwen3-1.7B-q4f32_1-ctx4k_cs1k-webgpu.wasm',
                    vram_required_MB: 2635.44,
                    low_resource_required: true,
                    // 可选：覆盖模型默认配置
                    overrides: {
                        // 上下文窗口大小，Qwen3-1.7B 最大支持 40960 tokens
                        context_window_size: 40960,
                    },
                },
            ],
        },
        initProgressCallback: (progress) => {
            console.log('Model loading progress:', progress);
        },
    };

    // 从配置中获取 modelId
    const modelId = customEngineConfig.appConfig.model_list[0].model_id;

    return (
        <ClientAI
            modelId={modelId}
            engineConfig={customEngineConfig}
            showDeepThinkButton={true}
            roleConfig={{
                user: {
                    name: '用户',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI 助手',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: '系统',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
        />
    );
}
```

**配置说明**：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `model` | 模型权重文件的 URL | - |
| `model_id` | 模型唯一标识符 | - |
| `model_lib` | WebGPU WASM 运行时文件的 URL | - |
| `low_resource_required` | 是否为低资源模式 | `false` |
| `overrides.context_window_size` | 上下文窗口大小（tokens），Qwen3-1.7B 最大支持 40960 | 模型默认值 |

### Tool Calling (函数调用)

`ClientAI` 支持 Tool Calling 功能，可以让 AI 调用你定义的工具函数。

#### 技术背景

底层 MLC Engine 原生的 Function Calling 功能**仅支持 Hermes 系列模型**，不支持 Qwen 等其他模型。

我们通过分析 Qwen 的训练过程和 tokenizer config，在 MLC Engine 下为 **Qwen 系列模型扩展了 Tool Calling 支持**。这使得轻量级的 Qwen 模型（如 1.7B）也能在浏览器端实现工具调用能力。

**使用提示**：
- 尝试问 AI "北京今天天气怎么样？"
- 尝试问 AI "帮我计算 123 * 456"
- 尝试问 AI "现在几点了？"

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI, Toast } from '@douyinfe/semi-ui';

function ToolCallingDemo() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfigCN;
    const modelId = engineConfig.appConfig.model_list[0].model_id;

    // 定义可用的工具
    const tools = [
        {
            type: 'function',
            function: {
                name: 'get_weather',
                description: '获取指定城市的当前天气信息',
                parameters: {
                    type: 'object',
                    properties: {
                        city: {
                            type: 'string',
                            description: '城市名称，如：北京、上海、深圳'
                        }
                    },
                    required: ['city']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'calculate',
                description: '执行数学计算',
                parameters: {
                    type: 'object',
                    properties: {
                        expression: {
                            type: 'string',
                            description: '数学表达式，如：2+2, 10*5, 100/4'
                        }
                    },
                    required: ['expression']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'get_current_time',
                description: '获取当前时间',
                parameters: {
                    type: 'object',
                    properties: {},
                    required: []
                }
            }
        }
    ];

    // 处理 Tool Call
    // 组件会自动调用此函数，等待返回结果后自动发送结果继续对话
    const handleToolCall = async (toolCalls, rawOutput) => {
        console.log('Received tool calls:', toolCalls);
        
        // 模拟天气数据
        const weatherData = {
            '北京': { temp: '5°C', weather: '晴', humidity: '30%' },
            '上海': { temp: '12°C', weather: '多云', humidity: '65%' },
            '深圳': { temp: '22°C', weather: '晴', humidity: '70%' },
            '广州': { temp: '20°C', weather: '阴', humidity: '75%' },
        };

        // 执行所有 tool calls
        return toolCalls.map((toolCall) => {
            const { call_id, name, arguments: argsStr } = toolCall;
            let result = '';
            
            try {
                const args = JSON.parse(argsStr || '{}');
                
                if (name === 'get_weather') {
                    const city = args.city;
                    const data = weatherData[city];
                    if (data) {
                        result = JSON.stringify({
                            city,
                            temperature: data.temp,
                            weather: data.weather,
                            humidity: data.humidity
                        });
                    } else {
                        result = JSON.stringify({ error: '未找到城市 ' + city + ' 的天气数据' });
                    }
                } else if (name === 'calculate') {
                    const expression = args.expression.replace(/[^0-9+\-*/().]/g, '');
                    const calcResult = Function('"use strict"; return (' + expression + ')')();
                    result = JSON.stringify({ expression: args.expression, result: calcResult });
                } else if (name === 'get_current_time') {
                    const now = new Date();
                    result = JSON.stringify({
                        time: now.toLocaleTimeString('zh-CN'),
                        date: now.toLocaleDateString('zh-CN'),
                        timestamp: now.getTime()
                    });
                } else {
                    result = JSON.stringify({ error: '未知的工具: ' + name });
                }

                Toast.success('工具 ' + name + ' 执行成功');
                return { call_id, name, arguments: argsStr, result, status: 'success' };
            } catch (e) {
                Toast.error('工具 ' + name + ' 执行失败');
                return { call_id, name, arguments: argsStr, result: JSON.stringify({ error: e.message }), status: 'error' };
            }
        });
    };

    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            showDeepThinkButton={true}
            roleConfig={{
                user: {
                    name: '用户',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI 助手',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: '系统',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
            chatOpts={{ tools }}
            systemPrompt={`你是一个有用的 AI 助手，具备调用工具的能力。当用户需要以下帮助时，你必须主动调用相应的工具：

1. 查询天气：当用户询问任何城市的天气情况时，调用 get_weather 工具
2. 数学计算：当用户需要进行数学运算或计算时，调用 calculate 工具
3. 获取时间：当用户询问当前时间、日期或时间戳时，调用 get_current_time 工具

重要提示：
- 不要猜测或编造数据，必须通过调用工具获取准确信息
- 调用工具后，等待工具返回结果，然后基于结果回答用户
- 如果工具调用失败，如实告知用户并建议替代方案`}
            handleToolCall={handleToolCall}
            onError={(error) => Toast.error(error.message)}
        />
    );
}

render(<ToolCallingDemo />);
```

**注意事项**：
1. Tool Calling 目前仅支持 Qwen 系列模型
2. 使用 `handleToolCall` prop，组件会自动处理工具调用和结果发送，无需手动调用 `sendToolResults`
3. `handleToolCall` 返回 `Promise<ToolCallResult[]>` 或 `ToolCallResult[]`，组件会自动发送结果继续对话
4. 工具定义遵循 OpenAI Function Calling 的格式规范

### 深度思考 CoT

`ClientAI` 支持深度思考 CoT 开关，当开启时 AI 会进行更深入的推理思考（显示思考过程），当关闭时会添加 `/no_think` 标签让模型跳过思考过程直接回答。

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function DeepThinkDemo() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfigCN;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            showDeepThinkButton={true}
            defaultEnableDeepThink={true}
            roleConfig={{
                user: {
                    name: '用户',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI 助手',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: '系统',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
        />
    );
}

render(<DeepThinkDemo />);
```

**使用说明**：
- `showDeepThinkButton` 设为 `true` 时，输入框左下角会显示"深度思考 CoT"按钮
- 点击按钮可以切换深度思考 CoT 的开启/关闭状态
- 开启时：AI 会输出 `<think>...</think>` 标签包裹的思考过程
- 关闭时：消息末尾会自动添加 `/no_think` 标签，让 Qwen3 模型跳过思考

### 自定义渲染

如果你需要完全自定义 UI（使用自己的消息列表和输入框样式），可以使用 `render` prop。传入 `render` 函数后，组件将不再渲染默认的 `AIChatDialogue` 和 `AIChatInput`，而是调用你的渲染函数。

你也可以选择不渲染任何 UI，直接通过 `render` prop 返回 `null`，然后通过 `sendMessage` 方法调用 AI 能力。这种方式适用于搜索查询改写、文本预审核等用户对 AI 无感知、不需要交互的场景。

```jsx live=true dir="column" noInline=true
import React, { useState, useRef } from 'react';
import { ClientAI, Button, Input, Spin } from '@douyinfe/semi-ui';

// 自定义渲染的内容组件
function CustomContent(props) {
    const { 
        loading, 
        error, 
        messages, 
        isGenerating, 
        enableDeepThink,
        sendMessage, 
        stopGenerate, 
        clearMessages,
        setEnableDeepThink
    } = props;

    const [inputValue, setInputValue] = useState('');

    if (loading) {
        return (
            <div style={{ padding: 20, textAlign: 'center' }}>
                <Spin size="large" />
                <p>正在加载模型...</p>
            </div>
        );
    }

    if (error) {
        return <div style={{ padding: 20, color: 'red' }}>错误: {error}</div>;
    }

    // 渲染消息内容的辅助函数
    const renderMessageContent = (content) => {
        if (typeof content === 'string') {
            return content;
        }
        if (Array.isArray(content)) {
            return content.map((item, i) => {
                // 处理 chatInputToMessage 返回的嵌套结构（用户消息）
                if (item.type === 'message' && Array.isArray(item.content)) {
                    return item.content.map((subItem, j) => (
                        <span key={`${i}-${j}`}>{subItem.text || ''}</span>
                    ));
                }
                // 处理深度思考 CoT 内容（reasoning 类型）
                if (item.type === 'reasoning' && Array.isArray(item.summary)) {
                    const thinkText = item.summary.map(s => s.text).join('');
                    return (
                        <div key={i} style={{ 
                            color: 'var(--semi-color-text-2)', 
                            fontStyle: 'italic',
                            padding: '8px',
                            marginBottom: '8px',
                            background: 'var(--semi-color-bg-0)',
                            borderRadius: '4px',
                            borderLeft: '3px solid var(--semi-color-primary)'
                        }}>
                            💭 {thinkText}
                            {item.status === 'in_progress' && <span> ...</span>}
                        </div>
                    );
                }
                // 处理普通文本
                return <span key={i}>{item.text || ''}</span>;
            });
        }
        return JSON.stringify(content);
    };

    const handleSend = () => {
        if (inputValue.trim()) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div style={{ padding: 20, border: '1px solid var(--semi-color-border)', borderRadius: 8 }}>
            {/* 自定义消息列表 */}
            <div style={{ 
                height: 300, 
                overflowY: 'auto', 
                marginBottom: 12, 
                padding: 12, 
                background: 'var(--semi-color-bg-1)',
                borderRadius: 4
            }}>
                {messages.length === 0 ? (
                    <div style={{ color: 'var(--semi-color-text-2)', textAlign: 'center' }}>
                        暂无消息，开始对话吧！
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            style={{ 
                                marginBottom: 12,
                                padding: 8,
                                borderRadius: 4,
                                background: msg.role === 'user' 
                                    ? 'var(--semi-color-primary-light-default)' 
                                    : 'var(--semi-color-bg-2)',
                                textAlign: msg.role === 'user' ? 'right' : 'left'
                            }}
                        >
                            <div style={{ fontSize: 12, color: 'var(--semi-color-text-2)', marginBottom: 4 }}>
                                {msg.role === 'user' ? '用户' : 'AI'}
                            </div>
                                <div style={{ whiteSpace: 'pre-wrap' }}>
                                    {renderMessageContent(msg.content)}
                                    {msg.status === 'in_progress' && <span>|</span>}
                                </div>
                        </div>
                    ))
                )}
            </div>

            {/* 自定义输入区域 */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Input 
                    value={inputValue}
                    onChange={setInputValue}
                    onEnterPress={handleSend}
                    placeholder="输入消息..."
                    disabled={isGenerating}
                    style={{ flex: 1 }}
                />
                {isGenerating ? (
                    <Button onClick={stopGenerate} type="danger">停止</Button>
                ) : (
                    <Button onClick={handleSend} theme="solid" disabled={!inputValue.trim()}>发送</Button>
                )}
                <Button onClick={clearMessages}>清空</Button>
                <Button 
                    onClick={() => setEnableDeepThink(!enableDeepThink)}
                    theme={enableDeepThink ? 'solid' : 'light'}
                >
                    {enableDeepThink ? '🧠 深度思考 CoT' : '⚡ 快速'}
                </Button>
            </div>
        </div>
    );
}

function CustomRenderDemo() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfigCN;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            render={(props) => <CustomContent {...props} />}
        />
    );
}

render(<CustomRenderDemo />);
```

### 使用 Qwen3-4B 模型

`ClientAI` 还提供了 Qwen3-4B 模型的配置，相比 1.7B 模型具有更强的能力。适合对模型能力要求更高的场景，特别是需要更多世界知识的场景。

```jsx
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function Qwen4B() {
    // 使用 Qwen3-4B 模型配置（中国大陆用户）
    const engineConfig = ClientAI.Qwen3_4B_EngineConfigCN;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            showDeepThinkButton={true}
            roleConfig={{
                user: {
                    name: '用户',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI 助手',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: '系统',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
        />
    );
}
```

**模型选择建议**：
- **Qwen3-1.7B**：轻量级模型，适合大多数场景
- **Qwen3-4B**：能力更强的模型，适合对模型能力要求更高的场景，特别是需要更多世界知识的场景

**ClientAIRenderProps 参数说明**：

| 属性 | 说明 | 类型 |
|------|------|------|
| loading | 是否正在加载模型 | `boolean` |
| error | 错误信息 | `string \| null` |
| messages | 消息列表 | `Message[]` |
| isGenerating | 是否正在生成回复 | `boolean` |
| enableDeepThink | 是否启用深度思考 CoT | `boolean` |
| sendMessage | 发送消息 | `(text: string) => Promise<void>` |
| stopGenerate | 停止生成 | `() => void` |
| clearMessages | 清空消息 | `() => void` |
| setEnableDeepThink | 设置深度思考 CoT 开关 | `(enable: boolean) => void` |
| sendToolResults | 发送 Tool 执行结果 | `(results: ToolCallResult[]) => Promise<void>` |

### 使用 Worker

`ClientAI` 默认在主线程运行模型。如果你不提供 `worker.url`，模型会在主线程运行。在主线程运行模型可能会阻塞 UI，建议切换到 Worker 模式以获得更好的性能。

要切换到 Worker 模式以避免阻塞主线程，需要完成以下两个步骤：

**步骤 1：创建 Worker 文件**

创建一个 Worker 文件（例如 `worker.ts` 或 `worker.js`）：

```typescript
// worker.ts
import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

const handler = new WebWorkerMLCEngineHandler();

// 处理来自主线程的消息
self.onmessage = (msg: MessageEvent) => {
    handler.onmessage(msg);
};
```

**Worker 文件说明**：
- `WebWorkerMLCEngineHandler` 负责处理与主线程的通信，并处理传入的请求
- Worker 线程会接收消息并使用隐藏的引擎处理实际计算，然后通过消息将结果返回给主线程
- Worker 文件需要使用 ES Module 格式（`type: 'module'`）
- MLC Engine 相关依赖已包含在组件库中，无需额外安装

**步骤 2：在组件中配置 Worker URL**

在组件中，通过 `worker` prop 传入 Worker 文件的 URL：

```jsx
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function WithWorker() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfigCN;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            worker={{
                url: new URL('./worker.ts', import.meta.url).href,
                enabled: true,
            }}
            showDeepThinkButton={true}
            roleConfig={{
                user: {
                    name: '用户',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI 助手',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: '系统',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
        />
    );
}
```

**配置说明**：
- `worker.url`：**必填**，Worker 文件的 URL。必须提供此参数才会切换到 Worker 模式
- `worker.enabled`：是否启用 Worker，默认为 `true`。设置为 `false` 时会在主线程运行
- **重要**：只有同时提供 `worker.url` 且 `worker.enabled !== false` 时才会使用 Worker 模式，否则默认在主线程运行

**使用打包工具**：

**Vite**：
```typescript
worker: {
    url: new URL('./worker.ts', import.meta.url).href,
    enabled: true,
}
```

**Webpack**：
```typescript
// 需要安装 worker-loader 或使用 Webpack 5 的 Worker 支持
import Worker from './worker.ts?worker';

worker: {
    url: Worker,
    enabled: true,
}
```

**注意事项**：
- Worker 文件需要从 `@mlc-ai/web-llm` 导入 `WebWorkerMLCEngineHandler`
- 确保打包工具正确配置了 Worker 支持
- Worker 文件必须使用 ES Module 格式（`type: 'module'`）

### 修改用户输入

`onUserMessage` 回调可以在用户消息发送前修改输入内容，修改后的内容将同时用于显示和发送给AI：

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function OnUserMessageExample() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfigCN;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            onUserMessage={(userContent, messages) => {
                // 自动添加前缀
                return `请用简洁的语言回答：${userContent}`;
            }}
        />
    );
}

render(<OnUserMessageExample />);
```

### 拦截AI调用

`beforeAIInput` 回调可以在AI调用前返回自定义回复，如果返回非空字符串，将跳过AI调用直接使用该回复：

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function BeforeAIInputExample() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfigCN;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            beforeAIInput={async (messages) => {
                const lastMessage = messages[messages.length - 1];
                // 如果用户问的是"你好"，直接返回固定回复
                if (lastMessage && lastMessage.content && lastMessage.content.includes('你好')) {
                    return '你好！我是AI助手，很高兴为您服务。';
                }
                // 返回空字符串，正常调用AI
                return '';
            }}
        />
    );
}

render(<BeforeAIInputExample />);
```

### 修改AI回复

`afterAIInput` 回调可以在AI回复后修改回复内容：

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function AfterAIInputExample() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfigCN;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            afterAIInput={(aiContent, messages) => {
                // 在AI回复前添加提示
                return `[AI回复] ${aiContent}`;
            }}
        />
    );
}

render(<AfterAIInputExample />);
```

### 控制流式显示

`stream` 参数控制是否流式显示AI回复。当设置为 `false` 时，会等待流式返回完毕后才一次性显示：

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function StreamExample() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfigCN;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            stream={false}
        />
    );
}

render(<StreamExample />);
```

### 设置默认对话消息

`defaultMessages` 用于设置初始的对话历史，组件加载时会显示这些消息：

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function DefaultMessagesExample() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfigCN;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    const defaultMessages = [
        {
            id: 'msg-1',
            role: 'user',
            content: '你好，请介绍一下你自己',
            createdAt: Date.now() - 60000,
            status: 'completed',
        },
        {
            id: 'msg-2',
            role: 'assistant',
            content: '你好！我是AI助手，很高兴为您服务。我可以帮助您解答问题、提供信息和建议。',
            createdAt: Date.now() - 30000,
            status: 'completed',
        },
    ];
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            defaultMessages={defaultMessages}
        />
    );
}

render(<DefaultMessagesExample />);
```

## API 参考

### ClientAI

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| afterAIInput | AI回复后的回调，可以修改AI的回复内容 | `(aiContent: string, messages: Message[]) => string \| Promise<string>` | - |
| beforeAIInput | AI回复前的回调，可以拦截AI调用并返回自定义回复。返回非空字符串将作为AI回复，返回空字符串则正常调用AI | `(messages: Message[]) => string \| Promise<string>` | - |
| chatOpts | 聊天选项，可配置 tools 等。覆盖模型默认配置 | `ChatOptions \| ChatOptions[]` | - |
| className | 自定义类名 | `string` | - |
| defaultEnableDeepThink | 深度思考 CoT 默认状态 | `boolean` | `true` |
| defaultMessages | 默认对话消息，用于设置初始的对话历史 | `Message[]` | - |
| dialogueProps | AIChatDialogue 的透传 props | `Partial<AIChatDialogueProps>` | - |
| engineConfig | 引擎配置，**必填**。可使用 `ClientAI.Qwen3_1_7B_EngineConfig` / `ClientAI.Qwen3_1_7B_EngineConfigCN`（1.7B 模型）或 `ClientAI.Qwen3_4B_EngineConfig` / `ClientAI.Qwen3_4B_EngineConfigCN`（4B 模型）。也可选择自部署模型文件 | `MLCEngineConfig` | - |
| inputProps | AIChatInput 的透传 props | `Partial<AIChatInputProps>` | - |
| modelId | 模型 ID，**必填**。可从引擎配置中获取，如：`engineConfig.appConfig.model_list[0].model_id` | `string \| string[]` | - |
| handleToolCall | Tool 调用处理函数，组件会自动调用此函数并等待返回结果，然后自动发送结果继续对话 | `(toolCalls: ToolCall[], rawOutput: string) => Promise<ToolCallResult[]> \| ToolCallResult[]` | - |
| onError | 错误回调 | `(error: Error) => void` | - |
| onToolCall | Tool 调用回调，当 AI 输出包含 tool_call 时触发（仅用于通知，需要手动调用 sendToolResults） | `(toolCalls: ToolCall[], rawOutput: string) => void` | - |
| onUserMessage | 用户消息发送前的回调，可以修改用户输入内容。返回的字符串将同时用于显示和发送给AI | `(userContent: string, messages: Message[]) => string` | - |
| render | 自定义渲染函数，传入后将完全由用户控制 UI 渲染 | `(props: ClientAIRenderProps) => ReactNode` | - |
| roleConfig | 角色配置，用于配置用户、助手、系统等角色的名称和头像等信息 | `RoleConfig` | `{ user: { name: '用户' }, assistant: { name: 'AI 助手' }, system: { name: '系统' } }`（默认不包含 avatar） |
| showDeepThinkButton | 是否显示深度思考 CoT 按钮 | `boolean` | `false` |
| stream | 控制是否流式显示AI回复。当为 `false` 时，等待流式返回完毕后才一次性显示 | `boolean` | `true` |
| style | 自定义样式 | `React.CSSProperties` | - |
| systemPrompt | 系统提示词 | `string` | 根据浏览器语言动态设置：中文环境为 `'你是一个有用的 AI 助手。使用中文回复用户。'`，其他语言为 `'You are a helpful AI assistant. Reply to users in English.'` |
| worker | Worker 配置 | `{ url?: string; enabled?: boolean }` | `{ enabled: true }`（默认在主线程运行，需要提供 `url` 才会使用 Worker） |

### 方法

通过 `ref` 可以调用以下方法：

| 方法 | 说明 | 参数 |
|------|------|------|
| sendToolResults | 发送 Tool 执行结果，让 AI 继续对话（通常不需要手动调用，推荐使用 `handleToolCall` prop） | `(toolResults: ToolCallResult[]) => Promise<void>` |

### ToolCall 类型

```typescript
interface ToolCall {
    type: 'function_call';
    call_id: string;
    name: string;
    arguments: string;
    status: string;
}
```

### ToolCallResult 类型

```typescript
interface ToolCallResult {
    call_id: string;
    name: string;
    arguments: string;
    result: string;
    status: 'success' | 'error';
}
```

### 静态属性

`ClientAI` 组件提供了以下静态属性，你需要从中获取引擎配置并传入：

**Qwen3-1.7B 模型**（轻量级）：
- `ClientAI.Qwen3_1_7B_EngineConfig` - 国际用户引擎配置（使用 Hugging Face + GitHub Raw）
- `ClientAI.Qwen3_1_7B_EngineConfigCN` - 中国大陆用户引擎配置（使用 ModelScope + jsDelivr CDN）

**Qwen3-4B 模型**（能力更强）：
- `ClientAI.Qwen3_4B_EngineConfig` - 国际用户引擎配置（使用 Hugging Face + GitHub Raw）
- `ClientAI.Qwen3_4B_EngineConfigCN` - 中国大陆用户引擎配置（使用 ModelScope + jsDelivr CDN）

> 💡 **提示**：你可以选择将模型文件下载到自己的 CDN 或 OSS 上，然后自定义配置指向自己的地址。参考 [自部署模型文件](#自部署模型文件) 章节。

### 类型说明

`ClientAI` 组件使用的类型（如 `MLCEngineConfig`、`ChatOptions`、`AppConfig` 等）都从 `@douyinfe/semi-foundation/clientAI/interface` 重新导出。这些类型与 MLC Engine SDK 保持一致。你可以查阅 [MLC Engine 文档](https://github.com/mlc-ai/mlc-llm) 了解这些类型的详细说明。

你可以从 `@douyinfe/semi-foundation/clientAI/interface` 导入这些类型：

```typescript
import type {
    MLCEngineConfig,
    ChatOptions,
    AppConfig,
    WebWorkerMLCEngine,
    // ... 其他类型
} from '@douyinfe/semi-foundation/clientAI/interface';
```

## 注意事项

1. **Worker 文件实现**：使用 Worker 模式时，需要创建 Worker 文件。Worker 文件需要导入 `WebWorkerMLCEngineHandler` 并处理消息。参考上面的 [使用 Worker](#使用-worker) 部分了解详细实现。

2. **模型加载时间**：首次加载模型可能需要较长时间，建议显示加载状态给用户。组件会自动显示加载进度条。

3. **浏览器兼容性**：MLC Engine 需要浏览器支持 WebGPU，请确保目标浏览器支持该特性。

4. **内存使用**：运行 AI 模型会消耗较多内存，建议在内存充足的设备上使用。

5. **模型文件大小**：模型文件可能较大，首次下载需要时间，建议使用 IndexedDB 缓存。

6. **类型导入**：所有 MLC Engine 相关的类型都可以从 `@douyinfe/semi-foundation/clientAI/interface` 导入，这些类型与 MLC Engine SDK 保持一致，方便查阅文档。

7. **Tool Calling 支持**：底层 MLC Engine 原生仅支持 Hermes 系列模型的 Function Calling。我们通过分析 Qwen 的训练过程和 tokenizer config，在 MLC Engine 下扩展支持了 Qwen 系列模型。

8. **支持 Tool Calling 的模型**：
   - ✅ Qwen 系列模型（Qwen3-0.6B、Qwen3-1.7B、Qwen3-4B 等）
   - ✅ Hermes 系列模型（MLC 原生支持）

