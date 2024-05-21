import React, { PureComponent, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { ChatBoxProps, ChatBoxState, Message } from '../interface';
import { IconThumbUpStroked, 
    IconDeleteStroked, 
    IconCopyStroked, 
    IconLikeThumb, 
    IconRedoStroked 
} from '@douyinfe/semi-icons';
import { BaseComponent, Button, Modal } from '../../index';
import copy from 'copy-text-to-clipboard';
import { ROLE, cssClasses, MESSAGE_STATUS } from '@douyinfe/semi-foundation/chat/constants';
import ChatBoxActionFoundation, { ChatBoxActionAdapter } from '@douyinfe/semi-foundation/chat/chatBoxActionFoundation';
import LocaleConsumer from "../../locale/localeConsumer";
import { Locale } from "../../locale/interface";
import cls from 'classnames';

const { PREFIX_CHAT_BOX_ACTION } = cssClasses;

interface ChatBoxActionProps extends ChatBoxProps {
    customRenderFunc?: (props: { message?: Message; defaultActions?: ReactNode | ReactNode[]; className: string }) => ReactNode
}

class ChatBoxAction extends BaseComponent<ChatBoxActionProps, ChatBoxState> {

    static propTypes = {
        role: PropTypes.object,
        message: PropTypes.object,
        showReset: PropTypes.bool,
        onMessageBadFeedback: PropTypes.func,
        onMessageGoodFeedback: PropTypes.func,
        onMessageCopy: PropTypes.func,
        onChatsChange: PropTypes.func,
        onMessageDelete: PropTypes.func,
        onMessageReset: PropTypes.func,
        customRenderFunc: PropTypes.func,
    }

    copySuccessNode: ReactNode;

    constructor(props: ChatBoxProps) {
        super(props);
        this.foundation = new ChatBoxActionFoundation(this.adapter);
        this.copySuccessNode = null;
        this.state = {
            visible: false
        };
    }

    componentDidMount(): void {
        this.copySuccessNode = <LocaleConsumer<Locale["Chat"]> componentName="Chat" >
            {(locale: Locale["Chat"]) => locale['copySuccess']}
        </LocaleConsumer>;
    }

    get adapter(): ChatBoxActionAdapter<ChatBoxActionProps, ChatBoxState> {
        return {
            ...super.adapter,
            setVisible: (visible: boolean) => {
                this.setState({ visible: visible });
            },
            notifyDeleteMessage: () => {
                const { message, onMessageDelete } = this.props;
                onMessageDelete?.(message);
            },
            notifyMessageCopy: () => {
                const { message, onMessageCopy } = this.props;
                onMessageCopy?.(message);
            },
            copyToClipboardAndToast: () => {
                const { message = {}, toast } = this.props;
                copy(message.content);
                toast.success({
                    content: this.copySuccessNode
                });
            },
            notifyLikeMessage: () => {
                const { message, onMessageGoodFeedback } = this.props;
                onMessageGoodFeedback?.(message);
            },
            notifyDislikeMessage: () => {
                const { message, onMessageBadFeedback } = this.props;
                onMessageBadFeedback?.(message);
            },
            notifyResetMessage: () => {
                const { message, onMessageReset } = this.props;
                onMessageReset?.(message);
            },
        };
    }

    copyNode = () => {
        return <Button
            key={'copy'}
            theme='borderless'
            icon={<IconCopyStroked />}
            type='tertiary'
            onClick={this.foundation.copyMessage}
            className={`${PREFIX_CHAT_BOX_ACTION}-btn`}
        />;
    }

    likeNode = () => {
        const { message = {} } = this.props;
        const { like } = message;
        return <Button
            key={'like'}
            theme='borderless'
            icon={like ? <IconLikeThumb /> : <IconThumbUpStroked /> }
            type='tertiary'
            className={`${PREFIX_CHAT_BOX_ACTION}-btn`}
            onClick={this.foundation.likeMessage}
        />;
    }

    dislikeNode = () => {
        const { message = {} } = this.props;
        const { dislike } = message;
        return <Button
            theme='borderless'
            key={'dislike'}
            icon={dislike ? <IconLikeThumb className={`${PREFIX_CHAT_BOX_ACTION}-icon-flip`} /> : <IconThumbUpStroked className={'semi-chat-chatBox-action-icon-flip'} />}
            type='tertiary'
            className={`${PREFIX_CHAT_BOX_ACTION}-btn`}
            onClick={this.foundation.dislikeMessage}
        />;
    }

    resetNode = () => {
        return <Button
            key={'reset'}
            theme='borderless'
            icon={<IconRedoStroked className={`${PREFIX_CHAT_BOX_ACTION}-icon-redo`}/>}
            type='tertiary'
            onClick={this.foundation.resetMessage}
            className={`${PREFIX_CHAT_BOX_ACTION}-btn`}
        />;
    }

    deleteNode = () => {
        const deleteMessage = (<LocaleConsumer<Locale["Chat"]> componentName="Chat" >
            {(locale: Locale["Chat"]) => locale['deleteConfirm']}
        </LocaleConsumer>);
        return (<>
            <Button
                key={'delete'}
                theme='borderless'
                icon={<IconDeleteStroked />}
                type='tertiary'
                onClick={this.foundation.showDeleteModal}
                className={`${PREFIX_CHAT_BOX_ACTION}-btn`}
            />
            <Modal
                key={'model'}
                title={deleteMessage}
                visible={this.state.visible}
                onOk={this.foundation.deleteMessage}
                onCancel={this.foundation.closeDeleteModal}
            ></Modal>
        </>);
    }

    render() {
        const { message = {}, lastChat } = this.props;
        const { role, status = MESSAGE_STATUS.COMPLETE } = message;
        const complete = status === MESSAGE_STATUS.COMPLETE ;
        const showFeedback = role !== ROLE.USER && complete;
        const showReset = lastChat && role === ROLE.ASSISTANT;
        const finished = status !== MESSAGE_STATUS.LOADING && status !== MESSAGE_STATUS.INCOMPLETE;
        const wrapCls = cls(PREFIX_CHAT_BOX_ACTION, { 
            [`${PREFIX_CHAT_BOX_ACTION}-show`]: showReset && finished,
            [`${PREFIX_CHAT_BOX_ACTION}-hidden`]: !finished,
        });
        const { customRenderFunc } = this.props;
        if (customRenderFunc) {
            const actionNodes = [];
            complete && actionNodes.push(this.copyNode());
            showFeedback && actionNodes.push(this.likeNode());
            showFeedback && actionNodes.push(this.dislikeNode());
            showReset && actionNodes.push(this.resetNode());
            actionNodes.push(this.deleteNode());
            return customRenderFunc({
                message,
                defaultActions: actionNodes,
                className: wrapCls
            });
        }
        return <div className={wrapCls} >
            {complete && this.copyNode()}
            {showFeedback && this.likeNode()}
            {showFeedback && this.dislikeNode()}
            {showReset && this.resetNode()}
            {this.deleteNode()}
        </div>;
    }
}

export default ChatBoxAction;
