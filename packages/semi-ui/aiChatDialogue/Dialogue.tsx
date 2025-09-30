import * as React from 'react';
import BaseComponent from '../_base/baseComponent';
import cls from "classnames";
import "@douyinfe/semi-foundation/aiChatDialogue/aiChatDialogue.scss";
import { cssClasses, strings } from '@douyinfe/semi-foundation/aiChatDialogue/constants';
import { Checkbox } from '../checkbox';
import DialogueTitle from './widgets/dialogueTitle';
import DialogueAvatar from './widgets/dialogueAvatar';
import DialogueAction from './widgets/dialogueAction';
import DialogueContent from './widgets/dialogueContent';
import Hint from './widgets/dialogueHint';
import { AIChatDialogueItemProps } from './interface';

const prefixCls = cssClasses.PREFIX;
const { ROLE, DIALOGUE_ALIGN } = strings;

interface AIChatDialogueState {}

class AIChatDialogue extends BaseComponent<AIChatDialogueItemProps, AIChatDialogueState> {

    constructor(props: AIChatDialogueItemProps) {
        super(props);
    }

    avatarNode = () => {
        const { role, renderConfig } = this.props;
        return <DialogueAvatar
            role={role}
            customRenderFunc={renderConfig?.renderDialogueAvatar}
        />;
    };

    titleNode = () => {
        const { role, renderConfig } = this.props;
        return <DialogueTitle 
            role={role}
            customRenderFunc={renderConfig?.renderDialogueTitle}
        />;
    };

    contentNode = () => {
        const { message, mode, renderConfig, customMarkDownComponents, markdownRenderProps, messageEditRender, onFileClick, onImageClick, disabledFileItemClick, renderDialogueContentItem, onAnnotationClick } = this.props;

        return <DialogueContent 
            key={message.editing}
            message={message} 
            mode={mode}
            editing={message.editing && message.role === ROLE.USER}
            messageEditRender={messageEditRender}
            onFileClick={onFileClick}
            onImageClick={onImageClick}
            disabledFileItemClick={disabledFileItemClick}
            renderDialogueContentItem={renderDialogueContentItem}
            onAnnotationClick={onAnnotationClick}
            customMarkDownComponents={customMarkDownComponents}
            customRenderFunc={renderConfig?.renderDialogueContent}
            markdownRenderProps={markdownRenderProps} 
        />;
    };

    actionNode = () => {
        const { role, message, showReset, isLastChat, renderConfig,
            onMessageReset, onMessageGoodFeedback, onMessageBadFeedback, onMessageCopy, 
            onMessageShare, messageEditRender, onMessageEdit, onMessageDelete
        } = this.props;

        return <DialogueAction 
            role={role}
            message={message}
            onMessageCopy={onMessageCopy}
            onMessageReset={onMessageReset}
            onMessageGoodFeedback={onMessageGoodFeedback}
            onMessageBadFeedback={onMessageBadFeedback}
            showReset={showReset}
            isLastChat={isLastChat}
            onMessageShare={onMessageShare}
            onMessageEdit={onMessageEdit}
            onMessageDelete={onMessageDelete}
            messageEditRender={messageEditRender}
            customRenderFunc={renderConfig?.renderDialogueAction}
        />;
    };

    hintNode = () => {
        const { hints, hintCls, hintStyle, onHintClick, renderHintBox, isLastChat } = this.props;
        if (isLastChat && hints?.length) {
            return <Hint
                className={hintCls}
                style={hintStyle}
                hints={hints}
                onHintClick={onHintClick}
                renderHintBox={renderHintBox}
            />;
        }
        return null;
    };



    render() {
        const { message, selecting, align, isSelected, onSelectChange } = this.props;
        const id = message.id;

        const isRightAlign = message.role === ROLE.USER && align === DIALOGUE_ALIGN.LEFT_RIGHT;
        const containerCls = cls({
            [`${prefixCls}-container`]: true,
            [`${prefixCls}-container-right`]: isRightAlign,
        });

        return (
            <div className={`${prefixCls}-wrapper`}>   
                {
                    selecting && (
                        <div className={`${prefixCls}-checkbox`}>
                            <Checkbox 
                                checked={isSelected}
                                onChange={(e) => onSelectChange(e.target.checked, id)}
                            />
                        </div>
                    )
                }
                <div className={containerCls}>
                    {this.avatarNode()}
                    <div className={`${prefixCls}-inner`}>
                        {this.titleNode()}
                        {this.contentNode()}
                        {this.actionNode()}
                        {this.hintNode()}
                    </div>
                </div>
            </div>
        );
    }
}

export default AIChatDialogue;
