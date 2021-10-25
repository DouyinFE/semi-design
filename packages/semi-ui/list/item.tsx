import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/list/constants';
import { noop } from 'lodash-es';
import { Col } from '../grid';
import ListContext from './list-context';

export interface ListItemProps {
    extra?: React.ReactNode;
    header?: React.ReactNode;
    main?: React.ReactNode;
    align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLLIElement>;
    onRightClick?: React.MouseEventHandler<HTMLLIElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLLIElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLLIElement>;
}

const prefixCls = cssClasses.PREFIX;
export default class ListItem extends PureComponent<ListItemProps> {
    static contextType = ListContext;

    static propTypes = {
        extra: PropTypes.node,
        header: PropTypes.node,
        main: PropTypes.node,
        align: PropTypes.oneOf(strings.ALIGN),
        className: PropTypes.string,
        style: PropTypes.object,
        onClick: PropTypes.func,
        onRightClick: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
    };

    static defaultProps = {
        align: 'flex-start',
        onMouseEnter: noop,
        onMouseLeave: noop,
    };

    wrapWithGrid(content: React.ReactNode) {
        const { grid } = this.context;
        const { gutter, justify, type, align, ...rest } = grid;
        return (
            <Col {...rest}>
                {content}
            </Col>
        );
    }

    render() {
        const {
            header,
            main,
            className,
            style,
            extra,
            children,
            align,
            onClick,
            onRightClick,
            onMouseEnter,
            onMouseLeave
        } = this.props;
        const { onRightClick: contextOnRightClick, onClick: contextOnClick, grid: contextGrid } = this.context;
        const handleContextMenu = onRightClick ? onRightClick : contextOnRightClick;
        const handleClick = onClick ? onClick : contextOnClick;
        const itemCls = cls(`${prefixCls}-item`, className);
        const bodyCls = cls(`${prefixCls}-item-body`,
            {
                [`${prefixCls}-item-body-${align}`]: align,
            }
        );
        let body;
        if (header || main) {
            body = (
                <div className={bodyCls}>
                    {header ? <div className={`${prefixCls}-item-body-header`}>{header}</div> : null}
                    {main ? <div className={`${prefixCls}-item-body-main`}>{main}</div> : null}
                </div>
            );
        }
        let content = (
            <li
                role="list-item"
                className={itemCls}
                style={style}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {body ? body : null}
                {children}
                {extra ? <div className={`${prefixCls}-item-extra`}>{extra}</div> : null}
            </li>
        );

        if (this.context && contextGrid) {
            content = this.wrapWithGrid(content);
        }

        return content;
    }
}