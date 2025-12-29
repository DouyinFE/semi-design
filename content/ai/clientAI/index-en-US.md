---
localeCode: en-US
order: 100
category: Ai
title: Client Side AI
icon: doc-clientAI
width: 60%
brief: Running AI in browser
showNew: true
---

## Introduction

`ClientAI` is a client-side AI chat component implemented based on [MLC Engine](https://github.com/mlc-ai/mlc-llm), supporting running AI models directly in the browser without a backend server, suitable for quickly integrating LLM into websites.

### Typical Use Cases

The `ClientAI` component is suitable for the following typical use cases:

- **Web-based Knowledge Q&A**: Build localized knowledge Q&A systems based on website content, allowing users to get answers directly within the page without redirecting or calling external services
- **Intelligent Customer Service**: Intelligent customer service systems integrated with Tool Calling capabilities, capable of calling business APIs to query orders, accounts, and other information for more accurate customer service
- **Search Query Rewriting**: Perform semantic understanding and rewriting optimization of user-entered search keywords to improve the accuracy and relevance of search results
- **Multi-text Submission Validation**: Perform consistency validation, format checking, and quality assessment on multiple text segments submitted by users to ensure content complies with business standards
- **User Input Pre-screening**: Real-time compliance detection and sensitive information identification of user input content, providing risk warnings and content filtering before submission
- **Complex Address Parsing**: Automatically segment complex mailing addresses entered by users, extracting structured information such as province, city, district, street, and house number to improve form filling efficiency
- **Offline AI Applications**: AI application scenarios that require completely offline operation, providing intelligent interaction capabilities without relying on network connections
- **Privacy-sensitive Scenarios**: Application scenarios with extremely high data privacy requirements, where all data processing is completed locally and data is not uploaded to servers

### Core Features

- **Fully Local Execution**: Models run in the browser, data is not uploaded to servers, protecting user privacy
- **Multiple Model Support**: Supports Qwen, Hermes, and other model series
- **Qwen Model Enhancements**: Since the underlying inference engine does not support CoT and Tool Calling for Qwen models, we implemented CoT and Tool Calling support for Qwen series models under MLC Engine
- **Worker Support**: Supports running in Web Workers to avoid blocking the main thread
- **Singleton Pattern**: Multiple component instances share the same model, avoiding duplicate downloads

### Qwen Model Implementation

`ClientAI` provides special optimizations and extensions for Qwen series models:

1. **CoT**:
   - By analyzing Qwen's training process and tokenizer config, we implemented the ability to freely toggle CoT in Qwen's non-instruct models
   - Qwen3 models support `<think>` tags to display thinking processes
   - The component automatically parses and renders thinking content
   - You can disable thinking by adding `/no_think` tag to get direct answers

2. **Tool Calling (Function Calling)**:
   - The underlying MLC Engine's native Function Calling only supports Hermes series models
   - By analyzing Qwen's training process and tokenizer config, we extended Tool Calling support for Qwen series models under MLC Engine

## Demos

### How to Import

```jsx import
import { ClientAI } from '@douyinfe/semi-ui';
```

### Basic Usage

The `ClientAI` component provides pre-configured engine configurations. You need to choose the appropriate configuration based on your website's target users:

- **If your website targets international users**, use `ClientAI.Qwen3_1_7B_EngineConfig` (using Hugging Face + GitHub)
- **If your website targets users in China**, use `ClientAI.Qwen3_1_7B_EngineConfigCN` (using ModelScope + jsDelivr CDN)

`modelId` can be obtained from the engine configuration, e.g.: `ClientAI.Qwen3_1_7B_EngineConfig.appConfig.model_list[0].model_id`.

The following example is for international users:

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function Basic() {
    // Get modelId from engine configuration
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfig;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            roleConfig={{
                user: {
                    name: 'User',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI Assistant',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: 'System',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
        />
    );
}

render(<Basic />);
```

### Self-Hosting Model Files

The `ClientAI` component automatically downloads model files from external data sources on first run:
- **International users**: Downloads model weights and WASM runtime files from Hugging Face and GitHub Raw
- **China users**: Downloads model weights and WASM runtime files from ModelScope and jsDelivr CDN

Downloaded model files are cached in the browser's IndexedDB, so subsequent uses don't require re-downloading.

If you don't want to download dependencies from external data sources, you can choose to download model files to your own CDN or cloud storage, then configure custom URLs pointing to your own addresses. This avoids relying on third-party service availability and provides better download speeds and stability.

**Step 1: Download Model Files**

You need to download the following files:
- **Model weights**: Download the complete model repository from [Hugging Face](https://huggingface.co/mlc-ai/Qwen3-1.7B-q4f32_1-MLC) or [ModelScope](https://modelscope.cn/models/mlc-ai/Qwen3-1.7B-q4f32_1-MLC)
- **WASM file**: Download the WebGPU runtime from [GitHub](https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_80/Qwen3-1.7B-q4f32_1-ctx4k_cs1k-webgpu.wasm)

**Step 2: Deploy to Your CDN/Cloud Storage**

Deploy the downloaded files to your cloud storage service and get the access URLs.

**Step 3: Configure Custom URLs**

```jsx
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function CustomModel() {
    // Self-hosting configuration example
    const customEngineConfig = {
        appConfig: {
            useIndexedDBCache: true,
            model_list: [
                {
                    // Replace with your own model weights URL
                    model: 'https://your-cdn.com/models/Qwen3-1.7B-q4f32_1-MLC',
                    model_id: 'Qwen3-1.7B-q4f32_1-MLC',
                    // Replace with your own WASM file URL
                    model_lib: 'https://your-cdn.com/wasm/Qwen3-1.7B-q4f32_1-ctx4k_cs1k-webgpu.wasm',
                    vram_required_MB: 2635.44,
                    low_resource_required: true,
                    // Optional: Override model default configuration
                    overrides: {
                        // Context window size, Qwen3-1.7B supports up to 40960 tokens
                        context_window_size: 40960,
                    },
                },
            ],
        },
        initProgressCallback: (progress) => {
            console.log('Model loading progress:', progress);
        },
    };

    // Get modelId from configuration
    const modelId = customEngineConfig.appConfig.model_list[0].model_id;

    return (
        <ClientAI
            modelId={modelId}
            engineConfig={customEngineConfig}
            roleConfig={{
                user: {
                    name: 'User',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI Assistant',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: 'System',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
        />
    );
}
```

**Configuration Reference**:

| Property | Description | Default |
|----------|-------------|---------|
| `model` | URL of the model weights file | - |
| `model_id` | Unique identifier for the model | - |
| `model_lib` | URL of the WebGPU WASM runtime file | - |
| `low_resource_required` | Whether to use low resource mode | `false` |
| `overrides.context_window_size` | Context window size (tokens), Qwen3-1.7B supports up to 40960 | Model default |

### Error Handling

You can handle errors through the `onError` callback:

```jsx live=true dir="column" noInline=true
import React, { useState } from 'react';
import { ClientAI, Toast } from '@douyinfe/semi-ui';

function WithErrorHandler() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfig;
    const modelId = engineConfig.appConfig.model_list[0].model_id;

    const handleError = (error) => {
        Toast.error(`Error: ${error.message}`);
        console.error('ClientAI error:', error);
    };

    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            roleConfig={{
                user: {
                    name: 'User',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI Assistant',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: 'System',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
            onError={handleError}
        />
    );
}

render(<WithErrorHandler />);
```

### Tool Calling (Function Calling)

`ClientAI` supports Tool Calling functionality, allowing AI to call user-defined tool functions.

#### Technical Background

The underlying MLC Engine's native Function Calling feature **only supports Hermes series models**, and does not support Qwen and other models.

By analyzing Qwen's training process and tokenizer config, we extended **Tool Calling support for Qwen series models** under MLC Engine. This enables lightweight Qwen models (such as 1.7B) to achieve tool calling capabilities in the browser.

**Usage Tips**:
- Try asking AI "What's the weather like in Beijing today?"
- Try asking AI "Calculate 123 * 456 for me"
- Try asking AI "What time is it now?"

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI, Toast } from '@douyinfe/semi-ui';

function ToolCallingDemo() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfig;
    const modelId = engineConfig.appConfig.model_list[0].model_id;

    // Define available tools
    const tools = [
        {
            type: 'function',
            function: {
                name: 'get_weather',
                description: 'Get current weather information for a specified city',
                parameters: {
                    type: 'object',
                    properties: {
                        city: {
                            type: 'string',
                            description: 'City name, e.g.: Beijing, Shanghai, Shenzhen'
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
                description: 'Perform mathematical calculations',
                parameters: {
                    type: 'object',
                    properties: {
                        expression: {
                            type: 'string',
                            description: 'Mathematical expression, e.g.: 2+2, 10*5, 100/4'
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
                description: 'Get current time',
                parameters: {
                    type: 'object',
                    properties: {},
                    required: []
                }
            }
        }
    ];

    // Handle Tool Call
    // Component will automatically call this function, wait for results, and automatically send results to continue conversation
    const handleToolCall = async (toolCalls, rawOutput) => {
        console.log('Received tool calls:', toolCalls);
        
        // Mock weather data
        const weatherData = {
            'Beijing': { temp: '5°C', weather: 'Sunny', humidity: '30%' },
            'Shanghai': { temp: '12°C', weather: 'Cloudy', humidity: '65%' },
            'Shenzhen': { temp: '22°C', weather: 'Sunny', humidity: '70%' },
            'Guangzhou': { temp: '20°C', weather: 'Overcast', humidity: '75%' },
        };

        // Execute all tool calls
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
                        result = JSON.stringify({ error: 'Weather data not found for city ' + city });
                    }
                } else if (name === 'calculate') {
                    const expression = args.expression.replace(/[^0-9+\-*/().]/g, '');
                    const calcResult = Function('"use strict"; return (' + expression + ')')();
                    result = JSON.stringify({ expression: args.expression, result: calcResult });
                } else if (name === 'get_current_time') {
                    const now = new Date();
                    result = JSON.stringify({
                        time: now.toLocaleTimeString('en-US'),
                        date: now.toLocaleDateString('en-US'),
                        timestamp: now.getTime()
                    });
                } else {
                    result = JSON.stringify({ error: 'Unknown tool: ' + name });
                }

                Toast.success('Tool ' + name + ' executed successfully');
                return { call_id, name, arguments: argsStr, result, status: 'success' };
            } catch (e) {
                Toast.error('Tool ' + name + ' execution failed');
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
                    name: 'User',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI Assistant',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: 'System',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
            chatOpts={{ tools }}
            systemPrompt={`You are a helpful AI assistant with the ability to call tools. When users need the following help, you must actively call the corresponding tools:

1. Weather queries: When users ask about weather conditions in any city, call the get_weather tool
2. Mathematical calculations: When users need to perform mathematical operations or calculations, call the calculate tool
3. Get time: When users ask about current time, date, or timestamp, call the get_current_time tool

Important notes:
- Do not guess or fabricate data, you must obtain accurate information by calling tools
- After calling a tool, wait for the tool to return results, then answer the user based on the results
- If tool calling fails, inform the user truthfully and suggest alternatives`}
            handleToolCall={handleToolCall}
            onError={(error) => Toast.error(error.message)}
        />
    );
}

render(<ToolCallingDemo />);
```

**Notes**:
1. Tool Calling currently only supports Qwen series models
2. Using `handleToolCall` prop, the component will automatically handle tool calls and result sending, no need to manually call `sendToolResults`
3. `handleToolCall` returns `Promise<ToolCallResult[]>` or `ToolCallResult[]`, and the component will automatically send results to continue conversation
4. Tool definitions follow OpenAI Function Calling format specifications

### Deep Think CoT

`ClientAI` supports Deep Think CoT toggle. When enabled, AI will perform deeper reasoning (showing thinking process). When disabled, it will add `/no_think` tag to let the model skip thinking and answer directly.

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function DeepThinkDemo() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfig;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            showDeepThinkButton={true}
            defaultEnableDeepThink={true}
            roleConfig={{
                user: {
                    name: 'User',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI Assistant',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: 'System',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
        />
    );
}

render(<DeepThinkDemo />);
```

**Usage Instructions**:
- When `showDeepThinkButton` is set to `true`, a "Deep Think CoT" button will appear in the bottom left corner of the input box
- Click the button to toggle Deep Think CoT on/off
- When enabled: AI will output thinking process wrapped in `<think>...</think>` tags
- When disabled: `/no_think` tag will be automatically added to the end of the message, allowing Qwen3 model to skip thinking

### Custom Render

If you need to completely customize the UI (using your own message list and input box styles), you can use the `render` prop. After passing the `render` function, the component will no longer render the default `AIChatDialogue` and `AIChatInput`, but will call your render function instead.

You can also choose not to render any UI by returning `null` from the `render` prop, and then call AI capabilities through the `sendMessage` method. This approach is suitable for scenarios such as search query rewriting and text pre-screening where users are unaware of AI and do not require interaction.

```jsx live=true dir="column" noInline=true
import React, { useState, useRef } from 'react';
import { ClientAI, Button, Input, Spin } from '@douyinfe/semi-ui';

// Custom render content component
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
                <p>Loading model...</p>
            </div>
        );
    }

    if (error) {
        return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;
    }

    // Helper function to render message content
    const renderMessageContent = (content) => {
        if (typeof content === 'string') {
            return content;
        }
        if (Array.isArray(content)) {
            return content.map((item, i) => {
                // Handle nested structure returned by chatInputToMessage (user messages)
                if (item.type === 'message' && Array.isArray(item.content)) {
                    return item.content.map((subItem, j) => (
                        <span key={`${i}-${j}`}>{subItem.text || ''}</span>
                    ));
                }
                // Handle Deep Think CoT content (reasoning type)
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
                // Handle regular text
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
            {/* Custom message list */}
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
                        No messages yet, start a conversation!
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
                                {msg.role === 'user' ? 'User' : 'AI'}
                            </div>
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                                {renderMessageContent(msg.content)}
                                {msg.status === 'in_progress' && <span>|</span>}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Custom input area */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Input 
                    value={inputValue}
                    onChange={setInputValue}
                    onEnterPress={handleSend}
                    placeholder="Enter message..."
                    disabled={isGenerating}
                    style={{ flex: 1 }}
                />
                {isGenerating ? (
                    <Button onClick={stopGenerate} type="danger">Stop</Button>
                ) : (
                    <Button onClick={handleSend} theme="solid" disabled={!inputValue.trim()}>Send</Button>
                )}
                <Button onClick={clearMessages}>Clear</Button>
                <Button 
                    onClick={() => setEnableDeepThink(!enableDeepThink)}
                    theme={enableDeepThink ? 'solid' : 'light'}
                >
                    {enableDeepThink ? '🧠 Deep Think CoT' : '⚡ Fast'}
                </Button>
            </div>
        </div>
    );
}

function CustomRenderDemo() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfig;
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

### Using Qwen3-4B Model

`ClientAI` also provides Qwen3-4B model configuration, which has stronger capabilities than the 1.7B model. Suitable for scenarios requiring higher model capabilities, especially scenarios that require more world knowledge.

```jsx
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function Qwen4B() {
    // Using Qwen3-4B model configuration (international users)
    const engineConfig = ClientAI.Qwen3_4B_EngineConfig;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            showDeepThinkButton={true}
            roleConfig={{
                user: {
                    name: 'User',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI Assistant',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: 'System',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
        />
    );
}
```

**Model Selection Recommendations**:
- **Qwen3-1.7B**: Lightweight model, suitable for most scenarios
- **Qwen3-4B**: More capable model, suitable for scenarios requiring higher model capabilities, especially scenarios that require more world knowledge

**ClientAIRenderProps Parameter Description**:

| Property | Description | Type |
|----------|-------------|------|
| loading | Whether the model is loading | `boolean` |
| error | Error message | `string \| null` |
| messages | Message list | `Message[]` |
| isGenerating | Whether a reply is being generated | `boolean` |
| enableDeepThink | Whether Deep Think CoT is enabled | `boolean` |
| sendMessage | Send message | `(text: string) => Promise<void>` |
| stopGenerate | Stop generation | `() => void` |
| clearMessages | Clear messages | `() => void` |
| setEnableDeepThink | Set Deep Think CoT toggle | `(enable: boolean) => void` |
| sendToolResults | Send Tool execution results | `(results: ToolCallResult[]) => Promise<void>` |

### Using Worker

`ClientAI` runs models in the main thread by default. If you don't provide `worker.url`, the model will run in the main thread. Running models in the main thread may block the UI, so it's recommended to switch to Worker mode for better performance.

To switch to Worker mode to avoid blocking the main thread, you need to complete the following two steps:

**Step 1: Create Worker File**

Create a Worker file (e.g., `worker.ts` or `worker.js`):

```typescript
// worker.ts
import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

const handler = new WebWorkerMLCEngineHandler();

// Handle messages from the main thread
self.onmessage = (msg: MessageEvent) => {
    handler.onmessage(msg);
};
```

**Worker File Notes**:
- `WebWorkerMLCEngineHandler` handles communication with the main thread and processes incoming requests
- The worker thread receives messages and processes actual computation using a hidden engine, then returns results back to the main thread via messages
- Worker files need to use ES Module format (`type: 'module'`)
- MLC Engine dependencies are already included in the component library, no additional installation required

**Step 2: Configure Worker URL in Component**

Pass the Worker file URL via the `worker` prop in the component:

```jsx
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function WithWorker() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfig;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            worker={{
                url: new URL('./worker.ts', import.meta.url).href,
                enabled: true,
            }}
            roleConfig={{
                user: {
                    name: 'User',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
                },
                assistant: {
                    name: 'AI Assistant',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
                system: {
                    name: 'System',
                    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
                },
            }}
        />
    );
}
```

**Configuration Notes**:
- `worker.url`: **Required**, the URL of the Worker file. You must provide this parameter to switch to Worker mode
- `worker.enabled`: Whether to enable Worker, defaults to `true`. Set to `false` to run in the main thread
- **Important**: Worker mode is only used when both `worker.url` is provided and `worker.enabled !== false`. Otherwise, it runs in the main thread by default

**Using Build Tools**:

**Vite**:
```typescript
worker: {
    url: new URL('./worker.ts', import.meta.url).href,
    enabled: true,
}
```

**Webpack**:
```typescript
// Need to install worker-loader or use Webpack 5's Worker support
import Worker from './worker.ts?worker';

worker: {
    url: Worker,
    enabled: true,
}
```

**Notes**:
- Worker files need to import `WebWorkerMLCEngineHandler` from `@mlc-ai/web-llm`
- Ensure build tools are properly configured for Worker support
- Worker files must use ES Module format (`type: 'module'`)

### Modify User Input

The `onUserMessage` callback can modify user input before sending, and the modified content will be used for both display and sending to AI:

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function OnUserMessageExample() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfig;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            onUserMessage={(userContent, messages) => {
                // Automatically add prefix
                return `Please answer briefly: ${userContent}`;
            }}
        />
    );
}

render(<OnUserMessageExample />);
```

### Intercept AI Call

The `beforeAIInput` callback can return a custom reply before AI call. If a non-empty string is returned, it will skip the AI call and use the returned reply directly:

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function BeforeAIInputExample() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfig;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            beforeAIInput={async (messages) => {
                const lastMessage = messages[messages.length - 1];
                // If user asks "hello", return fixed reply
                if (lastMessage && lastMessage.content && lastMessage.content.includes('hello')) {
                    return 'Hello! I am an AI assistant, glad to serve you.';
                }
                // Return empty string to call AI normally
                return '';
            }}
        />
    );
}

render(<BeforeAIInputExample />);
```

### Modify AI Reply

The `afterAIInput` callback can modify AI reply content after receiving it:

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function AfterAIInputExample() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfig;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    return (
        <ClientAI
            modelId={modelId}
            engineConfig={engineConfig}
            afterAIInput={(aiContent, messages) => {
                // Add prefix to AI reply
                return `[AI Reply] ${aiContent}`;
            }}
        />
    );
}

render(<AfterAIInputExample />);
```

### Control Streaming Display

The `stream` parameter controls whether to stream AI reply display. When set to `false`, it will wait for the stream to complete before displaying once:

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function StreamExample() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfig;
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

### Set Default Conversation Messages

`defaultMessages` is used to set initial conversation history, and these messages will be displayed when the component loads:

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function DefaultMessagesExample() {
    const engineConfig = ClientAI.Qwen3_1_7B_EngineConfig;
    const modelId = engineConfig.appConfig.model_list[0].model_id;
    
    const defaultMessages = [
        {
            id: 'msg-1',
            role: 'user',
            content: 'Hello, please introduce yourself',
            createdAt: Date.now() - 60000,
            status: 'completed',
        },
        {
            id: 'msg-2',
            role: 'assistant',
            content: 'Hello! I am an AI assistant, glad to serve you. I can help you answer questions, provide information and suggestions.',
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

## API Reference

### ClientAI

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| afterAIInput | Callback after AI reply, can modify AI reply content | `(aiContent: string, messages: Message[]) => string \| Promise<string>` | - |
| beforeAIInput | Callback before AI reply, can intercept AI call and return custom reply. Returns non-empty string will be used as AI reply, returns empty string will call AI normally | `(messages: Message[]) => string \| Promise<string>` | - |
| chatOpts | Chat options, can configure tools, etc. Override model default configuration | `ChatOptions \| ChatOptions[]` | - |
| className | Custom class name | `string` | - |
| defaultEnableDeepThink | Default state of Deep Think CoT | `boolean` | `true` |
| defaultMessages | Default conversation messages, used to set initial conversation history | `Message[]` | - |
| dialogueProps | Pass-through props for AIChatDialogue | `Partial<AIChatDialogueProps>` | - |
| engineConfig | Engine configuration, **required**. Use `ClientAI.Qwen3_1_7B_EngineConfig` / `ClientAI.Qwen3_1_7B_EngineConfigCN` (1.7B model) or `ClientAI.Qwen3_4B_EngineConfig` / `ClientAI.Qwen3_4B_EngineConfigCN` (4B model). You can also choose to self-host model files | `MLCEngineConfig` | - |
| inputProps | Pass-through props for AIChatInput | `Partial<AIChatInputProps>` | - |
| modelId | Model ID, **required**. Can be obtained from engine configuration, e.g.: `engineConfig.appConfig.model_list[0].model_id` | `string \| string[]` | - |
| handleToolCall | Tool call handler function, component will automatically call this function, wait for results, and automatically send results to continue conversation | `(toolCalls: ToolCall[], rawOutput: string) => Promise<ToolCallResult[]> \| ToolCallResult[]` | - |
| onError | Error callback | `(error: Error) => void` | - |
| onToolCall | Tool call callback, triggered when AI output contains tool_call (for notification only, requires manual call to sendToolResults) | `(toolCalls: ToolCall[], rawOutput: string) => void` | - |
| onUserMessage | Callback before user message is sent, can modify user input content. The returned string will be used for both display and sending to AI | `(userContent: string, messages: Message[]) => string` | - |
| render | Custom render function. After passing this function, UI rendering will be completely controlled by the user | `(props: ClientAIRenderProps) => ReactNode` | - |
| roleConfig | Role configuration for user, assistant, system, etc. (name, avatar, etc.) | `RoleConfig` | `{ user: { name: 'User' }, assistant: { name: 'AI Assistant' }, system: { name: 'System' } }` (default does not include avatar) |
| showDeepThinkButton | Whether to show Deep Think CoT button | `boolean` | `false` |
| stream | Control whether to stream AI reply display. When `false`, wait for stream to complete before displaying once | `boolean` | `true` |
| style | Custom style | `React.CSSProperties` | - |
| systemPrompt | System prompt | `string` | Dynamically set based on browser language: `'You are a helpful AI assistant. Reply to users in English.'` for English, `'你是一个有用的 AI 助手。使用中文回复用户。'` for Chinese |
| worker | Worker configuration | `{ url?: string; enabled?: boolean }` | `{ enabled: true }` (runs in main thread by default, requires `url` to use Worker) |

### Methods

The following methods can be called via `ref`:

| Method | Description | Parameters |
|--------|-------------|------------|
| sendToolResults | Send Tool execution results to let AI continue the conversation (usually not needed to call manually, recommend using `handleToolCall` prop) | `(toolResults: ToolCallResult[]) => Promise<void>` |

### ToolCall Type

```typescript
interface ToolCall {
    type: 'function_call';
    call_id: string;
    name: string;
    arguments: string;
    status: string;
}
```

### ToolCallResult Type

```typescript
interface ToolCallResult {
    call_id: string;
    name: string;
    arguments: string;
    result: string;
    status: 'success' | 'error';
}
```

### Static Properties

The `ClientAI` component provides the following static properties for engine configuration:

**Qwen3-1.7B Model** (lightweight):
- `ClientAI.Qwen3_1_7B_EngineConfig` - International users engine configuration (using Hugging Face + GitHub Raw)
- `ClientAI.Qwen3_1_7B_EngineConfigCN` - China users engine configuration (using ModelScope + jsDelivr CDN)

**Qwen3-4B Model** (more capable):
- `ClientAI.Qwen3_4B_EngineConfig` - International users engine configuration (using Hugging Face + GitHub Raw)
- `ClientAI.Qwen3_4B_EngineConfigCN` - China users engine configuration (using ModelScope + jsDelivr CDN)

> 💡 **Tip**: You can choose to download model files to your own CDN or cloud storage, then configure custom URLs. See [Self-Hosting Model Files](#self-hosting-model-files) section.

### Type Reference

Types used by the `ClientAI` component (such as `MLCEngineConfig`, `ChatOptions`, `AppConfig`, etc.) are all re-exported from `@douyinfe/semi-foundation/clientAI/interface`. These types are consistent with MLC Engine SDK. You can refer to the [MLC Engine documentation](https://github.com/mlc-ai/mlc-llm) for detailed descriptions of these types.

You can also import these types from `@douyinfe/semi-foundation/clientAI/interface`:

```typescript
import type {
    MLCEngineConfig,
    ChatOptions,
    AppConfig,
    WebWorkerMLCEngine,
    // ... other types
} from '@douyinfe/semi-foundation/clientAI/interface';
```

## Notes

1. **Worker File Implementation**: When using Worker mode, you need to create a Worker file. The Worker file needs to import `WebWorkerMLCEngineHandler` and handle messages. Refer to the [Using Worker](#using-worker) section above for detailed implementation.

2. **Model Loading Time**: The first model load may take a long time. It is recommended to show a loading state to users. The component automatically displays a loading progress bar.

3. **Browser Compatibility**: MLC Engine requires browser support for WebGPU. Please ensure that the target browser supports this feature.

4. **Memory Usage**: Running AI models consumes a lot of memory. It is recommended to use on devices with sufficient memory.

5. **Model File Size**: Model files may be large, and the first download takes time. It is recommended to use IndexedDB caching.

6. **Type Imports**: All MLC Engine-related types can be imported from `@douyinfe/semi-foundation/clientAI/interface`. These types are consistent with the MLC Engine SDK, making it convenient to refer to the documentation.

7. **Tool Calling Support**: The underlying MLC Engine natively only supports Function Calling for Hermes series models. We extended support for Qwen series models by analyzing Qwen's training process and tokenizer config.

8. **Models Supporting Tool Calling**:
   - ✅ Qwen series models (Qwen3-0.6B, Qwen3-1.7B, Qwen3-4B, etc.)
   - ✅ Hermes series models (MLC native support)

