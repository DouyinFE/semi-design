import React from 'react';
import { mount } from 'enzyme';
import { Extension } from '@tiptap/core';
import { act } from 'react-dom/test-utils';
import { Sidebar } from '../../index';

describe('Sidebar FileItem editability updates', () => {
    let wrapper;
    let host;
    let editor;
    let extensions;
    const selectionDescriptor = Object.getOwnPropertyDescriptor(document, 'getSelection');

    beforeAll(() => {
        // This JSDOM version does not implement the Selection API.
        Object.defineProperty(document, 'getSelection', { configurable: true, value: () => null });
    });

    afterAll(() => {
        if (selectionDescriptor) {
            Object.defineProperty(document, 'getSelection', selectionDescriptor);
        } else {
            delete document.getSelection;
        }
    });

    beforeEach(() => {
        host = document.createElement('div');
        document.body.appendChild(host);
        editor = null;
        extensions = [Extension.create({ name: 'testEditorCapture', onCreate() { editor = this.editor; } })];
    });

    afterEach(async () => {
        await act(async () => {
            wrapper?.unmount();
            await ready();
        });
        host.remove();
    });

    const ready = () => new Promise(resolve => setTimeout(resolve, 0));
    const render = async props => {
        await act(async () => {
            wrapper = mount(<Sidebar.FileItem content="<p>Original</p>" extensions={extensions} {...props}/>, { attachTo: host });
            await ready();
        });
    };

    it('honors an initially read-only file', async () => {
        await render({ editable: false });
        expect(editor.isEditable).toBe(false);
        expect(host.querySelector('.tiptap').getAttribute('contenteditable')).toBe('false');
    });

    it('makes the same editor read-only when editable becomes false', async () => {
        await render({ editable: true });
        const initialEditor = editor;
        wrapper.setProps({ editable: false });
        expect(editor).toBe(initialEditor);
        expect(editor.isEditable).toBe(false);
        expect(host.querySelector('.tiptap').getAttribute('contenteditable')).toBe('false');
    });

    it('makes the same editor editable again', async () => {
        await render({ editable: false });
        const initialEditor = editor;
        act(() => { wrapper.setProps({ editable: true }); });
        expect(editor).toBe(initialEditor);
        expect(editor.isEditable).toBe(true);
        expect(host.querySelector('.tiptap').getAttribute('contenteditable')).toBe('true');
    });

    it('preserves local edits and does not emit content changes for an editability toggle', async () => {
        const onContentChange = jest.fn();
        await render({ editable: true, onContentChange });
        act(() => { editor.commands.insertContent('Local edit'); });
        const html = editor.getHTML();
        onContentChange.mockClear();
        wrapper.setProps({ editable: false });
        wrapper.setProps({ editable: true });
        expect(editor.getHTML()).toBe(html);
        expect(onContentChange).not.toHaveBeenCalled();
    });

    it('applies Sidebar fileEditable updates to the existing detail editor', async () => {
        const detailContent = { key: 'file', name: 'Example', content: '<p>Original</p>', extensions };
        await act(async () => {
            wrapper = mount(<Sidebar visible motion={false} mode="file" detailContent={detailContent} fileEditable/>, { attachTo: host });
            await ready();
        });
        const initialEditor = editor;
        wrapper.setProps({ fileEditable: false });
        expect(editor).toBe(initialEditor);
        expect(editor.isEditable).toBe(false);
    });

    it('updates read-only content without reporting a user edit', async () => {
        const onContentChange = jest.fn();
        await render({ editable: false, onContentChange });
        const initialEditor = editor;
        await act(async () => { wrapper.setProps({ content: '<p>Updated</p>' }); await ready(); });
        expect(editor).toBe(initialEditor);
        expect(editor.getHTML()).toBe('<p>Updated</p>');
        expect(onContentChange).not.toHaveBeenCalled();
        await act(async () => { wrapper.setProps({ content: '' }); await ready(); });
        expect(editor.getText()).toBe('');
    });

    it('does not overwrite local edits when content changes while editable', async () => {
        await render({ editable: true });
        act(() => { editor.commands.insertContent('Local edit'); });
        const html = editor.getHTML();
        await act(async () => { wrapper.setProps({ content: '<p>External</p>' }); await ready(); });
        await act(async () => { wrapper.setProps({ editable: false }); await ready(); });
        expect(editor.getHTML()).toBe(html);
    });

    it('updates the contents of a read-only FileContent item', async () => {
        const file = { key: 'file', name: 'Example', content: '<p>Original</p>' };
        await act(async () => {
            wrapper = mount(<Sidebar.FileContent activeKey="file" files={[file]} />, { attachTo: host });
            await ready();
        });
        expect(host.querySelector('.tiptap').textContent).toBe('Original');
        await act(async () => { wrapper.setProps({ files: [{ ...file, content: '<p>Updated</p>' }] }); await ready(); });
        expect(host.querySelector('.tiptap').textContent).toBe('Updated');
    });
});
