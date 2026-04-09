import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React, { useRef, useLayoutEffect, useState } from 'react';
import { strings } from '@douyinfe/semi-foundation/aiChatInput/constants';

const InputSlotComponent = (props: any) => {
    const isEmpty = props.node.textContent === strings.ZERO_WIDTH_CHAR;
    const placeholder = props.node.attrs.placeholder || '';

    const placeholderRef = useRef<HTMLSpanElement>(null);
    const [placeholderWidth, setPlaceholderWidth] = useState<number | undefined>(
        undefined,
    );

    useLayoutEffect(() => {
        if (isEmpty && placeholderRef.current) {
            const timer = setTimeout(() => {
                setPlaceholderWidth(placeholderRef.current?.offsetWidth);
            });
            return () => {
                clearTimeout(timer);
            };
        }
        return undefined;
    }, [isEmpty, placeholder]);

    return (
        <NodeViewWrapper
            as="span"
            className="input-slot"
            style={{ minWidth: isEmpty && placeholderWidth ? `${placeholderWidth}px` : undefined }}
        >
            {/* Keep placeholder DOM stable during IME updates. */}
            <span
                ref={placeholderRef}
                data-placeholder={true}
                contentEditable={false}
                className="input-slot-placeholder"
                style={{ display: isEmpty ? undefined : 'none' }}
            >
                {placeholder}
            </span>
            <NodeViewContent as={"span" as any} className="content" />
        </NodeViewWrapper>
    );
};

export default InputSlotComponent;
