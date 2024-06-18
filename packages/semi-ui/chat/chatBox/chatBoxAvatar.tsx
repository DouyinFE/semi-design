import React, { useMemo, ReactNode, ReactElement } from 'react';
import Avatar from '../../avatar';
import { Metadata } from 'chat/interface';
import { cssClasses } from '@douyinfe/semi-foundation/chat/constants';
const { PREFIX_CHAT_BOX } = cssClasses;

interface ChatBoxAvatarProps {
    children?: string;
    role?: Metadata;
    customRenderFunc?: (props: {role?: Metadata; defaultAvatar?: ReactNode}) => ReactNode
}

const ChatBoxAvatar = React.memo((props: ChatBoxAvatarProps) => {
    const { role, customRenderFunc } = props;

    const node = useMemo(() => {
        const { avatar, color } = role;
        return (<Avatar
            className={`${PREFIX_CHAT_BOX}-avatar`}
            src={avatar}
            size="small"
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

