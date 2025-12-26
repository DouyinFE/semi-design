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

### Core Features

- **Fully Local Execution**: Models run in the browser, data is not uploaded to servers, protecting user privacy
- **Multiple Model Support**: Supports Qwen, Hermes, and other model series
- **Qwen Model Enhancements**: Since the underlying inference engine does not support CoT and Tool Calling for Qwen models, we implemented CoT and Tool Calling support for Qwen series models under MLC Engine
- **Worker Support**: Supports running in Web Workers to avoid blocking the main thread
- **Singleton Pattern**: Multiple component instances share the same model, avoiding duplicate downloads

### Qwen Model Implementation

`ClientAI` provides special optimizations and extensions for Qwen series models:

1. **CoT (Chain of Thought)**:
   - By analyzing Qwen's training process and tokenizer config, we implemented the ability to freely toggle CoT in Qwen's non-instruct models
   - Qwen3 models support `<think>` tags to display thinking processes
   - The component automatically parses and renders thinking content
   - You can disable thinking by adding `/no_think` tag to get direct answers

2. **Tool Calling (Function Calling)**:
   - The underlying MLC Engine's native Function Calling only supports Hermes series models
   - By analyzing Qwen's training process and tokenizer config, we extended Tool Calling support for Qwen series models under MLC Engine

## Use Cases

The `ClientAI` component is suitable for the following scenarios:
- Scenarios that require running AI models in the browser
- Applications that need offline AI capabilities
- AI applications that need to protect user privacy (data is not uploaded to the server)
- AI applications that need rapid prototyping
- Applications that need lightweight AI capabilities (such as Qwen3-1.7B and other small models)

## Code Examples

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

You can choose to download model files to your own CDN or cloud storage, then configure custom URLs pointing to your own addresses. This avoids relying on third-party service availability.

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
| `vram_required_MB` | Estimated VRAM requirement (MB) | - |
| `low_resource_required` | Whether to use low resource mode | `false` |
| `overrides.context_window_size` | Context window size (tokens), Qwen3-1.7B supports up to 40960 | Model default |

### Passing Through Props

You can pass through props of `AIChatDialogue` and `AIChatInput` via `dialogueProps` and `inputProps`:

```jsx live=true dir="column" noInline=true
import React from 'react';
import { ClientAI } from '@douyinfe/semi-ui';

function WithCustomProps() {
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
            dialogueProps={{
                align: 'leftAlign',
                mode: 'noBubble',
            }}
            inputProps={{
                placeholder: 'Please enter your question...',
            }}
        />
    );
}

render(<WithCustomProps />);
```

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

### Using Worker

`ClientAI` runs models in the main thread by default. If you don't provide `worker.url`, the model will run in the main thread. Running models in the main thread may block the UI, so it's recommended to switch to Worker mode for better performance.

To switch to Worker mode to avoid blocking the main thread, you need to complete the following two steps:

**Step 1: Create Worker File**

Create a Worker file (e.g., `worker.ts` or `worker.js`):

```typescript
// worker.ts
import { WebWorkerMLCEngineHandler } from '@douyinfe/semi-foundation/clientAI/interface';

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

```jsx live=true dir="column" noInline=true
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

render(<WithWorker />);
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
- Worker files need to import `WebWorkerMLCEngineHandler` from `@douyinfe/semi-foundation/clientAI/interface`
- Ensure build tools are properly configured for Worker support
- Worker files must use ES Module format (`type: 'module'`)

## API Reference

### ClientAI

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| engineConfig | Engine configuration, **required**. International users use `ClientAI.Qwen3_1_7B_EngineConfig`, China users use `ClientAI.Qwen3_1_7B_EngineConfigCN`. You can also choose to self-host model files | `MLCEngineConfig` | - |
| chatOpts | Chat options, override model default configuration | `ChatOptions \| ChatOptions[]` | - |
| worker | Worker configuration | `{ url?: string; enabled?: boolean }` | `{ enabled: true }` (runs in main thread by default, requires `url` to use Worker) |
| systemPrompt | System prompt | `string` | Dynamically set based on browser language: `'你是一个有用的 AI 助手。使用中文回复用户。'` for Chinese, `'You are a helpful AI assistant. Reply to users in English.'` for other languages |
| roleConfig | Role configuration for user, assistant, system, etc. (name, avatar, etc.) | `RoleConfig` | `{ user: { name: '用户' }, assistant: { name: 'AI 助手' }, system: { name: '系统' } }` (default does not include avatar) |
| onError | Error callback | `(error: Error) => void` | - |
| dialogueProps | Pass-through props for AIChatDialogue | `Partial<AIChatDialogueProps>` | - |
| inputProps | Pass-through props for AIChatInput | `Partial<AIChatInputProps>` | - |
| className | Custom class name | `string` | - |
| style | Custom style | `React.CSSProperties` | - |

### Static Properties

The `ClientAI` component provides the following static properties for engine configuration:

- `ClientAI.Qwen3_1_7B_EngineConfig` - International users engine configuration (using Hugging Face + GitHub Raw)
- `ClientAI.Qwen3_1_7B_EngineConfigCN` - China users engine configuration (using ModelScope + jsDelivr CDN)

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

