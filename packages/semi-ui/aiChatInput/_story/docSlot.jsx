import React from 'react';
import { Typography, Tooltip, AIChatInput } from '@douyinfe/semi-ui';
import { Extension, Node, mergeAttributes, nodePasteRule } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';

import { IconFile } from '@douyinfe/semi-icons';


export const docSlotComponent = props => {
    const { Text } = Typography;
    const { node } = props;
    const value = node.attrs.urlValue ?? '';
    return (<NodeViewWrapper
        onClick={() => console.log('click doc slot', value)}
        className={'docSlotContainer'}
    >
        <div className={'textContainer'}>
            <IconFile />
            <Text
                className={'text'}
                ellipsis={{ showTooltip: { opts: { content: value } } }}
            >
                {value}
            </Text>
        </div>
    </NodeViewWrapper>
    );
};

const DocSlot = Node.create({
    name: 'docSlot',
    inline: true,
    group: 'inline',
    atom: true,
    selectable: false,

    // 自定义粘贴规则用例测试
    addPasteRules() {
        return [
            nodePasteRule({
                find: /^https:\/\/bytedance\.larkoffice\.com\/(docx|wiki)\/[A-Za-z0-9]{27}(?:\?[^\s]*)?/g,
                type: this.type,
                getAttributes: match => {
                    console.log('match', match[0]);
                    return {
                        urlValue: match[0],
                    };
                },
            }),
        ];
    },

    addAttributes() {
        return {
            value: {
                default: '',
                parseHTML: element => element.getAttribute('data-value'),
                renderHTML: attributes => ({
                    'data-value': attributes.value,
                }),
            },
            urlValue: {
                default: '',
                parseHTML: element => element.getAttribute('data-url-value'),
                renderHTML: attributes => ({
                    'data-url-value': attributes.urlValue,
                }),
            },
            type: {
                default: 'url',
            },
            uniqueKey: {
                default: '',
                parseHTML: element => element.getAttribute('data-unique-key'),
                renderHTML: attributes => ({
                    'data-unique-key': attributes.uniqueKey,
                }),
            },
            isCustomSlot: AIChatInput.getCustomSlotAttribute(),
        };
    },

    parseHTML() {
        return [ { tag: 'doc-slot' } ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['doc-slot', mergeAttributes(HTMLAttributes)];
    },
    addNodeView() {
        return ReactNodeViewRenderer(docSlotComponent);
    },
});

export default DocSlot;