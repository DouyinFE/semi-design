import { Editor, EditorContent, useEditor, Extensions, Extension, isNodeEmpty } from '@tiptap/react';
import React, { useCallback, useEffect, useMemo } from 'react';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import { UndoRedo } from '@tiptap/extensions';
import Paragraph from '@tiptap/extension-paragraph';
import HardBreak from '@tiptap/extension-hard-break';
import { Placeholder } from '@tiptap/extensions';
import type { Node } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import InputSlot from './extension/inputSlot';
import SelectSlot from './extension/selectSlot';
import SkillSlot from './extension/skillSlot';
import { strings } from '@douyinfe/semi-foundation/aiChatInput/constants';
import { Content as TiptapContent } from "@tiptap/core";
import { cssClasses } from '@douyinfe/semi-foundation/aiChatInput/constants';
import { EditorView } from '@tiptap/pm/view';
import { handleCompositionEndLogic, handlePasteLogic, handleTextInputLogic, handleZeroWidthCharLogic } from './extension/plugins';
import SemiStatusExtension from './extension/statusExtension';
import { PlaceholderProps } from './interface';

const PREFIX = cssClasses.PREFIX;

/**
 * 复制 tiptap Placeholder 扩展的 preparePlaceholderAttribute 函数，用于规范化 dataAttribute
 */
function preparePlaceholderAttribute(attr: string): string {
    return (
        attr
            // replace whitespace with dashes
            .replace(/\s+/g, '-')
            // replace non-alphanumeric  characters
            // or special chars like $, %, &, etc.
            // but not dashes
            .replace(/[^a-zA-Z0-9-]/g, '')
            // and replace any numeric character at the start
            .replace(/^[0-9-]+/, '')
            // and finally replace any stray, leading dashes
            .replace(/^-+/, '')
            .toLowerCase()
    );
}

/**
 * 自定义 Placeholder 扩展，覆盖原插件的 decorations 逻辑，让仅包含 skillSlot 和零宽字符的文档也能显示 placeholder
 */
const CustomPlaceholder = Placeholder.extend({
    addProseMirrorPlugins() {
        const dataAttribute = this.options.dataAttribute
            ? `data-${preparePlaceholderAttribute(this.options.dataAttribute)}`
            : 'data-placeholder';

        // 自定义函数：检查文档是否“实际为空”——即忽略 skillSlot 节点和零宽字符后没有其他内容
        const isDocActuallyEmpty = (doc: Node) => {
            let actuallyEmpty = true;
            doc.descendants((node, pos, parent) => {
                // 如果已经发现不为空，提前终止遍历
                if (!actuallyEmpty) {
                    return false;
                }
                // 跳过 skillSlot 节点及其子节点
                if (node.type.name === 'skillSlot') {
                    return false;
                }
                // 检查文本节点是否只包含零宽字符
                if (node.isText) {
                    const textWithoutZeroWidth = (node.text || '').replace(new RegExp(strings.ZERO_WIDTH_CHAR, 'g'), '');
                    if (textWithoutZeroWidth.length > 0) {
                        actuallyEmpty = false;
                        return false;
                    }
                } else if (
                    // 检查是否是其他非 leaf、非容器的自定义节点（如 inputSlot、selectSlot 等），如果是则不为空
                    node.type.name !== 'doc' &&
                    node.type.name !== 'paragraph'
                ) {
                    // 对于 inputSlot/selectSlot 这类非 leaf、非容器的自定义节点，视为有内容
                    actuallyEmpty = false;
                    return false;
                }
                return true;
            });
            return actuallyEmpty;
        };

        // 自定义函数：检查 paragraph 是否“实际为空”——即忽略 skillSlot 节点和零宽字符后没有其他内容
        const isParagraphActuallyEmpty = (paragraphNode: Node) => {
            let actuallyEmpty = true;
            paragraphNode.descendants((node, pos, parent) => {
                // 如果已经发现不为空，提前终止遍历
                if (!actuallyEmpty) {
                    return false;
                }
                // 跳过 skillSlot 节点及其子节点
                if (node.type.name === 'skillSlot') {
                    return false;
                }
                // 检查文本节点是否只包含零宽字符
                if (node.isText) {
                    const textWithoutZeroWidth = (node.text || '').replace(new RegExp(strings.ZERO_WIDTH_CHAR, 'g'), '');
                    if (textWithoutZeroWidth.length > 0) {
                        actuallyEmpty = false;
                        return false;
                    }
                } else if (node.type.name !== 'paragraph') {
                    // 对于其他自定义节点，视为有内容
                    actuallyEmpty = false;
                    return false;
                }
                return true;
            });
            return actuallyEmpty;
        };

        // 自定义函数：检查 paragraph 是否包含 skillSlot
        const paragraphHasSkillSlot = (paragraphNode: Node) => {
            let hasSkill = false;
            paragraphNode.descendants((node, pos, parent) => {
                if (node.type.name === 'skillSlot') {
                    hasSkill = true;
                    return false;
                }
                return true;
            });
            return hasSkill;
        };

        return [
            new Plugin({
                key: new PluginKey('custom-placeholder'),
                props: {
                    decorations: ({ doc, selection }) => {
                        const active = this.editor.isEditable || !this.options.showOnlyWhenEditable;
                        const { anchor } = selection;
                        const decorations: Decoration[] = [];

                        if (!active) {
                            return null;
                        }

                        const showPlaceholderWhenSkillOnly = this.options.showPlaceholderWhenSkillOnly ?? false;
                        const isEmptyDoc = this.editor.isEmpty || (showPlaceholderWhenSkillOnly && isDocActuallyEmpty(doc));

                        doc.descendants((node, pos) => {
                            const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
                            // 当开启 showPlaceholderWhenSkillOnly 时，使用自定义的 isParagraphActuallyEmpty
                            const isEmpty = !node.isLeaf && (node.type.name === 'paragraph' 
                                ? (showPlaceholderWhenSkillOnly ? isParagraphActuallyEmpty(node) : isNodeEmpty(node))
                                : isNodeEmpty(node));

                            if ((hasAnchor || !this.options.showOnlyCurrent) && isEmpty) {
                                const classes = [this.options.emptyNodeClass];

                                if (isEmptyDoc) {
                                    classes.push(this.options.emptyEditorClass);
                                }

                                // 如果开启 showPlaceholderWhenSkillOnly 且 paragraph 包含 skillSlot，添加特殊类
                                const hasSkill = showPlaceholderWhenSkillOnly && node.type.name === 'paragraph' && paragraphHasSkillSlot(node);
                                if (hasSkill) {
                                    classes.push('has-skill-slot');
                                }

                                const attrs: any = {
                                    class: classes.join(' '),
                                    [dataAttribute]:
                                        typeof this.options.placeholder === 'function'
                                            ? this.options.placeholder({
                                                editor: this.editor,
                                                node,
                                                pos,
                                                hasAnchor,
                                            })
                                            : this.options.placeholder,
                                };

                                const decoration = Decoration.node(pos, pos + node.nodeSize, attrs);

                                decorations.push(decoration);
                            }

                            return this.options.includeChildren;
                        });

                        return DecorationSet.create(doc, decorations);
                    },
                },
            }),
        ];
    },
});

export default (props: {
    innerRef?: React.Ref<HTMLDivElement>;
    defaultContent?: TiptapContent;
    placeholder?: PlaceholderProps;
    immediatelyRender?: boolean;
    setEditor?: (editor: Editor) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    onChange?: (content: string) => void;
    extensions?: Extensions;
    handleKeyDown?: (view: any, event: KeyboardEvent) => boolean;
    /**
     * Used for file paste upload.
     */
    onPaste?: (files: File[]) => void;
    /**
     * Listen to paste event on editor content DOM.
     */
    onPasteEvent?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    handleCreate?: () => void;
    showPlaceholderWhenSkillOnly?: boolean
}) => {
    const { setEditor, onKeyDown, onChange, placeholder, extensions = [], 
        defaultContent, onPaste, onPasteEvent, innerRef, handleKeyDown, onFocus, onBlur, handleCreate, immediatelyRender, showPlaceholderWhenSkillOnly } = props;

    const handleCompositionEnd = useCallback((view: EditorView) => {
        // Wait for ProseMirror to flush composition mutations before cleaning
        // zero-width placeholders, otherwise the slot content can be lost.
        setTimeout(() => {
            handleCompositionEndLogic(view);
        }, 60);
    }, []);

    const handleTextInput = useCallback((view: EditorView, from: number, to: number, text: string) => {
        if (view.composing) {
            return false;
        }
        return handleTextInputLogic(view, from, to, text);
    }, []);

    const allExtensions = useMemo(() => {
        // 根据 showPlaceholderWhenSkillOnly 决定使用 CustomPlaceholder 还是原生的 Placeholder
        const customPlaceholderOptions: Record<string, any> = {
            placeholder: placeholder,
            showPlaceholderWhenSkillOnly: true,
        };
        const placeholderExtension = showPlaceholderWhenSkillOnly
            ? CustomPlaceholder.configure(customPlaceholderOptions)
            : Placeholder.configure({
                placeholder: placeholder,
            });

        return [
            Document, Paragraph, Text, UndoRedo, HardBreak,
            InputSlot, SelectSlot, SkillSlot,
            placeholderExtension,
            SemiStatusExtension,
            ...extensions,
        ];
    }, [extensions, placeholder, showPlaceholderWhenSkillOnly]);

    const editorProps = useMemo(() => {
        return {
            handleKeyDown: handleKeyDown,
            handlePaste: handlePasteLogic,
            handleTextInput,
            handleDOMEvents: {
                compositionend: handleCompositionEnd,
            }
        };
    }, [handleKeyDown, handleTextInput, handleCompositionEnd]);

    // const onSelectionUpdate = useCallback(({ editor }) => {
    //     // For debug
    //     const fromPos = editor.state.selection.from;
    //     const { $from } = editor.state.selection;
    //     console.log('光标/选区位置', fromPos, editor.state.selection, editor.state.doc);
    //     // console.log('before', $from.nodeBefore, $from.nodeAfter);
    // }, []);

    const onCreate = useCallback(({ editor }) => {
        const { state, view } = editor;
        const tr = handleZeroWidthCharLogic(state);
        if (tr) {
            // 一次性触发，避免多次触发导致 appendTransaction 被多次调用
            view.dispatch(tr);
        }
        handleCreate();
    }, [handleCreate]);

    const onUpdate = useCallback(({ editor }) => {
        // The content has changed.
        const content = editor.getText();
        onChange(content);
    }, [onChange]);

    const handlePaste = useCallback((e) => {
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
    }, [onPaste]);

    const editor = useEditor({
        extensions: allExtensions as Extensions,
        content: defaultContent ?? ``,
        editorProps: editorProps,
        immediatelyRender,
        // onSelectionUpdate,
        onCreate,
        onUpdate,
        onPaste: handlePaste,
    });

    useEffect(() => {
        setEditor(editor);
    }, [editor, setEditor]);

    if (!editor) {
        // Prevent rendering until the editor is initialized
        return null; 
    }

    return (<>
        <EditorContent 
            editor={editor} 
            onKeyDown={onKeyDown as any}
            onFocus={onFocus as any}
            onBlur={onBlur as any}
            onPaste={onPasteEvent as any}
            ref={innerRef}
            className={`${PREFIX}-editor-content`}
        />
    </>);
};
