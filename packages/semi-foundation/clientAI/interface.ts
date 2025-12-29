/**
 * ClientAI 组件类型定义
 * 从 @mlc-ai/web-llm 重新导出类型，方便用户查阅 web-llm 文档
 */

// 重新导出 Tool Calling 相关类型
export type { ToolCall, ToolCallResult } from './foundation';

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
 * ClientAI 组件 Props
 */
export interface ClientAIProps {
    /**
     * Worker 配置
     */
    worker?: WorkerConfig;
    
    /**
     * 模型 ID，必填
     * 当 engineConfig.appConfig.model_list 包含多个模型时，用于指定使用哪个模型
     * 可以从引擎配置中获取，如：ClientAI.Qwen3_1_7B_EngineConfig.appConfig.model_list[0].model_id
     */
    modelId?: string | string[];
    
    /**
     * 引擎配置，必填
     * 国际用户使用 ClientAI.Qwen3_1_7B_EngineConfig
     * 中国大陆用户使用 ClientAI.Qwen3_1_7B_EngineConfigCN
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
    style?: any;
    
    /**
     * 用户消息发送前的回调
     * 可以修改用户输入内容，返回的字符串将同时用于显示和发送给AI
     * @param userContent 用户输入的原始内容
     * @param messages 完整的消息历史数组
     * @returns 修改后的用户内容
     */
    onUserMessage?: (userContent: string, messages: any[]) => string;
    
    /**
     * AI回复前的回调
     * 可以拦截AI调用并返回自定义回复
     * @param messages 完整的消息历史数组（包含最新的用户消息）
     * @returns 非空字符串将作为AI回复，空字符串则正常调用AI
     */
    beforeAIInput?: (messages: any[]) => string | Promise<string>;
    
    /**
     * AI回复后的回调
     * 可以修改AI的回复内容
     * @param aiContent AI返回的原始内容
     * @param messages 完整的消息历史数组（包含AI回复）
     * @returns 修改后的AI回复内容
     */
    afterAIInput?: (aiContent: string, messages: any[]) => string | Promise<string>;
    
    /**
     * 控制是否流式显示AI回复
     * @default true
     * 当为 false 时，等待流式返回完毕后才一次性显示
     */
    stream?: boolean;
    
    /**
     * 默认对话消息
     * 用于设置初始的对话历史，组件加载时会显示这些消息
     */
    defaultMessages?: any[];
    
    /**
     * Tool 调用处理函数
     * 当 AI 输出包含 tool_call 时，组件会自动调用此函数并等待返回结果，然后自动发送结果继续对话
     * 如果提供了此函数，将优先使用此函数；否则会调用 onToolCall 回调（需要手动调用 sendToolResults）
     * @param toolCalls 解析出的 tool calls 数组
     * @param rawOutput AI 的原始输出
     * @returns 返回 Tool 执行结果数组，组件会自动发送这些结果继续对话
     */
    handleToolCall?: (toolCalls: ToolCall[], rawOutput: string) => Promise<ToolCallResult[]> | ToolCallResult[]
}


