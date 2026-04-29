import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { cssClasses } from '@douyinfe/semi-foundation/tag/constants';
import '@douyinfe/semi-foundation/tag/tag.scss';
import BaseComponent, { BaseProps } from '../_base/baseComponent';

const prefixCls = cssClasses.PREFIX;

export interface SplitTagGroupProps extends BaseProps {
    'aria-label'?: React.AriaAttributes['aria-label'];
}

export default class SplitTagGroup extends BaseComponent<SplitTagGroupProps> {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.node,
        'aria-label': PropTypes.string,
    };

    static defaultProps = {};

    containerRef: React.RefObject<HTMLDivElement> = React.createRef();
    mutationObserver: MutationObserver | null = null;

    componentDidMount() {
        const addClassName = () => {
            if (this.containerRef.current) {
                const tags = this.containerRef.current.querySelectorAll(`.${prefixCls}`);
                const firstTag = tags[0];
                const lastTag = tags[tags.length - 1];
                
                if (!firstTag?.classList.contains(`${prefixCls}-first`)) {
                    firstTag?.classList.add(`${prefixCls}-first`);
                }
                
                if (!lastTag?.classList.contains(`${prefixCls}-last`)) {
                    lastTag?.classList.add(`${prefixCls}-last`);
                }
            }
        };

        if (this.containerRef.current) {
            addClassName();
            const mutationObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (
                        (mutation.type === 'attributes' && mutation.attributeName === 'class') ||
                        (mutation.type === 'childList' && Array.from(mutation.addedNodes).some(node => 
                            node.nodeType === Node.ELEMENT_NODE && 
                            ((node as Element).classList?.contains(prefixCls) || 
                             (node as Element).querySelectorAll?.(`.${prefixCls}`).length > 0)
                        ))
                    ) {
                        addClassName();
                    }
                }
            });
            mutationObserver.observe(this.containerRef.current, { 
                attributes: true, 
                childList: true, 
                subtree: true 
            });
            this.mutationObserver = mutationObserver;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.mutationObserver?.disconnect();
    }

    render() {
        const { children, style, className } = this.props;
        const cls = classNames(`${prefixCls}-split`, className);
        return (
            <div 
                ref={this.containerRef} 
                className={cls} 
                style={style} 
                role="group"
                aria-label={this.props['aria-label']}
            >
                {children}
            </div>
        );
    }
}
