import React, { useState, useCallback } from 'react';
import Collapsible from '../../../collapsible';
import { cssClasses } from '@douyinfe/semi-foundation/aiChatDialogue/constants';
import { IconChevronDown, IconChevronUp, IconSearch } from '@douyinfe/semi-icons';
import MarkdownRender from '../../../markdownRender';
import { MarkdownRenderProps } from '../../../aiChatDialogue/interface';
import { MDXProps } from 'mdx/types';

export interface ReasoningWidgetProps {
    status?: string;
    summary?: { text?: string; type?: string }[];
    content?: { text?: string; type?: string }[];
    markdownRenderProps?: MarkdownRenderProps;
    customMarkDownComponents?: MDXProps['components'];
    customRenderer?: (props: ReasoningWidgetProps) => React.ReactNode
}

const prefixCls = cssClasses.PREFIX_REASONING;

export const ReasoningWidget = (props: ReasoningWidgetProps) => {
    const { status, summary, content, markdownRenderProps, customMarkDownComponents, customRenderer } = props;
    const defaultOpen = status !== 'completed';
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleClick = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    const getText = useCallback(() => {
        if (summary && summary.length > 0) {
            return summary.map((item: { text?: string; type?: string }) => item.text).join('\n');
        } else if (content && content.length > 0) {
            return content.map((item: { text?: string; type?: string }) => item.text).join('\n');
        }
    }, [summary, content]);

    return (
        <div 
            role="button"
            tabIndex={0}
            className={`${prefixCls}-wrapper`} 
            onClick={handleClick}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            <div className={`${prefixCls}-header`}>
                <div className={`${prefixCls}-header-prefix`}>
                    <IconSearch />
                </div>
                <div className={`${prefixCls}-header-title`}>
                    {status === 'completed' ? '已思考完成' : '正在思考中...'}
                </div>
                <div className={`${prefixCls}-header-suffix`}>
                    {isOpen ? <IconChevronUp onClick={handleClick}/> : <IconChevronDown onClick={handleClick}/>}
                </div>
            </div>
            <Collapsible 
                isOpen={isOpen}
            >
                <div className={`${prefixCls}-content`}>
                    {customRenderer ? customRenderer(props) : (
                        <MarkdownRender
                            format='md'
                            raw={getText()}
                            components={customMarkDownComponents as any}
                            {...markdownRenderProps}
                        />
                    )}
                </div>
            </Collapsible>
        </div>
    );
};