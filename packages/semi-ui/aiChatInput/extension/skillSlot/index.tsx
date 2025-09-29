import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { IconClose } from '@douyinfe/semi-icons';
import React from 'react';

function SkillSlotComponent(props: NodeViewProps) {
    const { node, deleteNode } = props;
    const value: string = node.attrs.value ?? '';

    const onRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        deleteNode?.();
    };

    return (
        <NodeViewWrapper className="skill-slot-wrapper">
            <span className='skill-slot'>
                {value}
                <IconClose
                    onMouseDown={onRemove}
                    onClick={onRemove}
                    className='skill-slot-delete'
                />
            </span>
        </NodeViewWrapper>
    );
}

const SkillSlot = Node.create({
    name: 'skillSlot',
    inline: true,
    group: 'inline',
    atom: true,

    selectable: false,

    addAttributes() {
        return {
            value: {
                default: '',
                parseHTML: (element: HTMLElement) => (element as HTMLElement).getAttribute('data-value'),
                renderHTML: (attributes: Record<string, any>) => ({ 'data-value': attributes.value }),
            },
        };
    },

    parseHTML() {
        return [{
            tag: 'skill-slot',
        }];
    },

    renderHTML({ HTMLAttributes: htmlAttributes }) {
        return ['skill-slot', mergeAttributes(htmlAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(SkillSlotComponent);
    },
});

export default SkillSlot;
