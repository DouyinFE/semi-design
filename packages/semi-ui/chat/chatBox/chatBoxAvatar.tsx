import React, { useMemo, ReactNode, ReactElement } from 'react';
import Avatar from '../../avatar';
import { Metadata } from '../interface';
import { cssClasses } from '@douyinfe/semi-foundation/chat/constants';
import cls from 'classnames';

const { PREFIX_CHAT_BOX } = cssClasses;

interface ChatBoxAvatarProps {
    children?: string;
    role?: Metadata;
    continueSend?: boolean;
    customRenderFunc?: (props: {role?: Metadata; defaultAvatar?: ReactNode}) => ReactNode
}

const ChatBoxAvatar = React.memo((props: ChatBoxAvatarProps) => {
    const { role, customRenderFunc, continueSend } = props;

    const node = useMemo(() => {
        const { avatar, color } = role;
        return (<Avatar
            className={cls(`${PREFIX_CHAT_BOX}-avatar`,
                {
                    [`${PREFIX_CHAT_BOX}-avatar-hidden`]: continueSend
                })}
            src={avatar}
            size="extra-small"
        >
        </Avatar>);
    }, [role]);

    if (customRenderFunc && typeof customRenderFunc === 'function') {
        return customRenderFunc({
            role, 
            defaultAvatar: node
        }) as ReactElement;
    }
    return node;
});

export default ChatBoxAvatar;

