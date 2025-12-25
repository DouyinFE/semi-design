---
localeCode: zh-CN
order: 100
category: Ai
title: BrowserAI 浏览器 AI
icon: doc-browserAI
width: 60%
brief: 基于 WebLLM 的浏览器端 AI 聊天组件
showNew: true
---

## 使用场景

`BrowserAI` 是一个基于 [WebLLM](https://github.com/mlc-ai/web-llm) 实现的浏览器端 AI 聊天组件。它集成了 `AIChatDialogue` 和 `AIChatInput` 组件，支持在浏览器中直接运行 AI 模型，无需后端服务器。

`BrowserAI` 组件适用于以下场景：
- 需要在浏览器端运行 AI 模型的场景
- 需要离线 AI 能力的应用
- 需要保护用户隐私的 AI 应用（数据不上传到服务器）
- 需要快速原型开发的 AI 应用

## 前置依赖

使用 `BrowserAI` 组件前，需要安装 `@mlc-ai/web-llm` 依赖：

```bash
npm install @mlc-ai/web-llm
# 或
yarn add @mlc-ai/web-llm
# 或
pnpm add @mlc-ai/web-llm
```

## 代码演示

### 如何引入

```jsx import
import { BrowserAI } from '@douyinfe/semi-ui';
```

### 基本用法

`BrowserAI` 组件不会自动使用默认配置，你需要显式地从组件的静态属性中获取默认配置并传入 props。

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

### 使用 Worker

使用 Worker 模式可以在后台线程运行 AI 模型，避免阻塞主线程。你需要自己实现 Worker 文件。

#### Worker 实现示例

创建一个 Worker 文件（例如 `worker.ts`）：

```typescript
// worker.ts
import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

const handler = new WebWorkerMLCEngineHandler();

// 处理来自主线程的消息
self.onmessage = (msg: MessageEvent) => {
    handler.onmessage(msg);
};
```

然后在组件中使用：

```jsx live=true dir="column" noInline=true
import React from 'react';
import { BrowserAI } from '@douyinfe/semi-ui';

function WithWorker() {
    return (
        <BrowserAI
            modelId={BrowserAI.defaultModelId}
            engineConfig={BrowserAI.defaultEngineConfig}
            worker={{
                url: new URL('./worker.ts', import.meta.url).href, // 你的 worker 文件路径
                enabled: true
            }}
        />
    );
}

render(<WithWorker />);
```

**注意事项**：
- Worker 文件需要使用 `type: 'module'` 模式
- 如果使用打包工具（如 Vite、Webpack），可以使用它们的 Worker 支持
- Worker 文件需要能够访问 `@mlc-ai/web-llm` 模块

### 自定义模型配置

你可以传入自定义的模型配置：

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

### 不使用 Worker

如果你不想使用 Worker（在主线程运行），可以设置 `worker.enabled` 为 `false`：

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

### 透传 Props

你可以通过 `dialogueProps` 和 `inputProps` 透传 `AIChatDialogue` 和 `AIChatInput` 的 props：

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
                placeholder: '请输入你的问题...',
                showUploadFile: true,
            }}
        />
    );
}

render(<WithCustomProps />);
```

### 错误处理

你可以通过 `onError` 回调处理错误：

```jsx live=true dir="column" noInline=true
import React, { useState } from 'react';
import { BrowserAI, Toast } from '@douyinfe/semi-ui';

function WithErrorHandler() {
    const handleError = (error: Error) => {
        Toast.error(`错误: ${error.message}`);
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

## API 参考

### BrowserAI

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelId | 模型 ID，必填。可以从 `BrowserAI.defaultModelId` 获取默认值 | `string \| string[]` | - |
| engineConfig | 引擎配置。可以从 `BrowserAI.defaultEngineConfig` 获取默认值 | `MLCEngineConfig` | - |
| chatOpts | 聊天选项，覆盖模型默认配置 | `ChatOptions \| ChatOptions[]` | - |
| worker | Worker 配置 | `{ url?: string; enabled?: boolean }` | `{ enabled: true }` |
| systemPrompt | 系统提示词 | `string` | `'You are a helpful AI assistant.'` |
| onError | 错误回调 | `(error: Error) => void` | - |
| dialogueProps | AIChatDialogue 的透传 props | `Partial<AIChatDialogueProps>` | - |
| inputProps | AIChatInput 的透传 props | `Partial<AIChatInputProps>` | - |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `React.CSSProperties` | - |

### 静态属性

`BrowserAI` 组件提供了以下静态属性，你可以从中获取默认配置：

- `BrowserAI.defaultModelId` - 默认模型 ID
- `BrowserAI.defaultEngineConfig` - 默认引擎配置

### 类型说明

`BrowserAI` 组件使用的类型（如 `MLCEngineConfig`、`ChatOptions`、`AppConfig` 等）都从 `@mlc-ai/web-llm` 重新导出。你可以查阅 [WebLLM 文档](https://github.com/mlc-ai/web-llm) 了解这些类型的详细说明。

你也可以从 `@douyinfe/semi-foundation/browserAI/interface` 导入这些类型：

```typescript
import type {
    MLCEngineConfig,
    ChatOptions,
    AppConfig,
    WebWorkerMLCEngine,
    // ... 其他类型
} from '@douyinfe/semi-foundation/browserAI/interface';
```

## 注意事项

1. **Worker 文件实现**：使用 Worker 模式时，需要自己实现 Worker 文件。Worker 文件需要导入 `WebWorkerMLCEngineHandler` 并处理消息。参考上面的 Worker 实现示例。

2. **模型加载时间**：首次加载模型可能需要较长时间，建议显示加载状态给用户。

3. **浏览器兼容性**：WebLLM 需要浏览器支持 WebGPU，请确保目标浏览器支持该特性。

4. **内存使用**：运行 AI 模型会消耗较多内存，建议在内存充足的设备上使用。

5. **模型文件大小**：模型文件可能较大，首次下载需要时间，建议使用 IndexedDB 缓存。

6. **类型导入**：所有 WebLLM 相关的类型都可以从 `@douyinfe/semi-foundation/browserAI/interface` 导入，这些类型与 WebLLM SDK 保持一致，方便查阅文档。

