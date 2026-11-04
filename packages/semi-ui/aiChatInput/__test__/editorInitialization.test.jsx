import React from 'react';
import { mount } from 'enzyme';
import { rstest } from '@rstest/core';
import RichTextInput from '../richTextInput';
import { useEditor } from '@tiptap/react';
import { handleZeroWidthCharLogic } from '../extension/plugins';

rstest.mock('@tiptap/react', () => ({
    ...rstest.requireActual('@tiptap/react'),
    useEditor: rstest.fn(() => null),
    EditorContent: () => null,
}));

rstest.mock('../extension/plugins', () => ({
    ...rstest.requireActual('../extension/plugins'),
    handleZeroWidthCharLogic: rstest.fn(),
}));

describe('AIChatInput editor initialization', () => {
    let wrapper;
    beforeEach(() => {
        useEditor.mockReset();
        handleZeroWidthCharLogic.mockReset();
    });
    afterEach(() => {
        wrapper?.unmount();
        wrapper = null;
    });

    it('publishes the created editor before its initialization transaction updates content', () => {
        let publishedEditor = null;
        const onChange = rstest.fn(() => publishedEditor.getHTML());
        const handleCreate = rstest.fn();
        const transaction = {};
        const editor = {
            state: {},
            getText: () => '程序员',
            getHTML: () => '<p>程序员</p>',
            view: { dispatch: rstest.fn() },
        };
        useEditor.mockImplementation(options => {
            editor.view.dispatch.mockImplementation(() => options.onUpdate({ editor }));
            return editor;
        });
        handleZeroWidthCharLogic.mockReturnValue(transaction);
        wrapper = mount(<RichTextInput setEditor={editor => { publishedEditor = editor; }}
            onChange={onChange} handleCreate={handleCreate} />);
        expect(publishedEditor).toBe(editor);
        expect(editor.view.dispatch).toHaveBeenCalledWith(transaction);
        expect(onChange).toHaveBeenCalledWith('程序员');
        expect(handleCreate).toHaveBeenCalledTimes(1);
    });

    it('publishes the editor when initialization does not change content', () => {
        const setEditor = rstest.fn();
        const handleCreate = rstest.fn();
        const editor = { state: {}, view: { dispatch: rstest.fn() } };
        useEditor.mockReturnValue(editor);
        handleZeroWidthCharLogic.mockReturnValue(null);
        wrapper = mount(<RichTextInput setEditor={setEditor} onChange={() => {}} handleCreate={handleCreate} />);

        expect(setEditor).toHaveBeenLastCalledWith(editor);
        expect(editor.view.dispatch).not.toHaveBeenCalled();
        expect(handleCreate).toHaveBeenCalledTimes(1);

        wrapper.setProps({ placeholder: '输入内容' });

        expect(setEditor).toHaveBeenCalledTimes(1);
        expect(handleCreate).toHaveBeenCalledTimes(1);
    });

    it('does not initialize an editor from a discarded render', () => {
        const handleCreate = rstest.fn();
        const onChange = rstest.fn();
        const editor = { state: {}, view: { dispatch: rstest.fn() } };
        useEditor.mockReturnValue(editor);
        handleZeroWidthCharLogic.mockReturnValue(null);
        wrapper = mount(<RichTextInput setEditor={() => {}} onChange={onChange} handleCreate={handleCreate} />);
        handleCreate.mockClear();
        const discardedEditor = { state: {}, view: { dispatch: rstest.fn() } };

        useEditor.mock.calls[0][0].onCreate?.({ editor: discardedEditor });

        expect(discardedEditor.view.dispatch).not.toHaveBeenCalled();
        expect(handleCreate).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
    });
});
