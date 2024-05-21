import React, { ReactNode, useCallback } from 'react';
import { TextArea } from '../../index';
import { FileItem } from '../../upload/interface';
import Attachment from '../attachment';
import { cssClasses } from '@douyinfe/semi-foundation/chat/constants';

const { PREFIX_INPUT_BOX } = cssClasses;

const textAutoSize = { minRows: 1, maxRows: 5 };

interface InputAreaProps {
    style?: React.CSSProperties;
    className?: string;
    placeholder?: string;
    children?: ReactNode | undefined | any;
    content?: string;
    attachment?: FileItem[];
    onSend?: (e: any) => void;
    onChange?: (e: any) => void;
    onAttachmentDelete?: (props: FileItem) => void;
    textareaRef?: any
}

const InputArea = (props: InputAreaProps) => {
    const { content, attachment, onChange, onAttachmentDelete, onSend, textareaRef, placeholder } = props;

    const onEnterPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && e.shiftKey) {
            return ;
        }
        const shouldSend = content?.length || attachment?.length;
        shouldSend && onSend(e);
    }, [onSend, content, attachment]);
        
    return (
        <div
            className={`${PREFIX_INPUT_BOX}-inputArea`}
        >
            <TextArea
                placeholder={placeholder}
                onEnterPress={onEnterPress}
                value={content}
                onChange={onChange}
                ref={textareaRef}
                className={`${PREFIX_INPUT_BOX}-textarea`}
                autosize={textAutoSize} 
                disabledEnterStartNewLine={true}
            />
            <Attachment 
                attachment={attachment as any} 
                onClear={onAttachmentDelete}
            />
        </div>
    );
};

export default InputArea;