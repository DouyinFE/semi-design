import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import Component from './component';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { strings } from '@douyinfe/semi-foundation/aiChatInput/constants';

export const REACT_COMPONENT_NODE_NAME = 'inputSlot';

function ensureTrailingText(schema: any) {
    return new Plugin({
        appendTransaction(transactions, oldState, newState) {
            // 只在内容发生变化时修正，防止选区丢失
            // Only correct when content changes to prevent loss of selections
            const docChanged = transactions.some(tr => tr.docChanged);
            if (!docChanged) return null;
            if (transactions.some(tr => tr.getMeta('inputSlotDeleted'))) {
                // 此次 transaction 是主动删除 inputSlot，不补零宽字符
                // This is an active deletion of inputSlot, do not add zero-width characters
                return null;
            }
            let { tr } = newState;
            let modified = false;
            newState.doc.descendants((node, pos) => {
                if (node.type.name === 'paragraph' && node.childCount > 0) {
                    const { lastChild } = node;
                    if (lastChild && lastChild.type.name === 'inputSlot') {
                        // 在段落末尾插入一个零宽字符, 避免当 inputSlot 是段落最后一个节点时候，光标无法移出
                        // Insert a zero-width character at the end of the paragraph to prevent 
                        // the cursor from being unable to move out when inputSlot is the last node of the paragraph.
                        const paragraphEndPos = pos + node.nodeSize - 1;
                        const prevChar = tr.doc.textBetween(paragraphEndPos - 1, paragraphEndPos, '', '');
                        if (prevChar !== strings.ZERO_WIDTH_CHAR) {
                            tr = tr.insert(paragraphEndPos, schema.text(strings.ZERO_WIDTH_CHAR));
                            modified = true;
                        }
                    }
                }
                // 保证在 undo 时候，没有内容的 inputSlot 节点内部有零宽字符
                // Ensure that there are zero-width characters inside the inputSlot node without content when undoing
                if (node.type.name === 'inputSlot' && node.content.size === 0) {
                    modified = true;
                    tr = tr.insertText(strings.ZERO_WIDTH_CHAR, pos + 1, pos + 1);
                }
                
            });
            return modified ? tr : null;
        },
    });
}

export default Node.create({
    name: 'inputSlot',
    group: 'inline',
    inline: true,
    // Allow text and other inline nodes inside
    content: 'inline*',
    // Allow editing
    atom: false,
    selectable: true,
    draggable: false,

    parseHTML() {
        return [
            {
                tag: 'input-slot',
                getAttrs: element => ({
                    placeholder: element.getAttribute('placeholder'),
                }),
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['input-slot', mergeAttributes(HTMLAttributes), 0];
    },

    addAttributes() {
        return {
            placeholder: {
                default: '',
                parseHTML: element => element.getAttribute('placeholder') || '',
                renderHTML: attributes => ({
                    'placeholder': attributes.placeholder,
                }),
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component);
    },

    addProseMirrorPlugins() {
        return [
            ensureTrailingText(this.editor.schema),
            new Plugin({
                key: new PluginKey('prevent-empty-inline-node'),
                props: {
                    handleKeyDown(view, event) {
                        const { state, dispatch } = view;
                        const { selection } = state;
                        const { $from, $to } = selection;
                        const node = $from.node();
                        /**
                         * 处理当光标在零宽字符的后面，并且零宽字符前面是 inputSlot 节点，保证通过 arrowLeft，光标跳到 inputSlot 的最后一个可聚焦位置
                         * 判断条件：光标前是零宽字符，零宽字符前是 inputSlot，按下 ArrowLeft
                         * Processing when the cursor is behind a zero-width character, and the zero-width character is preceded by an inputSlot node,
                         * ensuring that the cursor jumps to the last focusable position of the inputSlot through arrowLeft.
                         * Conditions: There is a zero-width character before the cursor, an inputSlot is before the zero-width character, and ArrowLeft is pressed.
                         */
                        if (
                            $from.nodeBefore && $from.nodeBefore.isText && $from.nodeBefore.text === strings.ZERO_WIDTH_CHAR &&
                            event.key === 'ArrowLeft'
                        ) {
                            // 获取零宽字符前的节点
                            // Get the node before the zero-width character
                            const parent = $from.parent;
                            const index = $from.index();
                            if (index >= 2) {
                                const beforeInputSlot = parent.child(index - 2);
                                if (beforeInputSlot.type.name === 'inputSlot') {
                                    // The starting position of the input-slot node
                                    const inputSlotStart = $from.pos - $from.nodeBefore.nodeSize - beforeInputSlot.nodeSize;
                                    // The end of the content in the inputSlot node
                                    const pos = inputSlotStart + beforeInputSlot.nodeSize - 1;
                                    dispatch(state.tr.setSelection(TextSelection.create(state.doc, pos)));
                                    event.preventDefault();
                                    return true;
                                }
                            }
                        }

                        if (node.type.name !== 'inputSlot') {
                            return false;
                        }

                        // 处理当显示 placeholder 时候，按键的光标移动，保证通过一次按键，光标就跳出节点
                        // When the placeholder is displayed, the cursor of the button moves to ensure that the cursor 
                        // jumps out of the node after pressing the button once.
                        if (node.textContent === strings.ZERO_WIDTH_CHAR &&
                        (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
                        ) {
                            // 如果光标在节点内，按左右键时直接跳出节点
                            // If the cursor is within a node, press the left and right keys to jump out of the node directly.
                            const pos = event.key === 'ArrowLeft'
                                ? $from.before()
                                : $from.after() + 1;
                            dispatch(
                                state.tr.setSelection(TextSelection.create(state.doc, pos)),
                            );
                            event.preventDefault();
                            return true;
                        }

                        // 删除 input-slot 的最后一个字符时，插入零宽字符
                        // When removing the last character of input-slot, insert a zero-width character
                        if (
                            node.textContent.length === 1 &&
                            node.textContent !== strings.ZERO_WIDTH_CHAR &&
                        (event.key === 'Backspace' || event.key === 'Delete')
                        ) {
                            const pos = $from.pos - 1;
                            dispatch(state.tr.insertText(strings.ZERO_WIDTH_CHAR, pos, pos + 1));
                            event.preventDefault();
                            return true;
                        }

                        // 全选 input-slot 节点内容时，插入零宽字符
                        // When selecting all input-slot node content, insert zero-width characters
                        if (!selection.empty && $from.parent === node &&
                        selection.from === $from.start() && selection.to >= $from.end() &&
                        (event.key === 'Backspace' || event.key === 'Delete')
                        ) {
                            const tr = state.tr;
                            // 删除 inputSlot 之后被选中的内容
                            // Delete the selected content after inputSlot
                            if (selection.to > $from.end()) {
                                tr.delete($from.end(), selection.to);
                            }
                            // 替换 inputSlot 内部内容为 ZERO_WIDTH_CHAR
                            // Replace the internal content of inputSlot with ZERO_WIDTH_CHAR
                            tr.insertText(strings.ZERO_WIDTH_CHAR, $from.start(), $from.end());
                            const pos = $from.start() + 1; // 1 是零宽字符的长度
                            tr.setSelection(TextSelection.create(tr.doc, pos));
                            dispatch(tr);
                            event.preventDefault();
                            return true;
                        }

                        // 如果内容只剩零宽字符，再次删除时允许节点被删
                        // If only zero-width characters remain in the content, allow the node to be deleted when deleting again.
                        if (node.textContent === strings.ZERO_WIDTH_CHAR &&
                        (event.key === 'Backspace' || event.key === 'Delete')
                        ) {
                            // 计算当前节点在文档中的位置
                            // Calculate the position of the current node in the document
                            const pos = $from.before();
                            dispatch(state.tr.delete(pos, pos + node.nodeSize));
                            event.preventDefault();
                            return true;
                        }
                        return false;
                    },
                },
            }),
        ];
    },
});
