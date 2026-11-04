import React from 'react';
import Chat from '../index';

const chats = [
    { id: 'u1', role: 'user', content: 'hi', createAt: 1 },
    { id: 'a1', role: 'assistant', content: 'first', createAt: 2 },
    { id: 'a2', role: 'assistant', content: 'second', createAt: 3 },
];
const roleConfig = { user: { name: 'User', avatar: 'user.png' }, assistant: { name: 'Bot', avatar: 'bot.png' } };

describe('Chat consecutive message avatars', () => {
    it.each([false, true])('updates avatars when adjacent messages change, clone=%s', clone => {
        const wrapper = mount(<Chat chats={chats} roleConfig={roleConfig} uploadProps={{ action: '/upload' }} />);
        const hiddenAvatars = () => wrapper.find('.semi-chat-chatBox-avatar-hidden').hostNodes();
        try {
            expect(hiddenAvatars()).toHaveLength(1);
            const next = chats.filter(message => message.id !== 'a1').map(message => clone ? { ...message } : message);
            wrapper.setProps({ chats: next });
            expect(hiddenAvatars()).toHaveLength(0);
            expect(wrapper.find('.semi-chat-chatBox-avatar').hostNodes()).toHaveLength(2);
            wrapper.setProps({ chats: clone ? chats.map(message => ({ ...message })) : chats });
            expect(hiddenAvatars()).toHaveLength(1);
        } finally { wrapper.unmount(); }
    });
});
