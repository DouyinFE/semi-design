import { Editor, EditorContent, Extension, useEditor } from '@tiptap/react';
import React, { useEffect } from 'react';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import { UndoRedo } from '@tiptap/extensions';
import Paragraph from '@tiptap/extension-paragraph';
import HardBreak from '@tiptap/extension-hard-break';
import { Placeholder } from '@tiptap/extensions';
import InputSlot from './extension/inputSlot';
import SelectSlot from './extension/selectSlot';
import SkillSlot from './extension/skillSlot';
import { strings } from '@douyinfe/semi-foundation/aiChatInput/constants';
import { Content as TiptapContent } from "@tiptap/core";
import { cssClasses } from '@douyinfe/semi-foundation/aiChatInput/constants';
import { EditorView } from '@tiptap/pm/view';
import { TextSelection, Transaction } from 'prosemirror-state';

const innerExtensions = [ Document, Paragraph, Text, UndoRedo, HardBreak, InputSlot, SelectSlot, SkillSlot ] as Extension[];
const PREFIX = cssClasses.PREFIX;

function handlePaste(view: EditorView, event: ClipboardEvent) {
    // If there is rich text content, let tiptap handle it by default
    const types = event.clipboardData?.types || [];
    const html = event.clipboardData?.getData('text/html');
    // 如果包含 html 内容，并且 html 内容中包含 input-slot, select-slot, skill-slot 节点，则不阻断
    // todo：增加用户扩展 slot 的判断
    if ((types.includes('text/html') && (['<input-slot', '<select-slot', '<skill-slot'].some(slot => html?.includes(slot))))
        || types.includes('application/x-prosemirror-slice')) {
        return false;
    }
    const text = event.clipboardData?.getData('text/plain');
    if (text) {
        const { state, dispatch } = view;
        const $from = state.selection.$from;
        let tr = state.tr;
        removeZeroWidthChar($from, tr);
        /* Use tr to continue the subsequent pasting logic and solve the problem of unsuccessful line wrapping of content 
            pasted from certain web pages, such as the code of Feishu Documents */
        const lines = text.split('\n');
        if (lines.length === 1) {
            // Insert the first line directly
            tr = tr.insertText(lines[0], tr.selection.from, tr.selection.to);
        } else {
            // other lines, insert one by one
            tr = tr.insertText(lines[0], tr.selection.from, tr.selection.to);
            let pos = tr.selection.$to.pos;
            for (let i = 1; i < lines.length; i++) {
                const paragraph = state.schema.nodes.paragraph.create(
                    {},
                    lines[i] ? state.schema.text(lines[i]) : null
                );
                tr = tr.insert(pos, paragraph);
                pos += paragraph.nodeSize;
            }
        }
        dispatch(tr);
        event.preventDefault();
        return true;
    }
    return false;
}

function removeZeroWidthChar($from: any, tr: Transaction) {
    // Handling zero-width characters before and after pasting
    // Check the previous node of the cursor
    if ($from.nodeBefore && $from.nodeBefore.isText && $from.nodeBefore.text === strings.ZERO_WIDTH_CHAR) {
        tr = tr.delete($from.pos - $from.nodeBefore.nodeSize, $from.pos);
        return true;
    }
    // Check the node after the cursor
    if ($from.nodeAfter && $from.nodeAfter.isText && $from.nodeAfter.text === strings.ZERO_WIDTH_CHAR) {
        tr = tr.delete($from.pos, $from.pos + $from.nodeAfter.nodeSize);
        return true;
    }
    return false;
}

function handleTextInput(view, from, to, text) {
    const { state, dispatch } = view;
    const $from = state.selection.$from;
    let tr = state.tr;
    let modified = removeZeroWidthChar($from, tr);

    // Remove zero-width characters before inserting text
    if (modified) {
        tr = tr.insertText(text, tr.selection.from, tr.selection.to);
        dispatch(tr);
        return true; // prevent default
    }
    return false; // continue default behavior
}

export default (props: {
    innerRef?: React.Ref<HTMLDivElement>;
    defaultContent?: TiptapContent[];
    placeholder?: string;
    setEditor?: (editor: Editor) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    onChange?: (content: string) => void;
    extensions?: Extension[];
    handleKeyDown?: (view: any, event: KeyboardEvent) => boolean;
    onPaste?: (files: File[]) => void;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void
}) => {
    const { setEditor, onKeyDown, onChange, placeholder, extensions = [], 
        defaultContent, onPaste, innerRef, handleKeyDown, onFocus, onBlur } = props;
    const editor = useEditor({
        extensions: [
            ...innerExtensions,
            Placeholder.configure({
                placeholder: placeholder,
            }),
            ...extensions,
        ] as Extension[],
        // content: defaultContent ?? `<p>我的职业是<input-slot data-placeholder="[输入职业]">程序员</input-slot></p>`,
        content: defaultContent ?? ``,
        editorProps: {
            handleKeyDown,
            handlePaste,
            handleTextInput,
        },
        onCreate({ editor }) {
            /* 在初始化时候检查 input-slot 节点是否为空，如果为空，则插入零宽字符，否则无法显示 placeholder
            During initialization, check whether the input-slot node is empty. If it is empty, 
            insert zero-width characters. Otherwise the placeholder cannot be displayed.*/
            let insertPositions = [];
            editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'inputSlot' && node.content.size === 0) {
                    // Insert zero-width characters
                    insertPositions.push(pos + 1);
                }
            });
            insertPositions.reverse().forEach(insertPos => {
                editor.commands.insertContentAt(insertPos, strings.ZERO_WIDTH_CHAR);
            });
        },
        onUpdate({ editor }) {
            // The content has changed.
            const content = editor.getText();
            onChange(content);
        },
        onFocus({ editor, event }) {
            onFocus?.(event);
        },
        onBlur({ editor, event }) {
            onBlur?.(event);
        },
        onPaste(e) {
            // To support file paste
            const items = e.clipboardData?.items as any;
            let files = [];
            if (items) {
                for (const it of items) {
                    const file = it.getAsFile();
                    file && files.push(it.getAsFile());
                }
            }
            if (files.length) {
                onPaste?.(files);
            }
        }
    });

    useEffect(() => {
        setEditor(editor);
    }, [editor, setEditor]);

    return (<>
        <EditorContent 
            editor={editor} 
            onKeyDown={onKeyDown as any}
            ref={innerRef}
            className={`${PREFIX}-editor-content`}
        />
    </>);
};
