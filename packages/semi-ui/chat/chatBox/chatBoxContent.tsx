import React, { ReactElement, ReactNode, useMemo } from 'react';
import cls from 'classnames';
import { Message, Metadata } from '../interface';
import MarkdownRender from '../../markdownRender';
import { cssClasses, MESSAGE_STATUS } from '@douyinfe/semi-foundation/chat/constants';
import { MDXProps } from 'mdx/types';
import Attachment from '..//attachment';

const { PREFIX_CHAT_BOX } = cssClasses;

interface ChatBoxContentProps {
    customMarkDownComponents?: MDXProps['components'];
    children?: string;
    role?: Metadata;
    message?: Message;
    customRenderFunc?: (props: {message?: Message; role?: Metadata; defaultContent?: ReactNode | ReactNode[]; className?: string}) => ReactNode
}

const ChatBoxContent = (props: ChatBoxContentProps) => {
    const { message = {}, customRenderFunc, role: roleInfo, customMarkDownComponents } = props;
    const { content, attachment, role, status } = message;

    const wrapCls = useMemo(() => {
        return cls(`${PREFIX_CHAT_BOX}-content`, {
            [`${PREFIX_CHAT_BOX}-content-${role}`]: role,
            [`${PREFIX_CHAT_BOX}-content-error`]: status === MESSAGE_STATUS.ERROR
        });
    }, [role, status]);

    const node = useMemo(() => {
        if (status === MESSAGE_STATUS.LOADING) {
            return <span className={`${PREFIX_CHAT_BOX}-content-loading`} >
                <span className={`${PREFIX_CHAT_BOX}-content-loading-item`} />
            </span>;
        } else {
            return (<>
                <MarkdownRender
                    raw={content}
                    components={customMarkDownComponents}
                />
                {attachment?.length ? <Attachment showClear={false} attachment={attachment} className={`${PREFIX_CHAT_BOX}-content-attachment`}/> : null}
            </>);
        }
    }, [status, content, attachment, customMarkDownComponents]);
        
    if (customRenderFunc) {
        return customRenderFunc({ 
            message, 
            role: roleInfo,
            defaultContent: node,
            className: wrapCls,
        }) as ReactElement;
    } else {
        return <div className={wrapCls}>{node}</div>; 
    } 
};

export default ChatBoxContent;
