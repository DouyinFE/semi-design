import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { CreateWebWorkerMLCEngine, CreateMLCEngine } from '@mlc-ai/web-llm';
import type {
    WebWorkerMLCEngine,
    MLCEngineConfig,
    ChatOptions,
    InitProgressCallback,
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
 * BrowserAI Foundation Adapter
 */
export interface BrowserAIAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    setEngine: (engine: WebWorkerMLCEngine | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setChats: (chats: Message[]) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    setAbortController: (controller: AbortController | null) => void;
    setMessages: (messages: WebLLMMessage[]) => void;
    setReferences: (references: any[]) => void;
    notifyError: (error: Error) => void;
    notifyInitProgress?: (progress: any) => void
}

/**
 * BrowserAI Foundation
 * 包含所有业务逻辑，不依赖 React/DOM
 */
export default class BrowserAIFoundation extends BaseFoundation<BrowserAIAdapter> {
    private messageIdCounter = 0;

    constructor(adapter: BrowserAIAdapter) {
        super({ ...BrowserAIFoundation.defaultAdapter, ...adapter });
    }

    static get defaultAdapter() {
        return {
            setEngine: () => {},
            setLoading: () => {},
            setError: () => {},
            setChats: () => {},
            setIsGenerating: () => {},
            setAbortController: () => {},
            setMessages: () => {},
            setReferences: () => {},
            notifyError: () => {},
            notifyInitProgress: () => {},
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

            // 使用 engineManager 获取或创建 engine（单例模式）
            const engine = await engineManager.getOrCreateEngine(config);

            this._adapter.setEngine(engine);
            this._adapter.setLoading(false);

            // 初始化系统消息
            const { systemPrompt } = this.getProps();
            const systemMessage: WebLLMMessage = {
                role: 'system',
                content: systemPrompt || 'You are a helpful AI assistant.',
            };
            this._adapter.setMessages([systemMessage]);
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Unknown error');
            this._adapter.setError(err.message);
            this._adapter.setLoading(false);
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
        const references = this._adapter.getState('references') || [];
        const isGenerating = this._adapter.getState('isGenerating');

        // 从 MessageContent 中提取文本
        const inputText = this.extractTextFromMessageContent(messageContent);

        if (!engine || !inputText || isGenerating) {
            return;
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
            references: references.length > 0 ? references : undefined,
        };

        // 添加用户消息到 WebLLM 格式（仅文本）
        const userMessage: WebLLMMessage = { role: 'user', content: inputText };
        const updatedMessages = [...messages, userMessage];
        const updatedChats = [...chats, userChatMessage];

        // 清空引用
        this._adapter.setReferences([]);

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
            // 创建流式聊天请求
            const chunks = await engine.chat.completions.create({
                messages: updatedMessages,
                temperature: 1,
                stream: true,
                stream_options: { include_usage: true },
            });

            let reply = '';
            for await (const chunk of chunks) {
                // 检查是否被中止
                if (abortController.signal.aborted) {
                    break;
                }

                const deltaContent = chunk.choices[0]?.delta.content || '';
                if (deltaContent) {
                    reply += deltaContent;

                    // 检测是否包含 <think> 标签（包括未闭合的），流式解析思考过程
                    let displayContent: string | any[] = reply;
                    const hasThinkTag = reply.includes('<think>');
                    if (hasThinkTag) {
                        // 使用流式解析，支持显示未闭合的思考内容
                        try {
                            const parsed = this.parseThinkingContent(reply, true);
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

            // 获取完整回复
            const fullReply = await engine.getMessage();
            const finalReply = reply || fullReply;

            // 解析 thinking 内容并转换为 AIChatDialogue 格式（非流式，标记为完成）
            const parsedContent = this.parseThinkingContent(finalReply, false);

            // 更新助手消息为完成状态
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

            this._adapter.setMessages([...updatedMessages, { role: 'assistant', content: finalReply }]);
            this._adapter.setChats(updatedFinalChats);
            this._adapter.setIsGenerating(false);
            this._adapter.setAbortController(null);
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

