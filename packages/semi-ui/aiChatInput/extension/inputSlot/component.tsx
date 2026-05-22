import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { strings } from '@douyinfe/semi-foundation/aiChatInput/constants';

const InputSlotComponent = (props: NodeViewProps) => {
    const { editor, node, getPos } = props;
    const isEmpty = node.textContent === strings.ZERO_WIDTH_CHAR;
    const placeholder = node.attrs.placeholder || '';

    /**
     * IMPORTANT:
     * inputSlot's NodeViewRenderer.update() is intentionally skipped during IME composition
     * (see extension/inputSlot/index.tsx). That means React won't re-render when
     * editor.view.composing changes.
     *
     * To avoid placeholder covering the live IME text, we listen to DOM
     * composition events and drive a local state update.
     */
    const [hidePlaceholderInComposition, setHidePlaceholderInComposition] = useState(false);

    const isSelectionInsideThisSlot = useCallback(() => {
        if (!editor || typeof getPos !== 'function') {
            return false;
        }
        const pos = getPos();
        const { from, to } = editor.state.selection;
        // getPos() returns the position before this node.
        // Selection inside the node should be within (pos, pos + node.nodeSize).
        return from > pos && to < pos + node.nodeSize;
    }, [editor, getPos, node.nodeSize]);

    useEffect(() => {
        if (!editor?.view?.dom) {
            return undefined;
        }

        const onCompositionStart = () => {
            if (isSelectionInsideThisSlot()) {
                setHidePlaceholderInComposition(true);
            }
        };
        const onCompositionEnd = () => {
            setHidePlaceholderInComposition(false);
        };

        // Use capture to ensure we catch events even when ProseMirror stops propagation.
        const dom = editor.view.dom;
        dom.addEventListener('compositionstart', onCompositionStart, true);
        dom.addEventListener('compositionend', onCompositionEnd, true);
        dom.addEventListener('compositioncancel', onCompositionEnd, true);
        return () => {
            dom.removeEventListener('compositionstart', onCompositionStart, true);
            dom.removeEventListener('compositionend', onCompositionEnd, true);
            dom.removeEventListener('compositioncancel', onCompositionEnd, true);
        };
    }, [editor, isSelectionInsideThisSlot]);

    // Hide placeholder when composing to avoid covering IME input.
    const shouldShowPlaceholder = isEmpty && !hidePlaceholderInComposition;

    const placeholderRef = useRef<HTMLSpanElement>(null);
    const [placeholderWidth, setPlaceholderWidth] = useState<number | undefined>(
        undefined,
    );

    useLayoutEffect(() => {
        if (shouldShowPlaceholder && placeholderRef.current) {
            const timer = setTimeout(() => {
                setPlaceholderWidth(placeholderRef.current?.offsetWidth);
            });
            return () => {
                clearTimeout(timer);
            };
        }
        return undefined;
    }, [shouldShowPlaceholder, placeholder]);

    return (
        <NodeViewWrapper
            as="span"
            className="input-slot"
            style={{ minWidth: shouldShowPlaceholder && placeholderWidth ? `${placeholderWidth}px` : undefined }}
        >
            {/* Keep placeholder DOM stable during IME updates. */}
            <span
                ref={placeholderRef}
                data-placeholder={true}
                contentEditable={false}
                className="input-slot-placeholder"
                style={{ display: shouldShowPlaceholder ? undefined : 'none' }}
            >
                {placeholder}
            </span>
            <NodeViewContent as={"span" as any} className="content" />
        </NodeViewWrapper>
    );
};

export default InputSlotComponent;
