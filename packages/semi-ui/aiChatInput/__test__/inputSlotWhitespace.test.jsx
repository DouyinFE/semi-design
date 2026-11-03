import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Editor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import InputSlot from '../extension/inputSlot';
import { strings } from '@douyinfe/semi-foundation/aiChatInput/constants';

describe('AIChatInput input slot whitespace', () => {
    let editor;
    let wrapper;
    let container;
    const placeholder = 'first      line\nsecond line';
    const content = text => ({ type: 'doc', content: [{ type: 'paragraph', content: [{
        type: 'inputSlot', attrs: { placeholder }, content: [{ type: 'text', text }],
    }] }] });

    beforeEach(async () => {
        container = document.createElement('div');
        document.body.appendChild(container);
        editor = new Editor({ extensions: [Document, Paragraph, Text, InputSlot], content: content(strings.ZERO_WIDTH_CHAR) });
        await act(async () => {
            wrapper = mount(<EditorContent editor={editor} />, { attachTo: container });
            await new Promise(resolve => setTimeout(resolve, 20));
        });
    });

    afterEach(() => {
        wrapper.unmount();
        editor.destroy();
        container.remove();
    });

    it('preserves placeholder whitespace alongside Tiptap contenteditable styles', () => {
        const node = container.querySelector('.input-slot-placeholder');
        expect(node.textContent).toBe(placeholder);
        expect(node.getAttribute('contenteditable')).toBe('false');
        expect(getComputedStyle(node).whiteSpace).toBe('pre');
    });

    it('still hides the placeholder when the slot has content', () => {
        act(() => { editor.commands.setContent(content('value')); });
        expect(getComputedStyle(container.querySelector('.input-slot-placeholder')).display).toBe('none');
    });
});
