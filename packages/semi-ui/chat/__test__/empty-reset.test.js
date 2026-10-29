import Chat from '../index';

describe('Chat resetMessage', () => {
    it('does not create a reply when there are no messages', () => {
        const onChatsChange = jest.fn();
        const onMessageReset = jest.fn();
        const wrapper = mount(<Chat chats={[]} onChatsChange={onChatsChange} onMessageReset={onMessageReset} />);
        wrapper.instance().resetMessage();
        expect(onChatsChange).not.toHaveBeenCalled();
        expect(onMessageReset).not.toHaveBeenCalled();
        wrapper.unmount();
    });

    it('still resets the last existing reply', () => {
        const onChatsChange = jest.fn();
        const message = { id: 'reply', role: 'assistant', content: 'Reply', status: 'complete' };
        const wrapper = mount(<Chat chats={[message]} onChatsChange={onChatsChange} />);
        wrapper.instance().resetMessage();
        expect(onChatsChange).toHaveBeenCalledTimes(1);
        expect(onChatsChange.mock.calls[0][0]).toEqual([expect.objectContaining({ role: 'assistant', content: '', status: 'loading' })]);
        expect(message.content).toBe('Reply');
        wrapper.unmount();
    });
});
