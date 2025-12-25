import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import type {
    WebWorkerMLCEngine,
    MLCEngineConfig,
    ChatOptions,
    InitProgressCallback,
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
     * 初始化引擎
     * 注意：实际的引擎创建逻辑在 UI 层完成，这里只负责设置状态
     * UI 层创建引擎后调用 initWithEngine 方法
     */
    init = async () => {
        // 这个方法由 UI 层调用，实际的引擎创建在 UI 层完成
        // 因为 Worker 的创建和动态导入需要在浏览器环境中进行
    };

    /**
     * 初始化引擎（由 UI 层调用，传入已创建的引擎）
     */
    initWithEngine = async (engine: WebWorkerMLCEngine) => {
        try {
            this._adapter.setEngine(engine);
            this._adapter.setLoading(false);
            this._adapter.setError(null);

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
     */
    destroy = async () => {
        const engine = this._adapter.getState('engine');
        if (engine && typeof engine.unload === 'function') {
            try {
                await engine.unload();
            } catch (error) {
                // 忽略卸载错误
            }
        }
        this._adapter.setEngine(null);
        this._adapter.setAbortController(null);
    };
}

