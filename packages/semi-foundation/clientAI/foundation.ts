import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { CreateWebWorkerMLCEngine, CreateMLCEngine } from '@mlc-ai/web-llm';
import type {
    WebWorkerMLCEngine,
    MLCEngineConfig,
    ChatOptions,
    InitProgressCallback,
    InitProgressReport,
    WorkerConfig,
} from './interface';
import type { MessageContent } from '../aiChatInput/interface';
import type { Message } from '../aiChatDialogue/foundation';
import chatInputToMessage from '../aiChatDialogue/dataAdapter/chatInputToMessage';
import { getUuidv4 } from '../utils/uuid';

/**
 * WebLLM 内部使用的消息格式
 */
export interface WebLLMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string
}

/**
 * Engine 缓存条目
 */
interface EngineCacheEntry {
    engine: WebWorkerMLCEngine;
    refCount: number
}

/**
 * 初始化引擎的配置参数
 */
export interface InitEngineConfig {
    modelId: string | string[];
    worker?: WorkerConfig;
    engineConfig?: MLCEngineConfig;
    chatOpts?: ChatOptions | ChatOptions[]
}

/**
 * 全局 Engine 管理器（单例模式）
 * 确保同一个 modelId 只下载和加载一次
 */
class EngineManager {
    private static instance: EngineManager;
    
    // 已加载的 engine 缓存
    private engineCache: Map<string, EngineCacheEntry> = new Map();
    
    // 正在加载的 Promise 缓存（防止重复下载）
    private loadingPromises: Map<string, Promise<WebWorkerMLCEngine>> = new Map();

    private constructor() {}

    static getInstance(): EngineManager {
        if (!EngineManager.instance) {
            EngineManager.instance = new EngineManager();
        }
        return EngineManager.instance;
    }

    /**
     * 生成缓存 key
     * 使用 modelId 作为主要标识
     */
    private getCacheKey(modelId: string | string[]): string {
        if (Array.isArray(modelId)) {
            return modelId.sort().join('|');
        }
        return modelId;
    }

    /**
     * 创建引擎（内部方法）
     */
    private async createEngine(config: InitEngineConfig): Promise<WebWorkerMLCEngine> {
        const { modelId, worker, engineConfig, chatOpts } = config;
        
        // 判断是否使用 Worker
        const useWorker = worker?.enabled !== false && worker?.url;

        let engine: WebWorkerMLCEngine;

        if (useWorker && worker?.url) {
            // 使用 Worker 模式
            const workerInstance = new Worker(worker.url, { type: 'module' });
            engine = await CreateWebWorkerMLCEngine(
                workerInstance,
                modelId,
                engineConfig,
                chatOpts
            );
        } else {
            // 非 Worker 模式（主线程模式）
            engine = await CreateMLCEngine(modelId, engineConfig, chatOpts) as any;
        }

        return engine;
    }

    /**
     * 获取或创建 engine
     * 如果已存在则直接返回，如果正在加载则等待，否则创建新的
     */
    async getOrCreateEngine(config: InitEngineConfig): Promise<WebWorkerMLCEngine> {
        const { modelId } = config;
        const cacheKey = this.getCacheKey(modelId);

        // 1. 检查是否已有缓存的 engine
        const cached = this.engineCache.get(cacheKey);
        if (cached) {
            cached.refCount++;
            return cached.engine;
        }

        // 2. 检查是否正在加载
        const loadingPromise = this.loadingPromises.get(cacheKey);
        if (loadingPromise) {
            const engine = await loadingPromise;
            // 加载完成后增加引用计数
            const entry = this.engineCache.get(cacheKey);
            if (entry) {
                entry.refCount++;
            }
            return engine;
        }

        // 3. 创建新的加载任务
        // 注意：即使模型文件已缓存，web-llm 在初始化时（加载到 GPU 等）也会触发进度回调
        const createPromise = (async () => {
            try {
                const engine = await this.createEngine(config);
                
                // 加载完成，存入缓存
                this.engineCache.set(cacheKey, {
                    engine,
                    refCount: 1,
                });
                
                return engine;
            } finally {
                // 无论成功失败，都清除 loading promise
                this.loadingPromises.delete(cacheKey);
            }
        })();

        this.loadingPromises.set(cacheKey, createPromise);
        return createPromise;
    }

    /**
     * 释放 engine 引用
     * 当引用计数为 0 时，可以选择卸载 engine
     */
    async releaseEngine(modelId: string | string[], unload: boolean = false): Promise<void> {
        const cacheKey = this.getCacheKey(modelId);
        const entry = this.engineCache.get(cacheKey);
        
        if (!entry) {
            return;
        }

        entry.refCount--;

        // 当没有组件使用时，可以选择卸载
        if (entry.refCount <= 0 && unload) {
            try {
                if (entry.engine && typeof entry.engine.unload === 'function') {
                    await entry.engine.unload();
                }
            } catch (error) {
                // 忽略卸载错误
            }
            this.engineCache.delete(cacheKey);
        }
    }

    /**
     * 检查 engine 是否已缓存
     */
    hasEngine(modelId: string | string[]): boolean {
        const cacheKey = this.getCacheKey(modelId);
        return this.engineCache.has(cacheKey);
    }

    /**
     * 检查 engine 是否正在加载
     */
    isLoading(modelId: string | string[]): boolean {
        const cacheKey = this.getCacheKey(modelId);
        return this.loadingPromises.has(cacheKey);
    }

    /**
     * 获取缓存的 engine（不增加引用计数）
     */
    getEngine(modelId: string | string[]): WebWorkerMLCEngine | null {
        const cacheKey = this.getCacheKey(modelId);
        return this.engineCache.get(cacheKey)?.engine || null;
    }

    /**
     * 清除所有缓存（用于测试或完全重置）
     */
    async clearAll(): Promise<void> {
        for (const [, entry] of this.engineCache) {
            try {
                if (entry.engine && typeof entry.engine.unload === 'function') {
                    await entry.engine.unload();
                }
            } catch (error) {
                // 忽略卸载错误
            }
        }
        this.engineCache.clear();
        this.loadingPromises.clear();
    }
}

// 内部单例实例
const engineManager = EngineManager.getInstance();

/**
 * Tool Call 结果类型
 */
export interface ToolCallResult {
    call_id: string;
    name: string;
    arguments: string;
    result: string;
    status: 'success' | 'error'
}

/**
 * Tool Call 类型（用于回调）
 */
export interface ToolCall {
    type: 'function_call';
    call_id: string;
    name: string;
    arguments: string;
    status: string
}

/**
 * ClientAI Foundation Adapter
 */
export interface ClientAIAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    setEngine: (engine: WebWorkerMLCEngine | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setChats: (chats: Message[]) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    setAbortController: (controller: AbortController | null) => void;
    setMessages: (messages: WebLLMMessage[]) => void;
    setInitProgress?: (progress: InitProgressReport | null) => void;
    notifyError: (error: Error) => void;
    notifyInitProgress?: (progress: any) => void;
    notifyToolCall?: (toolCalls: ToolCall[], rawOutput: string) => void
}

/**
 * 根据浏览器语言获取默认的 system prompt
 */
function getDefaultSystemPrompt(): string {
    if (typeof navigator !== 'undefined' && navigator.language) {
        const lang = navigator.language.toLowerCase();
        if (lang.startsWith('zh')) {
            return '你是一个有用的 AI 助手。使用中文回复用户。';
        }
    }
    return 'You are a helpful AI assistant. Reply to users in English.';
}

/**
 * ClientAI Foundation
 * 包含所有业务逻辑，不依赖 React/DOM
 */
export default class ClientAIFoundation extends BaseFoundation<ClientAIAdapter> {
    private messageIdCounter = 0;

    constructor(adapter: ClientAIAdapter) {
        super({ ...ClientAIFoundation.defaultAdapter, ...adapter });
    }

    static get defaultAdapter() {
        return {
            ...BaseFoundation.defaultAdapter,
            setEngine: () => {},
            setLoading: () => {},
            setError: () => {},
            setChats: () => {},
            setIsGenerating: () => {},
            setAbortController: () => {},
            setMessages: () => {},
            setInitProgress: () => {},
            notifyError: () => {},
            notifyInitProgress: () => {},
            notifyToolCall: () => {},
        };
    }

    /**
     * 生成唯一消息 ID
     */
    private generateId = (): string => {
        return `msg_${Date.now()}_${++this.messageIdCounter}`;
    };

    /**
     * 从 MessageContent 中提取文本内容
     */
    extractTextFromMessageContent = (messageContent: MessageContent): string => {
        if (!messageContent.inputContents || messageContent.inputContents.length === 0) {
            return '';
        }

        // 提取所有文本内容
        return messageContent.inputContents
            .map((content) => {
                if (content.type === 'text' || content.type === 'paragraph') {
                    return content.text || content.content || '';
                }
                return '';
            })
            .join('')
            .trim();
    };

    /**
     * 从 Message 中提取文本内容
     */
    private extractTextFromMessage = (message: Message): string => {
        if (typeof message.content === 'string') {
            return message.content;
        }
        if (Array.isArray(message.content)) {
            // 提取所有文本内容
            let text = '';
            message.content.forEach((item: any) => {
                if (item.type === 'message' && Array.isArray(item.content)) {
                    item.content.forEach((contentItem: any) => {
                        if (contentItem.type === 'input_text' || contentItem.type === 'output_text') {
                            text += (contentItem.text || '');
                        }
                    });
                } else if (item.type === 'output_text') {
                    text += (item.text || '');
                }
            });
            return text.trim();
        }
        return '';
    };

    /**
     * 将 Message[] 转换为 WebLLMMessage[]
     */
    private convertMessagesToWebLLM = (messages: Message[]): WebLLMMessage[] => {
        return messages
            .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
            .map((msg) => ({
                role: msg.role as 'user' | 'assistant',
                content: this.extractTextFromMessage(msg),
            }))
            .filter((msg) => msg.content); // 过滤掉空内容
    };

    /**
     * 判断是否是 Qwen 系列模型
     */
    private isQwenModel(modelId: string | string[]): boolean {
        const ids = Array.isArray(modelId) ? modelId : [modelId];
        return ids.some(id => id.toLowerCase().includes('qwen'));
    }

    /**
     * 构建 Qwen 风格的带 tools 的 system prompt
     * 因为 webLLM 的 MLC 编译配置中 use_function_calling: false，
     * 所以我们需要手动将 tools 信息注入到 system prompt 中
     */
    buildQwenSystemPromptWithTools = (originalPrompt: string, tools: any[]): string => {
        const toolsJson = tools.map(t => JSON.stringify(t, null, 2)).join('\n');
        
        return `${originalPrompt}

# Tools

You may call one or more functions to assist with the user query.

You are provided with function signatures within <tools></tools> XML tags:
<tools>
${toolsJson}
</tools>

For each function call, return a json object with function name and arguments within <tool_call></tool_call> XML tags:
<tool_call>
{"name": <function-name>, "arguments": <args-json-object>}
</tool_call>`;
    };

    /**
     * 解析 Qwen 输出中的 <tool_call> 标签
     * 返回 Semi AIChatDialogue 兼容的 FunctionToolCall 格式
     */
    parseQwenToolCalls = (output: string, isStreaming: boolean = false): Array<{
        type: 'function_call';
        call_id: string;
        name: string;
        arguments: string;
        status: string
    }> | null => {
        // 匹配已闭合的 <tool_call>...</tool_call> 标签
        const closedRegex = /<tool_call>\s*([\s\S]*?)\s*<\/tool_call>/g;
        const toolCalls: Array<{
            type: 'function_call';
            call_id: string;
            name: string;
            arguments: string;
            status: string
        }> = [];
        
        let match;
        while ((match = closedRegex.exec(output)) !== null) {
            try {
                const parsed = JSON.parse(match[1].trim());
                toolCalls.push({
                    type: 'function_call',
                    call_id: `call_${getUuidv4()}`,
                    name: parsed.name,
                    arguments: typeof parsed.arguments === 'object' 
                        ? JSON.stringify(parsed.arguments) 
                        : (parsed.arguments || '{}'),
                    status: isStreaming ? 'in_progress' : 'completed'
                });
            } catch (e) {
                // 解析失败，跳过这个 tool call
                console.warn('Failed to parse tool call:', match[1]);
            }
        }
        
        // 检查是否有未闭合的 <tool_call> 标签（正在生成中）
        const openMatch = output.match(/<tool_call>(?![\s\S]*<\/tool_call>)([\s\S]*)$/);
        if (openMatch && isStreaming) {
            // 正在生成中的 tool call，尝试部分解析
            try {
                const partialContent = openMatch[1].trim();
                if (partialContent) {
                    toolCalls.push({
                        type: 'function_call',
                        call_id: `call_pending_${Date.now()}`,
                        name: '解析中...',
                        arguments: partialContent,
                        status: 'in_progress'
                    });
                }
            } catch (e) {
                // 忽略解析错误
            }
        }
        
        return toolCalls.length > 0 ? toolCalls : null;
    };

    /**
     * 移除 <tool_call> 标签后的纯文本内容
     */
    getContentWithoutToolCalls = (output: string): string => {
        return output
            .replace(/<tool_call>[\s\S]*?<\/tool_call>/g, '')
            .replace(/<tool_call>[\s\S]*$/, '') // 移除未闭合的 tool_call
            .trim();
    };

    /**
     * 解析包含 <think> 和 <tool_call> 标签的内容，转换为 AIChatDialogue 格式（支持流式）
     */
    parseContentWithToolCalls = (text: string, isStreaming: boolean = false): Message['content'] => {
        const contentItems: any[] = [];
        
        // 1. 先解析 tool calls
        const toolCalls = this.parseQwenToolCalls(text, isStreaming);
        
        // 2. 获取移除 tool_call 后的文本
        const textWithoutToolCalls = this.getContentWithoutToolCalls(text);
        
        // 3. 解析 thinking 内容
        if (textWithoutToolCalls) {
            const thinkingContent = this.parseThinkingContent(textWithoutToolCalls, isStreaming);
            if (Array.isArray(thinkingContent)) {
                contentItems.push(...thinkingContent);
            } else if (thinkingContent) {
                contentItems.push({
                    type: 'message',
                    content: [{ type: 'output_text', text: thinkingContent }],
                    status: isStreaming ? 'in_progress' : 'completed',
                });
            }
        }
        
        // 4. 添加 tool calls
        if (toolCalls && toolCalls.length > 0) {
            contentItems.push(...toolCalls);
        }
        
        return contentItems.length > 0 ? contentItems : text;
    };

    /**
     * 解析包含 <think> 标签的内容，转换为 AIChatDialogue 格式（支持流式）
     */
    parseThinkingContent = (text: string, isStreaming: boolean = false): Message['content'] => {
        const contentItems: any[] = [];

        // 匹配已闭合的 <think>...</think> 标签
        const closedThinkRegex = /<think>([\s\S]*?)<\/think>/gi;
        const closedMatches = Array.from(text.matchAll(closedThinkRegex));

        // 检查是否有未闭合的 <think> 标签（正在思考中）
        const openThinkMatch = text.match(/<think>(?![\s\S]*<\/think>)([\s\S]*)$/i);
        const hasUnclosedThink = openThinkMatch !== null;

        // 如果没有任何 think 标签
        if (closedMatches.length === 0 && !hasUnclosedThink) {
            return text;
        }

        let lastIndex = 0;

        // 处理所有已闭合的 thinking 内容
        closedMatches.forEach((match) => {
            const thinkContent = match[1].trim();
            const matchStart = match.index!;
            const matchEnd = matchStart + match[0].length;

            // 添加 thinking 标签之前的文本（如果有）
            if (matchStart > lastIndex) {
                const beforeText = text.substring(lastIndex, matchStart).trim();
                if (beforeText) {
                    contentItems.push({
                        type: 'message',
                        content: [{ type: 'output_text', text: beforeText }],
                        status: 'completed',
                    });
                }
            }

            // 添加已完成的 thinking 块
            if (thinkContent) {
                contentItems.push({
                    type: 'reasoning',
                    status: 'completed',
                    summary: [{ type: 'summary_text', text: thinkContent }],
                });
            }

            lastIndex = matchEnd;
        });

        // 处理未闭合的 thinking 内容（流式显示）
        if (hasUnclosedThink && openThinkMatch) {
            const unclosedStart = text.lastIndexOf('<think>');

            // 添加未闭合 think 标签之前的文本
            if (unclosedStart > lastIndex) {
                const beforeText = text.substring(lastIndex, unclosedStart).trim();
                if (beforeText) {
                    contentItems.push({
                        type: 'message',
                        content: [{ type: 'output_text', text: beforeText }],
                        status: 'completed',
                    });
                }
            }

            // 提取正在生成的思考内容
            const thinkingContent = openThinkMatch[1].trim();
            contentItems.push({
                type: 'reasoning',
                status: isStreaming ? 'in_progress' : 'completed',
                summary: [{ type: 'summary_text', text: thinkingContent || '思考中...' }],
            });
        } else {
            // 添加最后一个闭合标签之后的文本
            const afterText = text.substring(lastIndex).trim();
            if (afterText) {
                contentItems.push({
                    type: 'message',
                    content: [{ type: 'output_text', text: afterText }],
                    status: isStreaming ? 'in_progress' : 'completed',
                });
            }
        }

        return contentItems.length > 0 ? contentItems : text;
    };

    /**
     * 初始化引擎（单例模式，多个组件共享同一个模型）
     */
    initEngine = async (config: InitEngineConfig) => {
        try {
            this._adapter.setLoading(true);
            this._adapter.setError(null);
            this._adapter.setInitProgress?.(null);

            // 创建进度回调函数
            const progressCallback: InitProgressCallback = (report: InitProgressReport) => {
                // 更新进度状态
                this._adapter.setInitProgress?.(report);
                // 同时调用用户自定义的回调
                const originalCallback = config.engineConfig?.initProgressCallback;
                if (originalCallback) {
                    originalCallback(report);
                }
            };

            // 合并 engineConfig，添加进度回调
            // 注意：如果用户已经提供了 initProgressCallback，我们需要同时调用两个回调
            const originalCallback = config.engineConfig?.initProgressCallback;
            const engineConfigWithProgress = {
                ...config.engineConfig,
                initProgressCallback: (report: InitProgressReport) => {
                    // 调用我们的进度回调
                    progressCallback(report);
                    // 调用用户自定义的回调（如果存在）
                    if (originalCallback) {
                        originalCallback(report);
                    }
                },
            };

            // 使用 engineManager 获取或创建 engine（单例模式）
            // 注意：即使 engine 已经缓存，web-llm 在初始化时（加载到 GPU 等）也会触发进度回调
            // 所以进度回调会在 createEngine 过程中被调用
            const engine = await engineManager.getOrCreateEngine({
                ...config,
                engineConfig: engineConfigWithProgress,
            });

            this._adapter.setEngine(engine);
            this._adapter.setLoading(false);
            this._adapter.setInitProgress?.(null);

            // 初始化系统消息
            const props = this.getProps();
            const { systemPrompt, chatOpts } = props;
            const modelId = config.modelId; // 使用传入的 modelId（已处理默认值）
            let finalSystemPrompt = systemPrompt || getDefaultSystemPrompt();
            
            // 如果有 tools 配置且是 Qwen 模型，将 tools 信息注入到 system prompt
            // 因为 webLLM 的 MLC 编译配置中 use_function_calling: false
            const chatOptsArray = Array.isArray(chatOpts) ? chatOpts : chatOpts ? [chatOpts] : [];
            const firstChatOpts = chatOptsArray[0] || {};
            const { tools } = firstChatOpts as any;
            
            if (tools && tools.length > 0 && this.isQwenModel(modelId)) {
                finalSystemPrompt = this.buildQwenSystemPromptWithTools(finalSystemPrompt, tools);
            }
            
            const systemMessage: WebLLMMessage = {
                role: 'system',
                content: finalSystemPrompt,
            };
            
            // 获取现有的 messages（可能包含 defaultMessages）
            const existingMessages = this._adapter.getState('messages') || [];
            const existingWebLLMMessages = existingMessages.filter((msg: any) => 
                msg.role === 'user' || msg.role === 'assistant'
            );
            
            // 合并系统消息和现有消息
            this._adapter.setMessages([systemMessage, ...existingWebLLMMessages]);
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Unknown error');
            this._adapter.setError(err.message);
            this._adapter.setLoading(false);
            this._adapter.setInitProgress?.(null);
            this._adapter.notifyError(err);
            throw err;
        }
    };

    /**
     * 处理流式聊天
     */
    handleStreamChat = async (messageContent: MessageContent) => {
        const engine = this._adapter.getState('engine');
        const messages = this._adapter.getState('messages') || [];
        const chats = this._adapter.getState('chats') || [];
        const isGenerating = this._adapter.getState('isGenerating');

        // 从 MessageContent 中提取文本
        let inputText = this.extractTextFromMessageContent(messageContent);

        if (!engine || !inputText || isGenerating) {
            return;
        }

        // 应用 onUserMessage 回调
        const props = this.getProps();
        if (props.onUserMessage) {
            try {
                const modifiedContent = props.onUserMessage(inputText, messages);
                if (modifiedContent !== undefined && modifiedContent !== null) {
                    inputText = modifiedContent || inputText;
                }
            } catch (error) {
                // 如果回调出错，使用原始输入
                console.warn('onUserMessage callback error:', error);
            }
        }

        // 创建 AbortController 用于停止生成
        const abortController = new AbortController();
        this._adapter.setAbortController(abortController);

        // 使用 chatInputToMessage 转换消息格式
        const userChatMessage: Message = {
            ...chatInputToMessage(messageContent),
            id: this.generateId(),
            createdAt: Date.now(),
            status: 'completed',
        };
        // 更新用户消息内容为修改后的内容
        // chatInputToMessage 返回的 content 可能是数组格式，需要统一处理
        if (typeof userChatMessage.content === 'string') {
            userChatMessage.content = inputText;
        } else if (Array.isArray(userChatMessage.content)) {
            // 如果是数组格式，需要更新数组中的文本内容
            const updatedContent = userChatMessage.content.map((item: any) => {
                if (item.type === 'message' && Array.isArray(item.content)) {
                    // 分离文本项和其他项（图片、文件等）
                    const textItems: any[] = [];
                    const otherItems: any[] = [];
                    
                    item.content.forEach((contentItem: any) => {
                        if (contentItem.type === 'input_text') {
                            textItems.push(contentItem);
                        } else {
                            otherItems.push(contentItem);
                        }
                    });
                    
                    // 将所有文本项合并为一个，使用修改后的文本
                    const newContent = [];
                    if (textItems.length > 0 && inputText) {
                        newContent.push({
                            type: 'input_text',
                            text: inputText,
                        });
                    }
                    // 保留其他类型的项
                    newContent.push(...otherItems);
                    
                    return {
                        ...item,
                        content: newContent,
                    };
                }
                return item;
            });
            userChatMessage.content = updatedContent;
        }

        // 添加用户消息到 WebLLM 格式（历史记录中保存原始消息，不带 /no_think）
        const userMessage: WebLLMMessage = { role: 'user', content: inputText };
        const updatedMessages = [...messages, userMessage];
        const updatedChats = [...chats, userChatMessage];

        // 创建助手消息占位符（流式更新）
        const assistantId = this.generateId();
        const assistantChatMessage: Message = {
            role: 'assistant',
            id: assistantId,
            content: '',
            createdAt: Date.now(),
            status: 'in_progress',
        };
        const chatsWithAssistant = [...updatedChats, assistantChatMessage];

        this._adapter.setMessages(updatedMessages);
        this._adapter.setChats(chatsWithAssistant);
        this._adapter.setIsGenerating(true);

        try {
            // 应用 beforeAIInput 回调
            let customResponse: string | undefined;
            if (props.beforeAIInput) {
                try {
                    const result = await props.beforeAIInput(updatedMessages);
                    if (result && result.trim() !== '') {
                        customResponse = result;
                    }
                } catch (error) {
                    // 如果回调出错，继续正常调用AI
                    console.warn('beforeAIInput callback error:', error);
                }
            }

            // 如果 beforeAIInput 返回了自定义回复，跳过AI调用
            if (customResponse !== undefined) {
                // 获取配置以判断是否需要解析 tool calls
                const { modelId, chatOpts } = props;
                const isQwen = modelId ? this.isQwenModel(modelId) : false;
                const chatOptsArray = Array.isArray(chatOpts) ? chatOpts : chatOpts ? [chatOpts] : [];
                const firstChatOpts = chatOptsArray[0] || {};
                const { tools } = firstChatOpts as any;
                const hasTools = tools && tools.length > 0;

                // 解析自定义回复内容
                const hasToolCallInReply = customResponse.includes('<tool_call>');
                const parsedContent = (hasToolCallInReply && hasTools && isQwen)
                    ? this.parseContentWithToolCalls(customResponse, false)
                    : this.parseThinkingContent(customResponse, false);

                // 更新助手消息为完成状态
                const finalChats = this._adapter.getState('chats') || [];
                const updatedFinalChats = [...finalChats];
                const assistantIndex = updatedFinalChats.findIndex((msg) => msg.id === assistantId);
                if (assistantIndex !== -1) {
                    updatedFinalChats[assistantIndex] = {
                        ...updatedFinalChats[assistantIndex],
                        content: parsedContent,
                        status: 'completed',
                    };
                }

                this._adapter.setMessages([...updatedMessages, { role: 'assistant', content: customResponse }]);
                this._adapter.setChats(updatedFinalChats);
                this._adapter.setIsGenerating(false);
                this._adapter.setAbortController(null);
                return;
            }

            // 从 props 获取配置，判断是否需要特殊处理 tool calling
            const { modelId, chatOpts } = props;
            const isQwen = modelId ? this.isQwenModel(modelId) : false;
            
            // 获取 tools 配置（用于判断是否需要解析 tool_call 输出）
            const chatOptsArray = Array.isArray(chatOpts) ? chatOpts : chatOpts ? [chatOpts] : [];
            const firstChatOpts = chatOptsArray[0] || {};
            const { tools } = firstChatOpts as any;
            const hasTools = tools && tools.length > 0;

            // 获取深度思考开关状态（从 state 中获取，因为这是由组件内部管理的状态）
            const enableDeepThink = this._adapter.getState('enableDeepThink');
            
            // 创建发送给模型的消息列表
            // 如果关闭深度思考，在最后一条用户消息末尾添加 /no_think 标签（Qwen3 模型支持）
            // 注意：这里需要深拷贝消息列表，避免修改历史记录
            const messagesForRequest = updatedMessages.map((msg, index) => {
                // 只处理最后一条用户消息
                if (index === updatedMessages.length - 1 && msg.role === 'user' && enableDeepThink === false) {
                    return {
                        ...msg,
                        content: `${msg.content} /no_think`
                    };
                }
                return msg;
            });
            
            // 创建流式聊天请求
            // 注意：对于 Qwen 模型，不传 tools 参数给 webLLM（因为 webLLM 会报 UnsupportedModelIdError）
            // tools 信息已经在 initEngine 时注入到 system prompt 中了
            const requestParams: any = {
                messages: messagesForRequest,
                temperature: 1,
                stream: true,
                stream_options: { include_usage: true },
            };

            const chunks = await engine.chat.completions.create(requestParams);

            // 获取 stream 配置
            const streamEnabled = props.stream !== false; // 默认为 true

            let reply = '';
            for await (const chunk of chunks) {
                // 检查是否被中止
                if (abortController.signal.aborted) {
                    break;
                }

                const deltaContent = chunk.choices[0]?.delta.content || '';
                if (deltaContent) {
                    reply += deltaContent;

                    // 如果 stream 为 false，不更新UI，只收集内容
                    if (streamEnabled) {
                        // 检测是否包含特殊标签（<think> 或 <tool_call>），流式解析
                        let displayContent: string | any[] = reply;
                        const hasThinkTag = reply.includes('<think>');
                        const hasToolCallTag = reply.includes('<tool_call>');
                        
                        if (hasThinkTag || (hasToolCallTag && hasTools && isQwen)) {
                            // 使用流式解析，支持显示未闭合的内容
                            try {
                                const parsed = hasToolCallTag && hasTools && isQwen
                                    ? this.parseContentWithToolCalls(reply, true)
                                    : this.parseThinkingContent(reply, true);
                                if (Array.isArray(parsed)) {
                                    displayContent = parsed;
                                }
                            } catch (e) {
                                // 解析失败时继续使用原始文本
                                displayContent = reply;
                            }
                        }

                        // 更新助手消息内容
                        const currentChats = this._adapter.getState('chats') || [];
                        const updatedChatsWithReply = [...currentChats];
                        const assistantIndex = updatedChatsWithReply.findIndex((msg) => msg.id === assistantId);
                        if (assistantIndex !== -1) {
                            updatedChatsWithReply[assistantIndex] = {
                                ...updatedChatsWithReply[assistantIndex],
                                content: displayContent,
                                status: 'in_progress',
                            };
                        }
                        this._adapter.setChats(updatedChatsWithReply);
                    }
                }
            }

            // 获取完整回复
            const fullReply = await engine.getMessage();
            let finalReply = reply || fullReply;

            // 应用 afterAIInput 回调
            if (props.afterAIInput) {
                try {
                    const modifiedContent = await props.afterAIInput(finalReply, [...updatedMessages, { role: 'assistant', content: finalReply }]);
                    if (modifiedContent !== undefined && modifiedContent !== null) {
                        finalReply = modifiedContent;
                    }
                } catch (error) {
                    // 如果回调出错，使用原始回复
                    console.warn('afterAIInput callback error:', error);
                }
            }

            // 解析内容并转换为 AIChatDialogue 格式（非流式，标记为完成）
            // 如果有 tools 且是 Qwen 模型，使用 parseContentWithToolCalls 同时处理 thinking 和 tool_calls
            const hasToolCallInReply = finalReply.includes('<tool_call>');
            const parsedContent = (hasToolCallInReply && hasTools && isQwen)
                ? this.parseContentWithToolCalls(finalReply, false)
                : this.parseThinkingContent(finalReply, false);

            // 如果 stream 为 false，现在更新UI
            if (!streamEnabled) {
                const currentChats = this._adapter.getState('chats') || [];
                const updatedChatsWithReply = [...currentChats];
                const assistantIndex = updatedChatsWithReply.findIndex((msg) => msg.id === assistantId);
                if (assistantIndex !== -1) {
                    updatedChatsWithReply[assistantIndex] = {
                        ...updatedChatsWithReply[assistantIndex],
                        content: parsedContent,
                        status: abortController.signal.aborted ? 'cancelled' : 'completed',
                    };
                }
                this._adapter.setChats(updatedChatsWithReply);
            }

            // 更新助手消息为完成状态（仅在 stream=true 时执行，stream=false 时已在上面更新）
            if (streamEnabled) {
                const finalChats = this._adapter.getState('chats') || [];
                const updatedFinalChats = [...finalChats];
                const assistantIndex = updatedFinalChats.findIndex((msg) => msg.id === assistantId);
                if (assistantIndex !== -1) {
                    updatedFinalChats[assistantIndex] = {
                        ...updatedFinalChats[assistantIndex],
                        content: parsedContent,
                        status: abortController.signal.aborted ? 'cancelled' : 'completed',
                    };
                }
                this._adapter.setChats(updatedFinalChats);
            } else {
                // stream=false 时，只需要更新状态为完成（内容已在上面更新）
                const finalChats = this._adapter.getState('chats') || [];
                const updatedFinalChats = [...finalChats];
                const assistantIndex = updatedFinalChats.findIndex((msg) => msg.id === assistantId);
                if (assistantIndex !== -1) {
                    updatedFinalChats[assistantIndex] = {
                        ...updatedFinalChats[assistantIndex],
                        status: abortController.signal.aborted ? 'cancelled' : 'completed',
                    };
                }
                this._adapter.setChats(updatedFinalChats);
            }

            this._adapter.setMessages([...updatedMessages, { role: 'assistant', content: finalReply }]);
            this._adapter.setIsGenerating(false);
            this._adapter.setAbortController(null);
            
            // 如果检测到 tool calls，处理工具调用
            if (hasToolCallInReply && hasTools && isQwen) {
                const toolCalls = this.parseQwenToolCalls(finalReply, false);
                if (toolCalls && toolCalls.length > 0) {
                    const props = this.getProps();
                    
                    // 优先使用 handleToolCall（方案2：自动处理）
                    if (props.handleToolCall) {
                        try {
                            const toolResults = await props.handleToolCall(toolCalls, finalReply);
                            if (toolResults && toolResults.length > 0) {
                                // 自动发送工具执行结果
                                await this.sendToolResults(toolResults);
                            }
                        } catch (error) {
                            // 如果 handleToolCall 出错，显示错误但不中断流程
                            const err = error instanceof Error ? error : new Error('工具调用处理失败');
                            this._adapter.setError(err.message);
                            this._adapter.notifyError(err);
                        }
                    } else {
                        // 向后兼容：如果没有 handleToolCall，使用 onToolCall（方案1：手动处理）
                        this._adapter.notifyToolCall?.(toolCalls, finalReply);
                    }
                }
            }
        } catch (error) {
            // 更新助手消息为失败状态
            const errorChats = this._adapter.getState('chats') || [];
            const updatedErrorChats = [...errorChats];
            const assistantIndex = updatedErrorChats.findIndex((msg) => msg.id === assistantId);
            if (assistantIndex !== -1) {
                updatedErrorChats[assistantIndex] = {
                    ...updatedErrorChats[assistantIndex],
                    status: 'failed',
                };
            }

            const err = error instanceof Error ? error : new Error('聊天出错');
            this._adapter.setError(err.message);
            this._adapter.setChats(updatedErrorChats);
            this._adapter.setIsGenerating(false);
            this._adapter.setAbortController(null);
            this._adapter.notifyError(err);
        }
    };

    /**
     * 发送 Tool 执行结果，让 AI 继续对话
     * @param toolResults Tool 执行结果数组
     */
    sendToolResults = async (toolResults: ToolCallResult[]) => {
        const engine = this._adapter.getState('engine');
        const messages = this._adapter.getState('messages') || [];
        const chats = this._adapter.getState('chats') || [];
        const isGenerating = this._adapter.getState('isGenerating');

        if (!engine || isGenerating || toolResults.length === 0) {
            return;
        }

        // 创建 AbortController
        const abortController = new AbortController();
        this._adapter.setAbortController(abortController);

        // 构建 tool response 消息（Qwen 格式）
        const toolResponseContent = toolResults.map(result => 
            `<tool_response>\n${result.result}\n</tool_response>`
        ).join('\n');

        // 添加 tool response 到消息历史
        const toolResponseMessage: WebLLMMessage = {
            role: 'user', // Qwen chat_template 中 tool response 是作为 user 消息的一部分
            content: toolResponseContent
        };
        const updatedMessages = [...messages, toolResponseMessage];

        // 创建 tool response 的 chat 消息（用于显示）
        const toolResponseChatId = this.generateId();
        const toolResponseChat: Message = {
            role: 'assistant', // 在 UI 上显示为助手消息的一部分
            id: toolResponseChatId,
            content: toolResults.map(result => ({
                type: 'function_call',
                call_id: result.call_id,
                name: result.name,
                arguments: result.arguments,
                result: result.result,
                status: result.status === 'success' ? 'completed' : 'failed'
            })),
            createdAt: Date.now(),
            status: 'completed',
        };

        // 创建助手回复占位符
        const assistantId = this.generateId();
        const assistantChatMessage: Message = {
            role: 'assistant',
            id: assistantId,
            content: '',
            createdAt: Date.now(),
            status: 'in_progress',
        };

        const updatedChats = [...chats, assistantChatMessage];

        this._adapter.setMessages(updatedMessages);
        this._adapter.setChats(updatedChats);
        this._adapter.setIsGenerating(true);

        try {
            const props = this.getProps();
            
            // 应用 beforeAIInput 回调
            let customResponse: string | undefined;
            if (props.beforeAIInput) {
                try {
                    const result = await props.beforeAIInput(updatedMessages);
                    if (result && result.trim() !== '') {
                        customResponse = result;
                    }
                } catch (error) {
                    // 如果回调出错，继续正常调用AI
                    console.warn('beforeAIInput callback error:', error);
                }
            }

            // 如果 beforeAIInput 返回了自定义回复，跳过AI调用
            if (customResponse !== undefined) {
                // 获取配置以判断是否需要解析 tool calls
                const { modelId, chatOpts } = props;
                const isQwen = modelId ? this.isQwenModel(modelId) : false;
                const chatOptsArray = Array.isArray(chatOpts) ? chatOpts : chatOpts ? [chatOpts] : [];
                const firstChatOpts = chatOptsArray[0] || {};
                const { tools } = firstChatOpts as any;
                const hasTools = tools && tools.length > 0;

                // 解析自定义回复内容
                const hasToolCallInReply = customResponse.includes('<tool_call>');
                const parsedContent = (hasToolCallInReply && hasTools && isQwen)
                    ? this.parseContentWithToolCalls(customResponse, false)
                    : this.parseThinkingContent(customResponse, false);

                // 更新助手消息为完成状态
                const finalChats = this._adapter.getState('chats') || [];
                const updatedFinalChats = [...finalChats];
                const assistantIndex = updatedFinalChats.findIndex((msg) => msg.id === assistantId);
                if (assistantIndex !== -1) {
                    updatedFinalChats[assistantIndex] = {
                        ...updatedFinalChats[assistantIndex],
                        content: parsedContent,
                        status: 'completed',
                    };
                }

                this._adapter.setMessages([...updatedMessages, { role: 'assistant', content: customResponse }]);
                this._adapter.setChats(updatedFinalChats);
                this._adapter.setIsGenerating(false);
                this._adapter.setAbortController(null);
                return;
            }

            const { modelId, chatOpts } = props;
            const isQwen = modelId ? this.isQwenModel(modelId) : false;
            const chatOptsArray = Array.isArray(chatOpts) ? chatOpts : chatOpts ? [chatOpts] : [];
            const firstChatOpts = chatOptsArray[0] || {};
            const { tools } = firstChatOpts as any;
            const hasTools = tools && tools.length > 0;

            // 获取深度思考开关状态
            const enableDeepThink = this._adapter.getState('enableDeepThink');
            
            // 创建发送给模型的消息列表
            // 如果关闭深度思考，在最后一条用户消息末尾添加 /no_think 标签
            // 注意：这里需要深拷贝消息列表，避免修改历史记录
            const messagesForRequest = updatedMessages.map((msg, index) => {
                // 只处理最后一条用户消息（tool response）
                if (index === updatedMessages.length - 1 && msg.role === 'user' && enableDeepThink === false) {
                    return {
                        ...msg,
                        content: `${msg.content} /no_think`
                    };
                }
                return msg;
            });
            
            const requestParams: any = {
                messages: messagesForRequest,
                temperature: 1,
                stream: true,
                stream_options: { include_usage: true },
            };

            const chunks = await engine.chat.completions.create(requestParams);

            // 获取 stream 配置
            const streamEnabled = props.stream !== false; // 默认为 true

            let reply = '';
            for await (const chunk of chunks) {
                if (abortController.signal.aborted) {
                    break;
                }

                const deltaContent = chunk.choices[0]?.delta.content || '';
                if (deltaContent) {
                    reply += deltaContent;

                    // 如果 stream 为 false，不更新UI，只收集内容
                    if (streamEnabled) {
                        let displayContent: string | any[] = reply;
                        const hasThinkTag = reply.includes('<think>');
                        const hasToolCallTag = reply.includes('<tool_call>');
                        
                        if (hasThinkTag || (hasToolCallTag && hasTools && isQwen)) {
                            try {
                                const parsed = hasToolCallTag && hasTools && isQwen
                                    ? this.parseContentWithToolCalls(reply, true)
                                    : this.parseThinkingContent(reply, true);
                                if (Array.isArray(parsed)) {
                                    displayContent = parsed;
                                }
                            } catch (e) {
                                displayContent = reply;
                            }
                        }

                        const currentChats = this._adapter.getState('chats') || [];
                        const updatedChatsWithReply = [...currentChats];
                        const assistantIndex = updatedChatsWithReply.findIndex((msg) => msg.id === assistantId);
                        if (assistantIndex !== -1) {
                            updatedChatsWithReply[assistantIndex] = {
                                ...updatedChatsWithReply[assistantIndex],
                                content: displayContent,
                                status: 'in_progress',
                            };
                        }
                        this._adapter.setChats(updatedChatsWithReply);
                    }
                }
            }

            const fullReply = await engine.getMessage();
            let finalReply = reply || fullReply;

            // 应用 afterAIInput 回调
            if (props.afterAIInput) {
                try {
                    const modifiedContent = await props.afterAIInput(finalReply, [...updatedMessages, { role: 'assistant', content: finalReply }]);
                    if (modifiedContent !== undefined && modifiedContent !== null) {
                        finalReply = modifiedContent;
                    }
                } catch (error) {
                    // 如果回调出错，使用原始回复
                    console.warn('afterAIInput callback error:', error);
                }
            }

            const hasToolCallInReply = finalReply.includes('<tool_call>');
            const parsedContent = (hasToolCallInReply && hasTools && isQwen)
                ? this.parseContentWithToolCalls(finalReply, false)
                : this.parseThinkingContent(finalReply, false);

            // 如果 stream 为 false，现在更新UI
            if (!streamEnabled) {
                const currentChats = this._adapter.getState('chats') || [];
                const updatedChatsWithReply = [...currentChats];
                const assistantIndex = updatedChatsWithReply.findIndex((msg) => msg.id === assistantId);
                if (assistantIndex !== -1) {
                    updatedChatsWithReply[assistantIndex] = {
                        ...updatedChatsWithReply[assistantIndex],
                        content: parsedContent,
                        status: abortController.signal.aborted ? 'cancelled' : 'completed',
                    };
                }
                this._adapter.setChats(updatedChatsWithReply);
            }

            // 更新助手消息为完成状态（仅在 stream=true 时执行，stream=false 时已在上面更新）
            if (streamEnabled) {
                const finalChats = this._adapter.getState('chats') || [];
                const updatedFinalChats = [...finalChats];
                const assistantIndex = updatedFinalChats.findIndex((msg) => msg.id === assistantId);
                if (assistantIndex !== -1) {
                    updatedFinalChats[assistantIndex] = {
                        ...updatedFinalChats[assistantIndex],
                        content: parsedContent,
                        status: abortController.signal.aborted ? 'cancelled' : 'completed',
                    };
                }
                this._adapter.setChats(updatedFinalChats);
            } else {
                // stream=false 时，只需要更新状态为完成（内容已在上面更新）
                const finalChats = this._adapter.getState('chats') || [];
                const updatedFinalChats = [...finalChats];
                const assistantIndex = updatedFinalChats.findIndex((msg) => msg.id === assistantId);
                if (assistantIndex !== -1) {
                    updatedFinalChats[assistantIndex] = {
                        ...updatedFinalChats[assistantIndex],
                        status: abortController.signal.aborted ? 'cancelled' : 'completed',
                    };
                }
                this._adapter.setChats(updatedFinalChats);
            }

            this._adapter.setMessages([...updatedMessages, { role: 'assistant', content: finalReply }]);
            this._adapter.setIsGenerating(false);
            this._adapter.setAbortController(null);

            // 如果还有 tool calls，继续处理工具调用
            if (hasToolCallInReply && hasTools && isQwen) {
                const toolCalls = this.parseQwenToolCalls(finalReply, false);
                if (toolCalls && toolCalls.length > 0) {
                    const props = this.getProps();
                    
                    // 优先使用 handleToolCall（方案2：自动处理）
                    if (props.handleToolCall) {
                        try {
                            const toolResults = await props.handleToolCall(toolCalls, finalReply);
                            if (toolResults && toolResults.length > 0) {
                                // 自动发送工具执行结果（递归调用，支持多轮工具调用）
                                await this.sendToolResults(toolResults);
                            }
                        } catch (error) {
                            // 如果 handleToolCall 出错，显示错误但不中断流程
                            const err = error instanceof Error ? error : new Error('工具调用处理失败');
                            this._adapter.setError(err.message);
                            this._adapter.notifyError(err);
                        }
                    } else {
                        // 向后兼容：如果没有 handleToolCall，使用 onToolCall（方案1：手动处理）
                        this._adapter.notifyToolCall?.(toolCalls, finalReply);
                    }
                }
            }
        } catch (error) {
            const errorChats = this._adapter.getState('chats') || [];
            const updatedErrorChats = [...errorChats];
            const assistantIndex = updatedErrorChats.findIndex((msg) => msg.id === assistantId);
            if (assistantIndex !== -1) {
                updatedErrorChats[assistantIndex] = {
                    ...updatedErrorChats[assistantIndex],
                    status: 'failed',
                };
            }

            const err = error instanceof Error ? error : new Error('聊天出错');
            this._adapter.setError(err.message);
            this._adapter.setChats(updatedErrorChats);
            this._adapter.setIsGenerating(false);
            this._adapter.setAbortController(null);
            this._adapter.notifyError(err);
        }
    };

    /**
     * 停止生成
     */
    stopGenerate = () => {
        const abortController = this._adapter.getState('abortController');
        if (abortController) {
            abortController.abort();
        }
        this._adapter.setIsGenerating(false);
        this._adapter.setAbortController(null);
    };

    /**
     * 清理资源
     * @param modelId 模型ID，用于释放引用计数
     * @param unloadWhenNoRef 当引用计数为0时是否卸载模型，默认 false
     */
    destroy = async (modelId?: string | string[], unloadWhenNoRef: boolean = false) => {
        // 释放 engine 引用
        if (modelId) {
            await engineManager.releaseEngine(modelId, unloadWhenNoRef);
        }
        this._adapter.setEngine(null);
        this._adapter.setAbortController(null);
    };
}

