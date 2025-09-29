import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { strings } from '@douyinfe/semi-foundation/aiChatInput/constants';

export default (props: any) => {
    const isEmpty = props.node.textContent === strings.ZERO_WIDTH_CHAR;
    const placeholder = props.node.attrs.placeholder || '';

    const placeholderRef = useRef<HTMLSpanElement>(null);
    const [placeholderWidth, setPlaceholderWidth] = useState<number | undefined>(
        undefined,
    );

    useLayoutEffect(() => {
        if (isEmpty && placeholderRef.current) {
            // 动态测量 placeholder 的宽度, 不加 setTimeout 可能获取不到宽度
            // Dynamically measure the width of the placeholder. Without setTimeout, the width may not be obtained.
            // a little bit hacky, but it works
            setTimeout(() => {
                setPlaceholderWidth(placeholderRef.current?.offsetWidth);
            });
        }
    }, [isEmpty, placeholder]);

    return (
        <NodeViewWrapper
            as="span"
            className="input-slot"
            style={{ minWidth: isEmpty && placeholderWidth ? `${placeholderWidth}px` : undefined }}
        >
            {isEmpty && (
                <span
                    ref={placeholderRef}
                    data-placeholder={true}
                    // contentEditable 必须传入 boolean，strings 导致控制台报错
                    // contentEditable' s value must be boolean，strings will cause warning
                    contentEditable={false}
                    className="input-slot-placeholder"
                >
                    {placeholder}
                </span>
            )}
            <NodeViewContent as="div" className="content" />
        </NodeViewWrapper>
    );
};
