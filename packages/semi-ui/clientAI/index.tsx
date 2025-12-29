import React from 'react';
import BaseComponent from '../_base/baseComponent';
import PropTypes from 'prop-types';
import cls from 'classnames';
import Spin from '../spin';
import Typography from '../typography';
import Progress from '../progress';
import AIChatDialogue from '../aiChatDialogue';
import AIChatInput from '../aiChatInput';
import { IconBulb } from '@douyinfe/semi-icons';
import ClientAIFoundation, { ClientAIAdapter, ToolCall, ToolCallResult } from '@douyinfe/semi-foundation/clientAI/foundation';
import { ClientAIProps, ClientAIState, ClientAIRenderProps } from './interface';
import { cssClasses } from '@douyinfe/semi-foundation/clientAI/constants';
import type { RoleConfig } from '../aiChatDialogue/interface';
import LocaleConsumer from '../locale/localeConsumer';
import { Locale } from '../locale/interface';
import {
    Qwen3_1_7B_ENGINE_CONFIG,
    Qwen3_1_7B_ENGINE_CONFIG_CN,
    Qwen3_4B_ENGINE_CONFIG,
    Qwen3_4B_ENGINE_CONFIG_CN,
} from '@douyinfe/semi-foundation/clientAI/constants';
import type {
    WebWorkerMLCEngine,
    MLCEngineConfig,
    InitProgressReport,
} from '@douyinfe/semi-foundation/clientAI/interface';
import { MessageContent } from '@douyinfe/semi-foundation/aiChatInput/interface';
import { Message } from '@douyinfe/semi-foundation/aiChatDialogue/foundation';
import chatInputToMessage from '@douyinfe/semi-foundation/aiChatDialogue/dataAdapter/chatInputToMessage';
import '@douyinfe/semi-foundation/clientAI/clientAI.scss';

const { Configure } = AIChatInput;

const prefixCls = cssClasses.PREFIX;

class ClientAI extends BaseComponent<ClientAIProps, ClientAIState> {
    static __SemiComponentName__ = 'ClientAI';

    foundation!: ClientAIFoundation;

    // 静态属性：引擎配置
    // 国外配置（使用 Hugging Face + GitHub Raw）
    static Qwen3_1_7B_EngineConfig: MLCEngineConfig = Qwen3_1_7B_ENGINE_CONFIG;
    static Qwen3_4B_EngineConfig: MLCEngineConfig = Qwen3_4B_ENGINE_CONFIG;
    
    // 中国配置（使用 ModelScope + jsDelivr CDN）
    static Qwen3_1_7B_EngineConfigCN: MLCEngineConfig = Qwen3_1_7B_ENGINE_CONFIG_CN;
    static Qwen3_4B_EngineConfigCN: MLCEngineConfig = Qwen3_4B_ENGINE_CONFIG_CN;

    static propTypes = {
        worker: PropTypes.shape({
            url: PropTypes.string,
            enabled: PropTypes.bool,
        }),
        modelId: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
        engineConfig: PropTypes.object.isRequired,
        chatOpts: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
        systemPrompt: PropTypes.string,
        onError: PropTypes.func,
        dialogueProps: PropTypes.object,
        inputProps: PropTypes.object,
        roleConfig: PropTypes.object,
        className: PropTypes.string,
        style: PropTypes.object,
        showDeepThinkButton: PropTypes.bool,
        defaultEnableDeepThink: PropTypes.bool,
        render: PropTypes.func,
        onUserMessage: PropTypes.func,
        beforeAIInput: PropTypes.func,
        afterAIInput: PropTypes.func,
        stream: PropTypes.bool,
        defaultMessages: PropTypes.array,
        onToolCall: PropTypes.func,
        handleToolCall: PropTypes.func,
    };

    static defaultProps = {
        worker: {
            enabled: true,
        },
        // 注意：modelId 和 engineConfig 必填
        // modelId 可以从引擎配置中获取，如：ClientAI.Qwen3_1_7B_EngineConfig.appConfig.model_list[0].model_id
        // engineConfig 使用 ClientAI.Qwen3_1_7B_EngineConfig（国外）或 ClientAI.Qwen3_1_7B_EngineConfigCN（中国）
        systemPrompt: undefined, // 使用 undefined 让 foundation 层根据浏览器语言动态设置
        showDeepThinkButton: false,
        defaultEnableDeepThink: true,
        stream: true,
    };

    constructor(props: ClientAIProps) {
        super(props);

        // 处理 defaultMessages
        const { defaultMessages } = props;
        let initialChats: Message[] = [];
        let initialMessages: any[] = [];
        
        if (defaultMessages && defaultMessages.length > 0) {
            initialChats = defaultMessages.map((msg) => ({
                ...msg,
                id: msg.id || `msg_${Date.now()}_${Math.random()}`,
                createdAt: msg.createdAt || Date.now(),
                status: msg.status || 'completed',
            }));
            
            // 转换为 WebLLM 格式
            initialMessages = initialChats
                .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
                .map((msg) => {
                    let content = '';
                    if (typeof msg.content === 'string') {
                        content = msg.content;
                    } else if (Array.isArray(msg.content)) {
                        msg.content.forEach((item: any) => {
                            if (item.type === 'message' && Array.isArray(item.content)) {
                                item.content.forEach((contentItem: any) => {
                                    if (contentItem.type === 'input_text' || contentItem.type === 'output_text') {
                                        content += (contentItem.text || '');
                                    }
                                });
                            } else if (item.type === 'output_text') {
                                content += (item.text || '');
                            }
                        });
                    }
                    return {
                        role: msg.role,
                        content: content.trim(),
                    };
                })
                .filter((msg) => msg.content);
        }

        this.state = {
            engine: null,
            loading: true, // 初始状态为加载中，等待 engine 初始化完成
            error: null,
            chats: initialChats,
            isGenerating: false,
            messages: initialMessages,
            abortController: null,
            enableDeepThink: props.defaultEnableDeepThink !== false,
            initProgress: null,
        };

        this.foundation = new ClientAIFoundation(this.adapter);
    }

    get adapter(): ClientAIAdapter<ClientAIProps, ClientAIState> {
        return {
            ...super.adapter,
            setEngine: (engine: WebWorkerMLCEngine | null) => this.setState({ engine }),
            setLoading: (loading: boolean) => this.setState({ loading }),
            setError: (error: string | null) => this.setState({ error }),
            setChats: (chats: Message[]) => this.setState({ chats }),
            setIsGenerating: (isGenerating: boolean) => this.setState({ isGenerating }),
            setAbortController: (controller: AbortController | null) => this.setState({ abortController: controller }),
            setMessages: (messages: any[]) => this.setState({ messages }),
            setInitProgress: (progress: InitProgressReport | null) => this.setState({ initProgress: progress }),
            notifyError: (error: Error) => {
                this.props.onError?.(error);
            },
            notifyInitProgress: (progress: any) => {
                this.props.engineConfig?.initProgressCallback?.(progress);
            },
            notifyToolCall: (toolCalls: ToolCall[], rawOutput: string) => {
                this.props.onToolCall?.(toolCalls, rawOutput);
            },
        };
    }

    /**
     * 发送 Tool 执行结果，让 AI 继续对话
     * 可通过 ref 调用此方法
     */
    sendToolResults = async (toolResults: ToolCallResult[]) => {
        await this.foundation.sendToolResults(toolResults);
    };

    /**
     * 发送文本消息
     * 用于自定义渲染时调用
     */
    sendMessage = async (text: string) => {
        if (!text.trim()) return;
        const messageContent = {
            inputContents: [{ type: 'text', text }]
        };
        await this.foundation.handleStreamChat(messageContent as any);
    };

    /**
     * 清空消息历史
     */
    clearMessages = () => {
        this.setState({
            chats: [],
            messages: [],
        });
    };

    /**
     * 设置深度思考开关
     */
    setEnableDeepThink = (enable: boolean) => {
        this.setState({ enableDeepThink: enable });
    };

    componentDidMount() {
        this.initEngine();
    }

    componentWillUnmount() {
        const { modelId } = this.props;
        if (modelId) {
            this.foundation.destroy(modelId, false);
        }
    }

    /**
     * 初始化引擎
     */
    initEngine = async () => {
        const { worker, modelId, engineConfig, chatOpts } = this.props;

        // 检查必需的 props
        if (!modelId) {
            const err = new Error('ClientAI: modelId is required. You can get it from engineConfig, e.g.: ClientAI.Qwen3_1_7B_EngineConfig.appConfig.model_list[0].model_id');
            this.setState({ loading: false, error: err.message });
            this.props.onError?.(err);
            return;
        }

        if (!engineConfig) {
            const err = new Error('ClientAI: engineConfig is required. Please use ClientAI.Qwen3_1_7B_EngineConfig (international) or ClientAI.Qwen3_1_7B_EngineConfigCN (China).');
            this.setState({ loading: false, error: err.message });
            this.props.onError?.(err);
            return;
        }

        try {
            await this.foundation.initEngine({
                modelId,
                worker,
                engineConfig,
                chatOpts,
            });
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Unknown error');
            this.props.onError?.(err);
        }
    };

    /**
     * 处理消息发送
     */
    handleMessageSend = async (messageContent: MessageContent) => {
        await this.foundation.handleStreamChat(messageContent);
    };

    /**
     * 处理停止生成
     */
    handleStopGenerate = () => {
        this.foundation.stopGenerate();
    };

    /**
     * 处理聊天消息变化
     */
    handleChatsChange = (chats?: Message[]) => {
        if (chats) {
            this.setState({ chats });
        }
    };


    /**
     * 处理消息编辑
     */
    handleMessageEdit = (message?: Message) => {
        if (!message) return;

        // 标记消息为编辑状态
        this.setState((prevState) => ({
            chats: prevState.chats.map((msg) =>
                msg.id === message.id ? { ...msg, editing: true } : { ...msg, editing: false }
            ),
        }));
    };

    /**
     * 处理编辑消息发送
     */
    handleEditMessageSend = (messageContent: MessageContent) => {
        const { chats } = this.state;
        const editingIndex = chats.findIndex((msg) => msg.editing);

        if (editingIndex === -1) return;

        const editedMessage: Message = {
            ...chatInputToMessage(messageContent),
            id: chats[editingIndex].id,
            createdAt: chats[editingIndex].createdAt,
            status: 'completed',
        };

        this.setState((prevState) => ({
            chats: prevState.chats.map((msg, index) =>
                index === editingIndex ? editedMessage : { ...msg, editing: false }
            ),
        }));
    };

    /**
     * 处理配置区域变化（深度思考按钮）
     */
    handleConfigureChange = (value: Record<string, any>, changedValue: Record<string, any>) => {
        if ('deepThink' in changedValue) {
            this.setState({ enableDeepThink: changedValue.deepThink });
        }
    };

    /**
     * 渲染配置区域（深度思考按钮）
     */
    renderConfigureArea = () => {
        const { enableDeepThink } = this.state;
        return (
            <LocaleConsumer componentName="ClientAI">
                {(locale: Locale["ClientAI"]) => (
                    <Configure.Button 
                        icon={<IconBulb />} 
                        field="deepThink"
                        initValue={enableDeepThink}
                    >
                        {locale.deepThink}
                    </Configure.Button>
                )}
            </LocaleConsumer>
        );
    };

    /**
     * 渲染消息编辑输入框
     */
    renderMessageEdit = (props: MessageContent) => {
        const editingMessage = this.state.chats.find((msg) => msg.editing);
        if (!editingMessage) return null;

        const { inputProps } = this.props;
        const inputEditCls = cls(`${prefixCls}-input-edit`, inputProps?.className);

        return (
            <AIChatInput
                className={inputEditCls}
                generating={false}
                defaultContent={typeof editingMessage.content === 'string' ? editingMessage.content : undefined}
                onMessageSend={this.handleEditMessageSend}
                showUploadFile={false}
                showUploadButton={false}
                {...inputProps}
            />
        );
    };

    /**
     * 获取自定义渲染时的 props
     */
    getRenderProps = (): ClientAIRenderProps => {
        const { chats, loading, error, isGenerating, enableDeepThink } = this.state;
        return {
            loading,
            error,
            messages: chats,
            isGenerating,
            enableDeepThink,
            sendMessage: this.sendMessage,
            stopGenerate: this.handleStopGenerate,
            clearMessages: this.clearMessages,
            setEnableDeepThink: this.setEnableDeepThink,
            sendToolResults: this.sendToolResults,
        };
    };

    render() {
        const { engine, loading, error, chats, isGenerating } = this.state;
        const { dialogueProps, inputProps, className, style, systemPrompt, showDeepThinkButton, render, roleConfig: propRoleConfig } = this.props;

        // 如果传入了自定义 render 函数，使用自定义渲染
        if (typeof render === 'function') {
            return render(this.getRenderProps());
        }

        // 使用用户传入的 roleConfig 或默认配置
        const roleConfig = propRoleConfig;

        const wrapperCls = cls(prefixCls, className);
        const loadingCls = cls(`${prefixCls}-loading`);
        const loadingContentCls = cls(`${prefixCls}-loading-content`);
        const loadingTextCls = cls(`${prefixCls}-loading-text`);
        const errorCls = cls(`${prefixCls}-error`);
        const contentCls = cls(`${prefixCls}-content`);
        const dialogueWrapperCls = cls(`${prefixCls}-dialogue-wrapper`);
        const inputWrapperCls = cls(`${prefixCls}-input-wrapper`);
        const inputEditCls = cls(`${prefixCls}-input-edit`);

        if (loading) {
            const { initProgress } = this.state;
            // InitProgressReport 的结构：{ progress?: number, text?: string }
            // progress 是 0-1 之间的数字，text 是进度描述文本
            let progressPercent: number | undefined;
            
            if (initProgress && typeof initProgress === 'object') {
                // 检查是否有 progress 字段
                if ('progress' in initProgress && typeof initProgress.progress === 'number') {
                    progressPercent = Math.round(initProgress.progress * 100);
                }
            }
            
            const showProgress = progressPercent !== undefined;
            
            return (
                <LocaleConsumer componentName="ClientAI">
                    {(locale: Locale["ClientAI"]) => (
                        <div
                            className={cls(prefixCls, loadingCls, className)}
                            style={style}
                        >
                            <Spin size="large" />
                            <div className={loadingContentCls}>
                                <Typography.Text className={loadingTextCls}>
                                    {locale.loading}
                                </Typography.Text>
                                {showProgress && (
                                    <Progress
                                        percent={progressPercent}
                                        showInfo={true}
                                        size="large"
                                        stroke="var(--semi-color-primary)"
                                        aria-label={locale.loadingProgress}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </LocaleConsumer>
            );
        }

        if (error) {
            return (
                <LocaleConsumer componentName="ClientAI">
                    {(locale: Locale["ClientAI"]) => (
                        <div className={cls(wrapperCls, errorCls)} style={style}>
                            <Typography.Title heading={5} type="danger">
                                {locale.loadError}
                            </Typography.Title>
                            <Typography.Paragraph>{error}</Typography.Paragraph>
                        </div>
                    )}
                </LocaleConsumer>
            );
        }

        if (!engine) {
            return null;
        }

        return (
            <LocaleConsumer componentName="ClientAI">
                {(locale: Locale["ClientAI"]) => {
                    // 默认角色配置（不包含 avatar）
                    const defaultRoleConfig: RoleConfig = {
                        user: {
                            name: locale.roleUser,
                        },
                        assistant: {
                            name: locale.roleAssistant,
                        },
                        system: {
                            name: locale.roleSystem,
                        },
                    };

                    // 使用用户传入的 roleConfig 或默认配置
                    const finalRoleConfig = roleConfig || defaultRoleConfig;

                    return (
                        <div
                            className={cls(wrapperCls, `${prefixCls}-wrapper`)}
                            style={style}
                        >
                            <div className={contentCls}>
                                <div className={dialogueWrapperCls}>
                                    <AIChatDialogue
                                        align="leftRight"
                                        mode="bubble"
                                        chats={chats}
                                        roleConfig={finalRoleConfig}
                                        onChatsChange={this.handleChatsChange}
                                        messageEditRender={this.renderMessageEdit}
                                        onMessageEdit={this.handleMessageEdit}
                                        {...dialogueProps}
                                    />
                                </div>

                                <AIChatInput
                                    className={cls(inputWrapperCls, inputProps?.className)}
                                    onMessageSend={this.handleMessageSend}
                                    placeholder={locale.inputPlaceholder}
                                    generating={isGenerating}
                                    onStopGenerate={this.handleStopGenerate}
                                    showUploadFile={false}
                                    showUploadButton={false}
                                    {...(showDeepThinkButton ? {
                                        renderConfigureArea: this.renderConfigureArea,
                                        onConfigureChange: this.handleConfigureChange,
                                    } : {})}
                                    {...inputProps}
                                />
                            </div>
                        </div>
                    );
                }}
            </LocaleConsumer>
        );
    }
}

export default ClientAI;
export { ClientAI };

