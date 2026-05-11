import React, { Children, cloneElement, isValidElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { cssClasses } from '@douyinfe/semi-foundation/tag/constants';
import '@douyinfe/semi-foundation/tag/tag.scss';
import BaseComponent, { BaseProps } from '../_base/baseComponent';

const prefixCls = cssClasses.PREFIX;

export interface SplitTagGroupProps extends BaseProps {
    'aria-label'?: React.AriaAttributes['aria-label']
}

/**
 * SplitTagGroup wraps a list of `Tag` siblings and renders them as a single
 * connected group: the first child gets rounded corners on the leading edge,
 * the last child on the trailing edge, and inner children get zero radius.
 *
 * The class injection happens at render time via `React.Children.map` +
 * `cloneElement`, so we never reach into the DOM and can react to children
 * changes synchronously without a `MutationObserver`.
 */
export default class SplitTagGroup extends BaseComponent<SplitTagGroupProps> {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.node,
        'aria-label': PropTypes.string,
    };

    static defaultProps = {};

    /**
     * Walk only the *direct* children, skipping non-elements (text / nullish),
     * and inject `semi-tag-first` / `semi-tag-last` based on element index
     * within the visible-element list. Existing className on the child is
     * preserved.
     */
    decorateChildren = (children: ReactNode): ReactNode => {
        const validChildren = Children.toArray(children).filter(child => isValidElement(child));
        const lastIndex = validChildren.length - 1;
        let visibleIndex = -1;

        return Children.map(children, child => {
            if (!isValidElement(child)) {
                return child;
            }
            visibleIndex += 1;
            const extraCls = classNames((child as React.ReactElement<any>).props?.className, {
                [`${prefixCls}-first`]: visibleIndex === 0,
                [`${prefixCls}-last`]: visibleIndex === lastIndex,
            });
            return cloneElement(child as React.ReactElement<any>, { className: extraCls });
        });
    };

    render() {
        const { children, style, className } = this.props;
        const cls = classNames(`${prefixCls}-split`, className);
        return (
            <div
                className={cls}
                style={style}
                role="group"
                aria-label={this.props['aria-label']}
            >
                {this.decorateChildren(children)}
            </div>
        );
    }
}
