import React from 'react';
import BaseComponent from '../_base/baseComponent';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { Spin, Typography } from '../index';
import { AIChatDialogue } from '../aiChatDialogue';
import { AIChatInput } from '../aiChatInput';
import BrowserAIFoundation, { BrowserAIAdapter } from '@douyinfe/semi-foundation/browserAI/foundation';
import { BrowserAIProps, BrowserAIState } from './interface';
import { cssClasses } from '@douyinfe/semi-foundation/browserAI/constants';
import {
    DEFAULT_MODEL_ID,
    DEFAULT_ENGINE_CONFIG,
} from '@douyinfe/semi-foundation/browserAI/constants';
import type {
    CreateWebWorkerMLCEngine,
    WebWorkerMLCEngine,
    MLCEngineConfig,
} from '@douyinfe/semi-foundation/browserAI/interface';
import { MessageContent } from '@douyinfe/semi-foundation/aiChatInput/interface';
import { Message } from '@douyinfe/semi-foundation/aiChatDialogue/foundation';
import chatInputToMessage from '@douyinfe/semi-foundation/aiChatDialogue/dataAdapter/chatInputToMessage';

const prefixCls = cssClasses.PREFIX;

// 动态导入 web-llm（避免在 Foundation 层直接依赖）
let CreateWebWorkerMLCEngineFn: typeof CreateWebWorkerMLCEngine;

class BrowserAI extends BaseComponent<BrowserAIProps, BrowserAIState> {
    static __SemiComponentName__ = 'BrowserAI';

    foundation!: BrowserAIFoundation;

    // 静态属性：默认配置
    static defaultModelId: string = DEFAULT_MODEL_ID;
    static defaultEngineConfig: MLCEngineConfig = DEFAULT_ENGINE_CONFIG;

    static propTypes = {
        worker: PropTypes.shape({
            url: PropTypes.string,
            enabled: PropTypes.bool,
        }),
        modelId: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
        engineConfig: PropTypes.object,
        chatOpts: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
        systemPrompt: PropTypes.string,
        onError: PropTypes.func,
        dialogueProps: PropTypes.object,
        inputProps: PropTypes.object,
        className: PropTypes.string,
        style: PropTypes.object,
    };

    static defaultProps = {
        worker: {
            enabled: true,
        },
        systemPrompt: 'You are a helpful AI assistant.',
    };

    constructor(props: BrowserAIProps) {
        super(props);

        this.state = {
            engine: null,
            loading: false,
            error: null,
            chats: [],
            isGenerating: false,
            messages: [],
            references: [],
            abortController: null,
        };

        this.foundation = new BrowserAIFoundation(this.adapter);
    }

    get adapter(): BrowserAIAdapter {
        return {
            ...super.adapter,
            setEngine: (engine: WebWorkerMLCEngine | null) => this.setState({ engine }),
            setLoading: (loading: boolean) => this.setState({ loading }),
            setError: (error: string | null) => this.setState({ error }),
            setChats: (chats: Message[]) => this.setState({ chats }),
            setIsGenerating: (isGenerating: boolean) => this.setState({ isGenerating }),
            setAbortController: (controller: AbortController | null) => this.setState({ abortController: controller }),
            setMessages: (messages: any[]) => this.setState({ messages }),
            setReferences: (references: any[]) => this.setState({ references }),
            notifyError: (error: Error) => {
                this.props.onError?.(error);
            },
            notifyInitProgress: (progress: any) => {
                this.props.engineConfig?.initProgressCallback?.(progress);
            },
        };
    }

    componentDidMount() {
        this.initEngine();
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    /**
     * 初始化引擎
     */
    initEngine = async () => {
        const { worker, modelId, engineConfig, chatOpts } = this.props;

        try {
            this.setState({ loading: true, error: null });

            // 动态导入 web-llm
            if (!CreateWebWorkerMLCEngineFn) {
                const webllm = await import('@mlc-ai/web-llm');
                CreateWebWorkerMLCEngineFn = webllm.CreateWebWorkerMLCEngine;
            }

            // 判断是否使用 Worker
            const useWorker = worker?.enabled !== false && worker?.url;

            let engine: WebWorkerMLCEngine;

            if (useWorker && worker.url) {
                // 使用 Worker 模式
                const workerInstance = new Worker(worker.url, { type: 'module' });
                engine = await CreateWebWorkerMLCEngineFn(
                    workerInstance,
                    modelId,
                    engineConfig,
                    chatOpts
                );
            } else {
                // 非 Worker 模式（主线程模式）
                // 注意：CreateMLCEngine 也需要动态导入
                const webllm = await import('@mlc-ai/web-llm');
                const { CreateMLCEngine } = webllm;
                engine = await CreateMLCEngine(modelId, engineConfig, chatOpts) as any;
            }

            // 初始化完成，调用 foundation 的方法设置引擎
            await this.foundation.initWithEngine(engine);
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Unknown error');
            this.setState({
                error: err.message,
                loading: false,
            });
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
     * 处理引用点击
     */
    handleReferenceClick = (item: any) => {
        // 将 ContentItem 转换为 Reference 格式
        if (item && typeof item === 'object' && 'file_id' in item) {
            const reference = {
                id: `reference-${Date.now()}`,
                type: item.type || 'file',
                file_id: item.file_id,
                name: item.name || item.filename,
                url: item.url || item.file_url,
            };
            this.setState((prevState) => ({
                references: [...prevState.references, reference],
            }));
        }
    };

    /**
     * 处理引用删除
     */
    handleReferenceDelete = (item: any) => {
        this.setState((prevState) => ({
            references: prevState.references.filter((ref) => ref.id !== item.id),
        }));
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
     * 渲染消息编辑输入框
     */
    renderMessageEdit = (props: MessageContent) => {
        const editingMessage = this.state.chats.find((msg) => msg.editing);
        if (!editingMessage) return null;

        const { inputProps } = this.props;

        return (
            <AIChatInput
                style={{ margin: '12px 0px', maxHeight: 300, flexShrink: 0 }}
                generating={false}
                references={props.references}
                defaultContent={typeof editingMessage.content === 'string' ? editingMessage.content : undefined}
                onMessageSend={this.handleEditMessageSend}
                onReferenceDelete={this.handleReferenceDelete}
                {...inputProps}
            />
        );
    };

    render() {
        const { engine, loading, error, chats, isGenerating, references } = this.state;
        const { dialogueProps, inputProps, className, style, systemPrompt } = this.props;

        // 角色配置
        const roleConfig = {
            user: {
                name: '用户',
                avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
            },
            assistant: {
                name: 'AI 助手',
                avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
            },
            system: {
                name: '系统',
                avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
            },
        };

        const wrapperCls = cls(prefixCls, className);
        const inputOuterStyle = { margin: '12px', minHeight: 150, maxHeight: 300, flexShrink: 0 };
        const dialogueOuterStyle = { flex: 1, overflow: 'auto' };

        if (loading) {
            return (
                <div
                    className={wrapperCls}
                    style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', ...style }}
                >
                    <Spin size="large" tip="正在加载模型..." />
                </div>
            );
        }

        if (error) {
            return (
                <div className={wrapperCls} style={{ padding: '20px', ...style }}>
                    <Typography.Title heading={5} type="danger">
                        加载错误
                    </Typography.Title>
                    <Typography.Paragraph>{error}</Typography.Paragraph>
                </div>
            );
        }

        if (!engine) {
            return null;
        }

        return (
            <div
                className={wrapperCls}
                style={{
                    padding: '20px',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    ...style,
                }}
            >
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                    <div style={dialogueOuterStyle}>
                        <AIChatDialogue
                            align="leftRight"
                            mode="bubble"
                            chats={chats}
                            roleConfig={roleConfig}
                            onChatsChange={this.handleChatsChange}
                            onReferenceClick={this.handleReferenceClick}
                            showReference={true}
                            messageEditRender={this.renderMessageEdit}
                            onMessageEdit={this.handleMessageEdit}
                            {...dialogueProps}
                        />
                    </div>

                    <AIChatInput
                        style={inputOuterStyle}
                        onMessageSend={this.handleMessageSend}
                        placeholder="输入消息或上传文件..."
                        generating={isGenerating}
                        references={references}
                        onStopGenerate={this.handleStopGenerate}
                        onReferenceDelete={this.handleReferenceDelete}
                        {...inputProps}
                    />
                </div>
            </div>
        );
    }
}

export default BrowserAI;
export { BrowserAI };

