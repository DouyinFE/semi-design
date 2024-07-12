import React, { ReactElement, ReactNode, useMemo } from 'react';
import cls from 'classnames';
import { Message, Metadata } from '../interface';
import MarkdownRender from '../../markdownRender';
import { cssClasses, MESSAGE_STATUS, MODE, ROLE } from '@douyinfe/semi-foundation/chat/constants';
import { MDXProps } from 'mdx/types';
import { FileAttachment, ImageAttachment } from '..//attachment';
import { default as code } from './code';

const { PREFIX_CHAT_BOX } = cssClasses;

interface ChatBoxContentProps {
    mode?: 'bubble' | 'noBubble' | 'userBubble';
    customMarkDownComponents?: MDXProps['components'];
    children?: string;
    role?: Metadata;
    message?: Message;
    customRenderFunc?: (props: {message?: Message; role?: Metadata; defaultContent?: ReactNode | ReactNode[]; className?: string}) => ReactNode
}

const ChatBoxContent = (props: ChatBoxContentProps) => {
    const { message = {}, customRenderFunc, role: roleInfo, customMarkDownComponents, mode } = props;
    const { content, role, status } = message;

    const markdownComponents = useMemo(() => ({
        'code': code,
        'SemiFile': FileAttachment,
        'img': ImageAttachment,
        ...customMarkDownComponents
    }), [customMarkDownComponents])

    const wrapCls = useMemo(() => {
        const isUser = role === ROLE.USER;
        const bubble = mode === MODE.BUBBLE;
        const userBubble = mode === MODE.USER_BUBBLE && isUser;
        return cls(`${PREFIX_CHAT_BOX}-content`, {
            [`${PREFIX_CHAT_BOX}-content-${mode}`]: bubble || userBubble,
            [`${PREFIX_CHAT_BOX}-content-user`]: (bubble && isUser) || userBubble,
            [`${PREFIX_CHAT_BOX}-content-error`]: status === MESSAGE_STATUS.ERROR && (bubble || userBubble)
        });
    }, [role, status]);

    const node = useMemo(() => {
        if (status === MESSAGE_STATUS.LOADING) {
            return <span className={`${PREFIX_CHAT_BOX}-content-loading`} >
                <span className={`${PREFIX_CHAT_BOX}-content-loading-item`} />
            </span>;
        } else {
            let realContent = '';
            if (typeof content  === 'string') {
                realContent = content;
            } else if (Array.isArray(content)){
                realContent = content.map((item)=> {
                    if (item.type === 'text') {
                        return item.text;
                    } else if (item.type === 'image_url') {
                        return `![image](${item.image_url.url})`;
                    } else if (item.type === 'file_url') {
                        const {name, size, url, type} = item.file_url;
                        const realType = name.split('.').pop() ?? type?.split('/').pop();
                        return `<SemiFile url={'${url}'} name={'${name}'} size={'${size}'} type={'${realType}'}></SemiFile>`
                    }
                    return '';
                }).join('\n\n');
            }
            return (<>
                <MarkdownRender
                    raw={realContent}
                    components={markdownComponents as any}
                />
            </>);
        }
    }, [status, content]);
        
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
