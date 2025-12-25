/**
 * BrowserAI 组件类型定义
 * 从 @mlc-ai/web-llm 重新导出类型，方便用户查阅 web-llm 文档
 */

// 重新导出 web-llm 的核心类型
export type {
    // Engine 相关
    WebWorkerMLCEngine,
    MLCEngineInterface,
    MLCEngineConfig,
    // Config 相关
    AppConfig,
    ModelRecord,
    ChatOptions,
    ChatConfig,
    GenerationConfig,
    ModelType,
    // Callback 相关
    InitProgressCallback,
    InitProgressReport,
    // OpenAI API 相关
    ChatCompletion,
    ChatCompletionChunk,
    ChatCompletionRequestBase,
    ChatCompletionRequestStreaming,
    ChatCompletionRequestNonStreaming,
    Completion,
    CompletionCreateParamsBase,
    CompletionCreateParamsStreaming,
    CompletionCreateParamsNonStreaming,
    CreateEmbeddingResponse,
    EmbeddingCreateParams,
} from '@mlc-ai/web-llm';

// 重新导出 web-llm 的函数（类型）
export type {
    CreateWebWorkerMLCEngine,
} from '@mlc-ai/web-llm';

// 导入 AIChatDialogue 和 AIChatInput 的 Props 类型
// 注意：这些类型在 UI 层定义，Foundation 层只做类型引用
// 实际使用时会在 UI 层导入

/**
 * Worker 配置
 */
export interface WorkerConfig {
    /**
     * Worker URL，如果提供则使用该 URL 创建 Worker
     */
    url?: string;
    /**
     * 是否启用 Worker，默认 true（如果提供了 url）
     */
    enabled?: boolean
}

/**
 * BrowserAI 组件 Props
 */
export interface BrowserAIProps {
    /**
     * Worker 配置
     */
    worker?: WorkerConfig;
    
    /**
     * 模型 ID，必填
     * 可以从 BrowserAI.defaultModelId 获取默认值
     */
    modelId: string | string[];
    
    /**
     * 引擎配置
     * 可以从 BrowserAI.defaultEngineConfig 获取默认值
     */
    engineConfig?: MLCEngineConfig;
    
    /**
     * 聊天选项，覆盖模型默认配置
     */
    chatOpts?: ChatOptions | ChatOptions[];
    
    /**
     * 系统提示词
     */
    systemPrompt?: string;
    
    /**
     * 错误回调
     */
    onError?: (error: Error) => void;
    
    /**
     * AIChatDialogue 的透传 props
     * 类型定义在 UI 层
     */
    dialogueProps?: any;
    
    /**
     * AIChatInput 的透传 props
     * 类型定义在 UI 层
     */
    inputProps?: any;
    
    /**
     * 组件基础 props
     */
    className?: string;
    style?: any
}


