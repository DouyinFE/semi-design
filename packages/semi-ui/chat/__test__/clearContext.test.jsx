import React from 'react';
import { mount } from 'enzyme';
import Chat from '../index';

describe('Chat clearContext', () => {
    let wrapper;
    const makeProps = chats => ({
        chats,
        hints: [],
        showClearContext: true,
        uploadProps: { action: 'https://example.com/upload' },
        roleConfig: { assistant: { name: 'Assistant' } },
        onChatsChange: rstest.fn(),
        onClear: rstest.fn(),
        chatBoxRenderConfig: { renderChatBoxContent: () => <p>Welcome</p> },
    });
    afterEach(() => wrapper?.unmount());

    it('does nothing when the visible clear button is clicked for an empty list', () => {
        const props = makeProps([]);
        wrapper = mount(<Chat {...props} />);
        expect(() => wrapper.find('button.semi-chat-inputBox-clearButton').simulate('click')).not.toThrow();
        expect(props.onChatsChange).not.toHaveBeenCalled();
        expect(props.onClear).not.toHaveBeenCalled();
    });

    it('accepts the documented ref method when chats is omitted', () => {
        const props = makeProps(undefined);
        wrapper = mount(<Chat {...props} />);
        expect(() => wrapper.instance().clearContext()).not.toThrow();
        expect(props.onChatsChange).not.toHaveBeenCalled();
        expect(props.onClear).not.toHaveBeenCalled();
    });

    it('still appends one divider for existing messages and ignores repeated clearing', () => {
        const chats = [{ id: 'answer', role: 'assistant', content: 'Welcome', status: 'complete' }];
        const props = makeProps(chats);
        wrapper = mount(<Chat {...props} />);
        wrapper.find('button.semi-chat-inputBox-clearButton').simulate('click');
        expect(props.onClear).toHaveBeenCalledOnce();
        expect(props.onChatsChange).toHaveBeenCalledOnce();
        const next = props.onChatsChange.mock.calls[0][0];
        expect(next).toHaveLength(2);
        expect(next[0]).toBe(chats[0]);
        expect(next[1].role).toBe('divider');
        wrapper.setProps({ chats: next });
        wrapper.find('button.semi-chat-inputBox-clearButton').simulate('click');
        expect(props.onClear).toHaveBeenCalledOnce();
        expect(props.onChatsChange).toHaveBeenCalledOnce();
    });
});
