import * as React from 'react';
import BaseComponent from '../_base/baseComponent';
import cls from "classnames";
import PropTypes from 'prop-types';
import { ChatProps, ChatState, Message } from './interface';
import InputBox from './inputBox';
import "@douyinfe/semi-foundation/chat/chat.scss";
import Hint from './hint';
import { IconChevronDown, IconDisc } from '@douyinfe/semi-icons';
import ChatContent from './chatContent';
import { getDefaultPropsFromGlobalConfig } from '../_utils';
import { cssClasses, CHAT_ALIGN } from '@douyinfe/semi-foundation/chat/constants';
import ChatFoundation, { ChatAdapter } from '@douyinfe/semi-foundation/chat/foundation';
import { FileItem } from 'upload';
import LocaleConsumer from "../locale/localeConsumer";
import { Locale } from "../locale/interface";

const prefixCls = cssClasses.PREFIX;

class Chat extends BaseComponent<ChatProps, ChatState> {

    static __SemiComponentName__ = "Chat";
  
    containerRef: React.RefObject<HTMLDivElement>;
    animation: any;
    wheelEventHandler: any;
    foundation: ChatFoundation;

    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        style: PropTypes.object,
        roleConfig: PropTypes.object,
        chats: PropTypes.array,
        hints: PropTypes.array,
        renderHintBox: PropTypes.func,
        onChatsChange: PropTypes.func,
        align: PropTypes.string,
        chatBoxRenderConfig: PropTypes.object,
        customMarkDownComponents: PropTypes.object,
        onClear: PropTypes.func,
        onMessageDelete: PropTypes.func,
        onMessageReset: PropTypes.func,
        onMessageCopy: PropTypes.func,
        onMessageGoodFeedback: PropTypes.func,
        onMessageBadFeedback: PropTypes.func,
        inputContentConvert: PropTypes.func,
        onMessageSend: PropTypes.func,
        InputBoxStyle: PropTypes.object,
        inputBoxCls: PropTypes.string,
        renderFullInputBox: PropTypes.func,
        placeHolder: PropTypes.string,
        topSlot: PropTypes.node,
        showStopGenerate: PropTypes.bool,
    };

    static defaultProps = getDefaultPropsFromGlobalConfig(Chat.__SemiComponentName__, {
        align: CHAT_ALIGN.LEFT_RIGHT,
        showStopGenerate: false,
    })

    constructor(props: ChatProps) {
        super(props);

        this.containerRef = React.createRef();
        this.wheelEventHandler = null;
        this.foundation = new ChatFoundation(this.adapter);

        this.state = {
            backBottomVisible: false,
            chats: [],
            cacheHints: [],
            wheelScroll: false,
        };
    }

    get adapter(): ChatAdapter {
        return {
            ...super.adapter,
            getContainerRef: () => this.containerRef,
            setWheelScroll: (flag: boolean) => {
                this.setState({
                    wheelScroll: flag,
                });
            },
            notifyChatsChange: (chats: Message[]) => {
                const { onChatsChange } = this.props;
                onChatsChange && onChatsChange(chats);
            },
            notifyLikeMessage: (message: Message) => {
                const { onMessageGoodFeedback } = this.props;
                onMessageGoodFeedback && onMessageGoodFeedback(message);
            },
            notifyDislikeMessage: (message: Message) => {
                const { onMessageBadFeedback } = this.props;
                onMessageBadFeedback && onMessageBadFeedback(message);
            },
            notifyCopyMessage: (message: Message) => {
                const { onMessageCopy } = this.props;
                onMessageCopy && onMessageCopy(message);
            },
            notifyClearContext: () => {
                const { onClear } = this.props;
                onClear && onClear();
            },
            notifyMessageSend: (content: string, attachment: any[]) => {
                const { onMessageSend } = this.props;
                onMessageSend && onMessageSend(content, attachment);
            },
            notifyInputChange: (props: { inputValue: string; attachment: any[]}) => {
                const { onInputChange } = this.props;
                onInputChange && onInputChange(props);
            },
            setBackBottomVisible: (visible: boolean) => {
                this.setState((state) => {
                    if (state.backBottomVisible !== visible) {
                        return {
                            backBottomVisible: visible,
                        };
                    }
                    return null;
                });
            },
            registerWheelEvent: () => {
                this.adapter.unRegisterWheelEvent();
                const containerElement = this.containerRef.current;
                if (!containerElement) {
                    return ;
                }
                this.wheelEventHandler = (e: any) => {
                    this.adapter.setWheelScroll(true);
                    this.adapter.unRegisterWheelEvent();
                };
        
                containerElement.addEventListener('wheel', this.wheelEventHandler);
            },
            unRegisterWheelEvent: () => {
                if (this.wheelEventHandler) {
                    const containerElement = this.containerRef.current;
                    if (!containerElement) {
                        return ;
                    } else {
                        containerElement.removeEventListener('wheel', this.wheelEventHandler);
                    }
                    this.wheelEventHandler = null;
                }
            },
            notifyStopGenerate: (e: MouseEvent) => {
                const { onStopGenerator } = this.props;
                onStopGenerator && onStopGenerator(e);
            },
            notifyHintClick: (hint: string) => {
                const { onHintClick } = this.props;
                onHintClick && onHintClick(hint);
            }
        };
    }

    static getDerivedStateFromProps(nextProps: ChatProps, prevState: ChatState) {
        const { chats, hints } = nextProps;
        const newState = {} as any;
        if (chats !== prevState.chats) {
            newState.chats = chats;
        }
        if (hints !== prevState.cacheHints) {
            newState.cacheHints = hints;
        }
        if (Object.keys(newState).length) {
            return newState;
        }
        return null;
    }

    componentDidMount(): void {
        this.foundation.init();    
    }

    componentDidUpdate(prevProps: Readonly<ChatProps>, prevState: Readonly<ChatState>, snapshot?: any): void {
        const { chats: newChats, hints: newHints } = this.props;
        const { chats: oldChats, cacheHints } = prevState;
        const { wheelScroll } = this.state;
        let shouldScroll = false;
        if (newChats !== oldChats) {
            const newLastChat = newChats[newChats.length - 1];
            const oldLastChat = oldChats[oldChats.length - 1];
            if (newChats.length > oldChats.length) {
                if (newLastChat.id !== oldLastChat.id) {
                    shouldScroll = true;
                }
            } else if (newChats.length === oldChats.length &&
        (
            newLastChat.status !== 'complete' ||
          newLastChat.status !== oldLastChat.status
        )
            ) {
                shouldScroll = true;
            }
        }
        if (newHints !== cacheHints) {
            if (newHints.length > cacheHints.length) {
                shouldScroll = true;
            }
        }
        if (!wheelScroll && shouldScroll) {
            this.foundation.scrollToBottomImmediately();
        }
    }

    componentWillUnmount(): void {
        this.foundation.destroy();
    }

    resetMessage() {
        this.foundation.resetMessage(null);
    }

    clearContext() {
        this.foundation.clearContext(null);
    }

    scrollToBottom(animation: boolean) {
        if (animation) {
            this.foundation.scrollToBottomWithAnimation();
        } else {
            this.foundation.scrollToBottomImmediately();
        }
    }

    sendMessage(content: string, attachment: FileItem[]) {
        this.foundation.onMessageSend(content, attachment);
    }

    render() {
        const { topSlot, roleConfig, hints,
            onChatsChange, onMessageCopy, renderInputArea,
            chatBoxRenderConfig, align, renderHintBox,
            style, className, showStopGenerate,
            customMarkDownComponents,
            placeholder, inputBoxCls, inputBoxStyle
        } = this.props;
        const { backBottomVisible, chats, wheelScroll } = this.state;
        let showStopGenerateFlag = false;
        const lastChat = chats.length > 0 && chats[chats.length - 1];
        let disableSend = false;
        if (lastChat && showStopGenerate) {
            const lastChatOnGoing = lastChat.status && lastChat.status !== 'complete';
            disableSend = lastChatOnGoing;
            showStopGenerate && (showStopGenerateFlag = lastChatOnGoing);
        }
        return (
            <div className={cls(`${prefixCls}`, className)} style={style}>
                <div className={`${prefixCls}-wrapper`}>
                    {/* top slot */}
                    {topSlot}
                    {/* chat area */}
                    <div className={`${prefixCls}-outer`}>
                        <div 
                            className={cls(`${prefixCls}-container`, {
                                'semi-chat-container-scroll-hidden': !wheelScroll
                            })}
                            onScroll={this.foundation.containerScroll}
                            ref={this.containerRef}
                        >
                            <ChatContent 
                                align={align}
                                chats={chats}  
                                roleConfig={roleConfig}
                                customMarkDownComponents={customMarkDownComponents}
                                onMessageDelete={this.foundation.deleteMessage}
                                onChatsChange={onChatsChange}
                                onMessageBadFeedback={this.foundation.dislikeMessage}
                                onMessageGoodFeedback={this.foundation.likeMessage}
                                onMessageReset={this.foundation.resetMessage}
                                onMessageCopy={onMessageCopy}
                                chatBoxRenderConfig={chatBoxRenderConfig}
                            />
                            {/* hint area */}
                            {!!hints?.length && <Hint 
                                value={hints} 
                                onHintClick={this.foundation.onHintClick}
                                renderHintBox={renderHintBox}
                            />}
                        </div>
                    </div>
                    {backBottomVisible && !showStopGenerateFlag && (<span
                        className={`${prefixCls}-action`}
                        onClick={this.foundation.scrollToBottomWithAnimation}
                    >
                        <span className={`${prefixCls}-action-content ${prefixCls}-action-backBottom`} >
                            <IconChevronDown size="extra-large"/>
                        </span>
                    </span>)}
                    {showStopGenerateFlag && (<span
                        className={`${prefixCls}-action`}
                        onClick={this.foundation.stopGenerate}
                    >
                        <span className={`${prefixCls}-action-content ${prefixCls}-action-stop`}>
                            <IconDisc size="extra-large" />
                            <span>
                                <LocaleConsumer<Locale["Chat"]> componentName="Chat" >
                                    {(locale: Locale["Chat"]) => locale['stop']}
                                </LocaleConsumer>
                            </span>
                        </span>
                    </span>)}
                    {/* input area */}
                    <InputBox
                        style={inputBoxStyle}
                        className={inputBoxCls}
                        placeholder={placeholder}
                        disableSend={disableSend}
                        onClearContext={this.foundation.clearContext}
                        onSend={this.foundation.onMessageSend}
                        onInputChange={this.foundation.onInputChange}
                        renderInputArea={renderInputArea}
                    />
                </div>
            </div>
        );
    }
}

export default Chat;
