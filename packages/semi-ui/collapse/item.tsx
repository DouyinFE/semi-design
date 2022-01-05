import React, { CSSProperties, PureComponent, ReactNode } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses } from '@douyinfe/semi-foundation/collapse/constants';
import Collapsible from '../collapsible';
import CollapseContext, { CollapseContextType } from './collapse-context';
import { IconChevronDown, IconChevronUp } from '@douyinfe/semi-icons';
import { getUuidShort } from '@douyinfe/semi-foundation/utils/uuid';

export interface CollapsePanelProps {
    itemKey: string;
    extra?: ReactNode;
    header?: ReactNode;
    className?: string;
    reCalcKey?: number | string;
    style?: CSSProperties;
}

export default class CollapsePanel extends PureComponent<CollapsePanelProps> {
    static contextType: React.Context<CollapseContextType> = CollapseContext;

    static propTypes = {
        itemKey: PropTypes.string,
        extra: PropTypes.node,
        header: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node,
        ]),
        className: PropTypes.string,
        reCalcKey: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    };

    private ariaID = getUuidShort({});

    renderHeader(active: boolean, expandIconEnable = true) {
        const {
            header,
            extra,
        } = this.props;
        let {
            expandIcon,
            collapseIcon,
        } = this.context;
        const { expandIconPosition } = this.context;
        if (typeof expandIcon === 'undefined') {
            expandIcon = (<IconChevronDown/>);
        }
        if (typeof collapseIcon === 'undefined') {
            collapseIcon = (<IconChevronUp/>);
        }
        const icon = (
            <span className={cls([`${cssClasses.PREFIX}-header-icon`,
                { [`${cssClasses.PREFIX}-header-iconDisabled`]: !expandIconEnable }])}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {expandIconEnable ? (active ? collapseIcon : expandIcon) : expandIcon}
            </span>
        );
        const iconPosLeft = expandIconPosition === 'left';
        if (typeof header === 'string') {
            return (
                <>
                    {iconPosLeft ? icon : null}
                    <span role={'heading'} aria-level={1}>{header}</span>
                    <span className={`${cssClasses.PREFIX}-header-right`}>
                        <span aria-label={'Extra of collapse header'}>{extra}</span>
                        {iconPosLeft ? null : icon}
                    </span>
                </>
            );
        }
        return (
            <>
                {iconPosLeft ? icon : null}
                {header}
                {iconPosLeft ? null : icon}
            </>
        );
    }

    render() {
        const {
            className,
            children,
            itemKey,
            reCalcKey,
            ...restProps
        } = this.props;
        const {
            keepDOM,
            expandIconPosition,
            activeSet,
            onClick,
            motion,
        } = this.context;
        const active = activeSet.has(itemKey);
        const itemCls = cls(className, {
            [`${cssClasses.PREFIX}-item`]: true,
        });
        const headerCls = cls({
            [`${cssClasses.PREFIX}-header`]: true,
            [`${cssClasses.PREFIX}-header-iconLeft`]: expandIconPosition === 'left',
        });
        const contentCls = cls({
            [`${cssClasses.PREFIX}-content`]: true,
        });
        return (
            <div
                aria-label={'Collapse panel'}
                className={itemCls}
                {...restProps}
            >
                <div
                    role="button"
                    tabIndex={0}
                    className={headerCls}
                    aria-expanded={active ? 'true' : 'false'}
                    aria-owns={this.ariaID}
                    onClick={e => onClick(itemKey, e)}
                >
                    {this.renderHeader(active, children !== undefined)}
                </div>
                {
                    children && (
                        <Collapsible
                            isOpen={active} keepDOM={keepDOM} motion={motion}
                            reCalcKey={reCalcKey}>
                            <div
                                className={contentCls}
                                aria-label={'Collapse content'}
                                aria-hidden={!active}
                                id={this.ariaID}
                            >
                                <div className={`${cssClasses.PREFIX}-content-wrapper`}>
                                    {children}
                                </div>
                            </div>
                        </Collapsible>
                    )
                }
            </div>
        );
    }
}
