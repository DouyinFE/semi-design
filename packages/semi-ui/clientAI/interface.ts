import type { ClientAIProps as FoundationClientAIProps, ToolCall, ToolCallResult, InitProgressReport } from '@douyinfe/semi-foundation/clientAI/interface';
import type { AIChatDialogueProps, RoleConfig } from '../aiChatDialogue/interface';
import type { AIChatInputProps } from '../aiChatInput/interface';
import type { Message } from '@douyinfe/semi-foundation/aiChatDialogue/foundation';
import type { ReactNode } from 'react';

/**
 * 自定义渲染时传入的参数
 */
export interface ClientAIRenderProps {
    /** 是否正在加载模型 */
    loading: boolean;
    /** 错误信息 */
    error: string | null;
    /** 消息列表 */
    messages: Message[];
    /** 是否正在生成回复 */
    isGenerating: boolean;
    /** 是否启用深度思考 */
    enableDeepThink: boolean;
    /** 发送消息 */
    sendMessage: (text: string) => Promise<void>;
    /** 停止生成 */
    stopGenerate: () => void;
    /** 清空消息 */
    clearMessages: () => void;
    /** 设置深度思考开关 */
    setEnableDeepThink: (enable: boolean) => void;
    /** 发送 Tool 执行结果 */
    sendToolResults: (results: ToolCallResult[]) => Promise<void>
}

export interface ClientAIProps extends FoundationClientAIProps {
    dialogueProps?: Partial<AIChatDialogueProps>;
    inputProps?: Partial<AIChatInputProps>;
    /**
     * 角色配置
     * 用于配置用户、助手、系统等角色的名称和头像等信息
     */
    roleConfig?: RoleConfig;
    /**
     * Tool 调用回调
     * 当 AI 输出包含 tool_call 时触发（仅用于通知，需要手动调用 sendToolResults）
     * @deprecated 推荐使用 handleToolCall，组件会自动处理工具调用和结果发送
     * @param toolCalls 解析出的 tool calls 数组
     * @param rawOutput AI 的原始输出
     */
    onToolCall?: (toolCalls: ToolCall[], rawOutput: string) => void;
    /**
     * Tool 调用处理函数
     * 当 AI 输出包含 tool_call 时，组件会自动调用此函数并等待返回结果，然后自动发送结果继续对话
     * 如果提供了此函数，将优先使用此函数；否则会调用 onToolCall 回调（需要手动调用 sendToolResults）
     * @param toolCalls 解析出的 tool calls 数组
     * @param rawOutput AI 的原始输出
     * @returns 返回 Tool 执行结果数组，组件会自动发送这些结果继续对话
     */
    handleToolCall?: (toolCalls: ToolCall[], rawOutput: string) => Promise<ToolCallResult[]> | ToolCallResult[];
    /**
     * 是否显示深度思考按钮
     * @default false
     */
    showDeepThinkButton?: boolean;
    /**
     * 深度思考默认状态
     * @default true
     */
    defaultEnableDeepThink?: boolean;
    /**
     * 自定义渲染函数
     * 传入此函数后，将完全由用户控制 UI 渲染，内置的 AIChatDialogue 和 AIChatInput 不会被渲染
     */
    render?: (props: ClientAIRenderProps) => ReactNode;
    /**
     * 用户消息发送前的回调
     * 可以修改用户输入内容，返回的字符串将同时用于显示和发送给AI
     * @param userContent 用户输入的原始内容
     * @param messages 完整的消息历史数组
     * @returns 修改后的用户内容
     */
    onUserMessage?: (userContent: string, messages: Message[]) => string;
    /**
     * AI回复前的回调
     * 可以拦截AI调用并返回自定义回复
     * @param messages 完整的消息历史数组（包含最新的用户消息）
     * @returns 非空字符串将作为AI回复，空字符串则正常调用AI
     */
    beforeAIInput?: (messages: Message[]) => string | Promise<string>;
    /**
     * AI回复后的回调
     * 可以修改AI的回复内容
     * @param aiContent AI返回的原始内容
     * @param messages 完整的消息历史数组（包含AI回复）
     * @returns 修改后的AI回复内容
     */
    afterAIInput?: (aiContent: string, messages: Message[]) => string | Promise<string>;
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
    defaultMessages?: Message[]
}

export type { ToolCall, ToolCallResult, ClientAIRenderProps };

export interface ClientAIState {
    engine: any | null;
    loading: boolean;
    error: string | null;
    chats: Message[];
    isGenerating: boolean;
    messages: any[];
    abortController: AbortController | null;
    enableDeepThink: boolean;
    initProgress: InitProgressReport | null
}

