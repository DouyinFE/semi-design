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
     * 当 AI 输出包含 tool_call 时触发
     * @param toolCalls 解析出的 tool calls 数组
     * @param rawOutput AI 的原始输出
     */
    onToolCall?: (toolCalls: ToolCall[], rawOutput: string) => void;
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
    render?: (props: ClientAIRenderProps) => ReactNode
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

