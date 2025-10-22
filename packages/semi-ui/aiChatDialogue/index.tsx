import * as React from 'react';
import BaseComponent from '../_base/baseComponent';
import PropTypes from 'prop-types';
import "@douyinfe/semi-foundation/aiChatDialogue/aiChatDialogue.scss";
import { ReasoningWidget } from './widgets/contentItem/reasoning';
import { DialogueStepWidget } from './widgets/contentItem/dialogueStep';
import { AnnotationWidget } from './widgets/contentItem/annotation';
import DialogueItem from './Dialogue';
import DialogueFoundation, { DialogueAdapter, Message } from '@douyinfe/semi-foundation/aiChatDialogue/foundation';
import { AIChatDialogueProps } from './interface';
import { getDefaultPropsFromGlobalConfig } from '../_utils';
import { strings } from '@douyinfe/semi-foundation/aiChatDialogue/constants';
import Hint from './widgets/dialogueHint';


export interface AIChatDialogueStates {
    chats?: Message[];
    selectedIds: Set<string>;
    cacheHints?: string[]
}

const { DIALOGUE_ALIGN, MODE } = strings;

class AIChatDialogue extends BaseComponent<AIChatDialogueProps, AIChatDialogueStates> {

    static __SemiComponentName__ = "AIChatDialogue"; 
    static Reasoning = ReasoningWidget;
    static Step = DialogueStepWidget;
    static Annotation = AnnotationWidget;

    foundation: DialogueFoundation;
    containerRef: React.RefObject<HTMLDivElement>;

    static propTypes = {
        align: PropTypes.oneOf(['leftRight', 'leftAlign']),
        chats: PropTypes.array,
        className: PropTypes.string,
        disabledFileItemClick: PropTypes.bool,
        hints: PropTypes.array,
        hintCls: PropTypes.string,
        hintStyle: PropTypes.object,
        selecting: PropTypes.bool,
        markdownRenderProps: PropTypes.object,
        messageEditRender: PropTypes.func,
        mode: PropTypes.string,
        roleConfig: PropTypes.object,
        style: PropTypes.object,
        renderConfig: PropTypes.object,
        renderHintBox: PropTypes.func,
        renderDialogueContentItem: PropTypes.func,
        onAnnotationClick: PropTypes.func,
        onChatsChange: PropTypes.func,
        onFileClick: PropTypes.func,
        onImageClick: PropTypes.func,
        onHintClick: PropTypes.func,
        onMessageBadFeedback: PropTypes.func,
        onMessageCopy: PropTypes.func,
        onMessageDelete: PropTypes.func,
        onMessageEdit: PropTypes.func,
        onMessageGoodFeedback: PropTypes.func,
        onMessageReset: PropTypes.func,
        onMessageShare: PropTypes.func,
        onSelect: PropTypes.func,
        showReset: PropTypes.bool,
    };

    static defaultProps = getDefaultPropsFromGlobalConfig(AIChatDialogue.__SemiComponentName__, {
        align: DIALOGUE_ALIGN.LEFT_RIGHT,
        mode: MODE.BUBBLE,
        selecting: false,
        disabledFileItemClick: false,
        showReset: true,
    })

    constructor(props: AIChatDialogueProps) {
        super(props);

        this.foundation = new DialogueFoundation(this.adapter);
        this.containerRef = React.createRef();

        this.state = {
            cacheHints: [],
            selectedIds: new Set<string>(),
            chats: [],
        };
        
        this.onSelectOrRemove = this.onSelectOrRemove.bind(this);
    }

    get adapter(): DialogueAdapter<AIChatDialogueProps, AIChatDialogueStates> {
        return {
            ...super.adapter,
            updateSelected: (selectedIds: Set<string>) => {
                this.setState({ selectedIds });
            },
            notifySelect: (selectedIds: string[]) => {
                const { onSelect } = this.props;
                onSelect && onSelect(selectedIds);
            },
            notifyChatsChange: (chats: Message[]) => {
                const { onChatsChange } = this.props;
                onChatsChange && onChatsChange(chats);
            },
            notifyCopyMessage: (message: Message) => {
                const { onMessageCopy } = this.props;
                onMessageCopy && onMessageCopy(message);
            },
            notifyLikeMessage: (message: Message) => {
                const { onMessageGoodFeedback } = this.props;
                onMessageGoodFeedback && onMessageGoodFeedback(message);
            },
            notifyDislikeMessage: (message: Message) => {
                const { onMessageBadFeedback } = this.props;
                onMessageBadFeedback && onMessageBadFeedback(message);
            },
            notifyEditMessage: (message: Message) => {
                const { onMessageEdit } = this.props;
                onMessageEdit && onMessageEdit(message);
            },
            notifyHintClick: (hint: string) => {
                const { onHintClick } = this.props;
                onHintClick && onHintClick(hint);
            },
        };
    }

    static getDerivedStateFromProps(nextProps: AIChatDialogueProps, prevState: AIChatDialogueStates) {
        const { chats, hints } = nextProps;
        const newState = {} as any;
        if (chats !== prevState.chats) {
            newState.chats = chats ?? [];
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

    componentDidUpdate(prevProps: Readonly<AIChatDialogueProps>, prevState: Readonly<AIChatDialogueStates>, snapshot?: any): void {
        const { chats: newChats, hints: newHints } = this.props;
        const { chats: oldChats, cacheHints } = prevState;
        let shouldScroll = false;
        if (newChats !== oldChats) {
            if (Array.isArray(newChats) && Array.isArray(oldChats)) {
                const newLastChat = newChats[newChats.length - 1];
                const oldLastChat = oldChats[oldChats.length - 1];
                if (newChats.length > oldChats.length) {
                    if (oldChats.length === 0 || newLastChat.id !== oldLastChat.id) {
                        shouldScroll = true;
                    }
                } else if (newChats.length === oldChats.length && newChats.length && 
                    (newLastChat.status !== 'completed' || newLastChat.status !== oldLastChat.status)
                ) {
                    shouldScroll = true;
                }
            }
        }
        if (newHints !== cacheHints) {
            if (newHints.length > cacheHints.length) {
                shouldScroll = true;
            }
        }
    }

    componentWillUnmount(): void {
        this.foundation.destroy();
    }

    selectAll = () => {
        this.foundation.handleSelectAll();
    }

    deselectAll = () => {
        this.foundation.handleDeselectAll();
    }

    onSelectOrRemove(isChecked: boolean, item: string) {
        this.foundation.handleSelectOrRemove(isChecked, item);
    }
    
    render() {
        const { roleConfig, onMessageBadFeedback, onMessageGoodFeedback, onMessageReset, onMessageEdit, onMessageDelete, onHintClick,
            selecting, hintCls, hintStyle, hints, renderHintBox, ...restProps } = this.props;
        const { selectedIds, chats } = this.state;

        return (
            <React.Fragment>
                {chats.map((chat, index) => {
                    const isLastChat = index === chats.length - 1;
                    const continueSend = index > 0 && chat?.role === chats[index - 1]?.role;
                    return (
                        <DialogueItem 
                            key={chat.id}
                            message={chat}
                            role={roleConfig[chat.role]}
                            onSelectChange={this.onSelectOrRemove}
                            isSelected={selectedIds.has(chat.id)}
                            roleConfig={roleConfig}
                            onMessageBadFeedback={this.foundation.dislikeMessage}
                            onMessageGoodFeedback={this.foundation.likeMessage}
                            onMessageReset={this.foundation.resetMessage}
                            onMessageEdit={this.foundation.editMessage}
                            onMessageDelete={this.foundation.deleteMessage}
                            onHintClick={this.foundation.onHintClick}
                            isLastChat={isLastChat}
                            continueSend={continueSend}
                            selecting={selecting}
                            {...restProps}
                        />
                    );
                })}
                {
                    !!hints?.length && <Hint
                        className={hintCls}
                        style={hintStyle}
                        hints={hints}
                        onHintClick={onHintClick}
                        renderHintBox={renderHintBox}
                        selecting={selecting}
                    />
                }
            </React.Fragment>
        );
    }
}

export default AIChatDialogue;
