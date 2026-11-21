import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import AIChatInputFoundation from '@douyinfe/semi-foundation/aiChatInput/foundation';

describe('AIChatInput suggestion content', () => {
    let editor;
    let foundation;
    let adapter;
    let state;
    let suggestions;

    beforeEach(() => {
        editor = new Editor({
            extensions: [Document, Paragraph, Text],
            content: '<p>Original content</p>',
        });
        state = { suggestionVisible: true, skillVisible: false, activeSuggestionIndex: 0 };
        suggestions = [];
        adapter = {
            getProps: () => ({ suggestions }),
            getStates: () => state,
            setState: updates => Object.assign(state, updates),
            getEditor: () => editor,
            getPopupID: () => 'suggestions',
            setContent: sinon.spy(content => editor.commands.setContent(content)),
            focusEditor: sinon.spy(),
            unregisterClickOutsideHandler: sinon.spy(),
        };
        foundation = new AIChatInputFoundation(adapter);
    });

    afterEach(() => {
        editor.destroy();
    });

    it.each([
        ['string', 'Suggested content', 'Suggested content'],
        ['object', { content: 'Suggested content', id: 'suggestion' }, 'Suggested content'],
        ['empty string', '', ''],
        ['empty object content', { content: '', id: 'empty' }, ''],
    ])('inserts %s into the editor', (name, suggestion, expected) => {
        foundation.handleSuggestionSelect(suggestion);
        expect(editor.getText()).toBe(expected);
        expect(adapter.setContent.calledOnceWithExactly(expected)).toBe(true);
        expect(adapter.focusEditor.calledOnce).toBe(true);
        if (typeof suggestion === 'object') {
            expect(suggestion.content).toBe(expected);
        }
    });

    it.each([
        ['string', 'Keyboard content'],
        ['object', { content: 'Keyboard content', id: 'keyboard' }],
    ])('selects a %s suggestion with Enter', (name, suggestion) => {
        suggestions = [suggestion];
        foundation.handleKeyDown({ key: 'Enter' });
        expect(editor.getText()).toBe('Keyboard content');
        expect(adapter.focusEditor.calledOnce).toBe(true);
        expect(state.suggestionVisible).toBe(false);
        expect(adapter.unregisterClickOutsideHandler.calledOnce).toBe(true);
    });
});
