import DialogueFoundation from '@douyinfe/semi-foundation/aiChatDialogue/foundation';

function createFoundation(chats) {
    const adapter = {
        getStates: () => ({ chats }),
        notifyEditMessage: rstest.fn(),
        notifyChatsChange: rstest.fn(),
    };
    return { foundation: new DialogueFoundation(adapter), adapter };
}

describe('AIChatDialogue editing ownership', () => {
    it('does not change the previous message when switching the edited message', () => {
        const chats = [{ id: 'first', editing: true }, { id: 'second', editing: false }];
        const { foundation, adapter } = createFoundation(chats);
        foundation.editMessage(chats[1]);
        expect(chats).toEqual([{ id: 'first', editing: true }, { id: 'second', editing: false }]);
        expect(adapter.notifyChatsChange).toHaveBeenCalledWith([{ id: 'first', editing: false }, { id: 'second', editing: true }]);
        expect(adapter.notifyEditMessage).toHaveBeenCalledWith(chats[1]);
    });

    it('can switch editing with frozen caller messages', () => {
        const chats = Object.freeze([Object.freeze({ id: 'first', editing: true }), Object.freeze({ id: 'second', editing: false })]);
        const { foundation, adapter } = createFoundation(chats);
        expect(() => foundation.editMessage(chats[1])).not.toThrow();
        expect(adapter.notifyChatsChange).toHaveBeenCalledWith([{ id: 'first', editing: false }, { id: 'second', editing: true }]);
    });

    it('does not change the caller message when leaving editing mode', () => {
        const chats = [{ id: 'first', editing: true }];
        const { foundation, adapter } = createFoundation(chats);
        foundation.editMessage(chats[0]);
        expect(chats[0].editing).toBe(true);
        expect(adapter.notifyChatsChange).toHaveBeenCalledWith([{ id: 'first', editing: false }]);
    });

    it('preserves unrelated messages and toggles the selected message', () => {
        const chats = [{ id: 'first', editing: false }, { id: 'second', editing: false }];
        const { foundation, adapter } = createFoundation(chats);
        foundation.editMessage(chats[1]);
        const nextChats = adapter.notifyChatsChange.mock.calls[0][0];
        expect(nextChats[0]).toBe(chats[0]);
        expect(nextChats[1]).toEqual({ id: 'second', editing: true });
        expect(chats[1].editing).toBe(false);
    });
});
