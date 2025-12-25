---
localeCode: en-US
order: 100
category: Ai
title: BrowserAI Browser AI
icon: doc-browserAI
width: 60%
brief: Browser-side AI chat component based on WebLLM
showNew: true
---

## Use Cases

`BrowserAI` is a browser-side AI chat component implemented based on [WebLLM](https://github.com/mlc-ai/web-llm). It integrates `AIChatDialogue` and `AIChatInput` components, supporting running AI models directly in the browser without a backend server.

The `BrowserAI` component is suitable for the following scenarios:
- Scenarios that require running AI models in the browser
- Applications that need offline AI capabilities
- AI applications that need to protect user privacy (data is not uploaded to the server)
- AI applications that need rapid prototyping

## Prerequisites

Before using the `BrowserAI` component, you need to install the `@mlc-ai/web-llm` dependency:

```bash
npm install @mlc-ai/web-llm
# or
yarn add @mlc-ai/web-llm
# or
pnpm add @mlc-ai/web-llm
```

## Code Examples

### How to Import

```jsx import
import { BrowserAI } from '@douyinfe/semi-ui';
```

### Basic Usage

The `BrowserAI` component does not automatically use default configurations. You need to explicitly get default configurations from the component's static properties and pass them as props.

```jsx live=true dir="column" noInline=true
import React from 'react';
import { BrowserAI } from '@douyinfe/semi-ui';

function Basic() {
    return (
        <BrowserAI
            modelId={BrowserAI.defaultModelId}
            engineConfig={BrowserAI.defaultEngineConfig}
            worker={{
                url: new URL('./worker.ts', import.meta.url).href,
                enabled: true
            }}
        />
    );
}

render(<Basic />);
```

### Using Worker

Using Worker mode allows running AI models in a background thread, avoiding blocking the main thread. You need to implement the Worker file yourself.

#### Worker Implementation Example

Create a Worker file (e.g., `worker.ts`):

```typescript
// worker.ts
import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

const handler = new WebWorkerMLCEngineHandler();

// Handle messages from the main thread
self.onmessage = (msg: MessageEvent) => {
    handler.onmessage(msg);
};
```

Then use it in the component:

```jsx live=true dir="column" noInline=true
import React from 'react';
import { BrowserAI } from '@douyinfe/semi-ui';

function WithWorker() {
    return (
        <BrowserAI
            modelId={BrowserAI.defaultModelId}
            engineConfig={BrowserAI.defaultEngineConfig}
            worker={{
                url: new URL('./worker.ts', import.meta.url).href, // Your worker file path
                enabled: true
            }}
        />
    );
}

render(<WithWorker />);
```

**Notes**:
- Worker files need to use `type: 'module'` mode
- If using build tools (such as Vite, Webpack), you can use their Worker support
- Worker files need to be able to access the `@mlc-ai/web-llm` module

### Custom Model Configuration

You can pass custom model configurations:

```jsx live=true dir="column" noInline=true
import React from 'react';
import { BrowserAI } from '@douyinfe/semi-ui';
import type { MLCEngineConfig } from '@douyinfe/semi-foundation/browserAI/interface';

function CustomModel() {
    const customEngineConfig: MLCEngineConfig = {
        appConfig: {
            useIndexedDBCache: true,
            model_list: [
                {
                    model: 'https://modelscope.cn/models/mlc-ai/Qwen3-1.7B-q4f32_1-MLC',
                    model_id: 'Qwen3-1.7B-q4f32_1-MLC',
                    model_lib: 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_80/Qwen3-1.7B-q4f32_1-ctx4k_cs1k-webgpu.wasm',
                    vram_required_MB: 2635.44,
                    low_resource_required: true,
                },
            ],
        },
        initProgressCallback: (progress) => {
            console.log('Model loading progress:', progress);
        },
    };

    return (
        <BrowserAI
            modelId="Qwen3-1.7B-q4f32_1-MLC"
            engineConfig={customEngineConfig}
            worker={{
                url: '/worker.js',
                enabled: true
            }}
        />
    );
}

render(<CustomModel />);
```

### Without Worker

If you don't want to use Worker (run in the main thread), you can set `worker.enabled` to `false`:

```jsx live=true dir="column" noInline=true
import React from 'react';
import { BrowserAI } from '@douyinfe/semi-ui';

function WithoutWorker() {
    return (
        <BrowserAI
            modelId={BrowserAI.defaultModelId}
            engineConfig={BrowserAI.defaultEngineConfig}
            worker={{
                enabled: false
            }}
        />
    );
}

render(<WithoutWorker />);
```

### Passing Through Props

You can pass through props of `AIChatDialogue` and `AIChatInput` via `dialogueProps` and `inputProps`:

```jsx live=true dir="column" noInline=true
import React from 'react';
import { BrowserAI } from '@douyinfe/semi-ui';

function WithCustomProps() {
    return (
        <BrowserAI
            modelId={BrowserAI.defaultModelId}
            engineConfig={BrowserAI.defaultEngineConfig}
            worker={{
                url: '/worker.js',
                enabled: true
            }}
            dialogueProps={{
                align: 'leftAlign',
                mode: 'noBubble',
            }}
            inputProps={{
                placeholder: 'Please enter your question...',
                showUploadFile: true,
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
import { BrowserAI, Toast } from '@douyinfe/semi-ui';

function WithErrorHandler() {
    const handleError = (error: Error) => {
        Toast.error(`Error: ${error.message}`);
        console.error('BrowserAI error:', error);
    };

    return (
        <BrowserAI
            modelId={BrowserAI.defaultModelId}
            engineConfig={BrowserAI.defaultEngineConfig}
            worker={{
                url: '/worker.js',
                enabled: true
            }}
            onError={handleError}
        />
    );
}

render(<WithErrorHandler />);
```

## API Reference

### BrowserAI

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| modelId | Model ID, required. You can get the default value from `BrowserAI.defaultModelId` | `string \| string[]` | - |
| engineConfig | Engine configuration. You can get the default value from `BrowserAI.defaultEngineConfig` | `MLCEngineConfig` | - |
| chatOpts | Chat options, override model default configuration | `ChatOptions \| ChatOptions[]` | - |
| worker | Worker configuration | `{ url?: string; enabled?: boolean }` | `{ enabled: true }` |
| systemPrompt | System prompt | `string` | `'You are a helpful AI assistant.'` |
| onError | Error callback | `(error: Error) => void` | - |
| dialogueProps | Pass-through props for AIChatDialogue | `Partial<AIChatDialogueProps>` | - |
| inputProps | Pass-through props for AIChatInput | `Partial<AIChatInputProps>` | - |
| className | Custom class name | `string` | - |
| style | Custom style | `React.CSSProperties` | - |

### Static Properties

The `BrowserAI` component provides the following static properties from which you can get default configurations:

- `BrowserAI.defaultModelId` - Default model ID
- `BrowserAI.defaultEngineConfig` - Default engine configuration

### Type Reference

Types used by the `BrowserAI` component (such as `MLCEngineConfig`, `ChatOptions`, `AppConfig`, etc.) are all re-exported from `@mlc-ai/web-llm`. You can refer to the [WebLLM documentation](https://github.com/mlc-ai/web-llm) for detailed descriptions of these types.

You can also import these types from `@douyinfe/semi-foundation/browserAI/interface`:

```typescript
import type {
    MLCEngineConfig,
    ChatOptions,
    AppConfig,
    WebWorkerMLCEngine,
    // ... other types
} from '@douyinfe/semi-foundation/browserAI/interface';
```

## Notes

1. **Worker File Implementation**: When using Worker mode, you need to implement the Worker file yourself. The Worker file needs to import `WebWorkerMLCEngineHandler` and handle messages. Refer to the Worker implementation example above.

2. **Model Loading Time**: The first model load may take a long time. It is recommended to show a loading state to users.

3. **Browser Compatibility**: WebLLM requires browser support for WebGPU. Please ensure that the target browser supports this feature.

4. **Memory Usage**: Running AI models consumes a lot of memory. It is recommended to use on devices with sufficient memory.

5. **Model File Size**: Model files may be large, and the first download takes time. It is recommended to use IndexedDB caching.

6. **Type Imports**: All WebLLM-related types can be imported from `@douyinfe/semi-foundation/browserAI/interface`. These types are consistent with the WebLLM SDK, making it convenient to refer to the documentation.

