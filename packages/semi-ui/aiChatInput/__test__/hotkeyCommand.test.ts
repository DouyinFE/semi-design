import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import SemiStatusExtension from '../extension/statusExtension';

describe('AIChatInput hotkey command', () => {
    let editor: Editor;
    let element: HTMLDivElement;

    beforeEach(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
        editor = new Editor({ element, extensions: [Document, Paragraph, Text, SemiStatusExtension] });
    });

    afterEach(() => {
        editor.destroy();
        element.remove();
    });

    it('allows the send hotkey initially', () => {
        expect(editor.storage.SemiAIChatInput.allowHotKeySend).toBe(true);
    });

    it('updates the real editor storage and reports success', () => {
        expect(editor.commands.setAllowHotKeySendForSemiAIChatInput(false)).toBe(true);
        expect(editor.storage.SemiAIChatInput.allowHotKeySend).toBe(false);
        expect(editor.commands.setAllowHotKeySendForSemiAIChatInput(true)).toBe(true);
        expect(editor.storage.SemiAIChatInput.allowHotKeySend).toBe(true);
    });

    it('works in a Tiptap command chain', () => {
        expect(editor.chain().setAllowHotKeySendForSemiAIChatInput(false).run()).toBe(true);
        expect(editor.storage.SemiAIChatInput.allowHotKeySend).toBe(false);
    });

    it('does not change storage when checking command availability', () => {
        expect(editor.can().setAllowHotKeySendForSemiAIChatInput(false)).toBe(true);
        expect(editor.storage.SemiAIChatInput.allowHotKeySend).toBe(true);
    });
});
