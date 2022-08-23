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
    children?: React.ReactNode;
    reCalcKey?: number | string;
    style?: CSSProperties;
    showArrow?: boolean,
    disabled?: boolean,
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
        showArrow: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        showArrow: true,
        disabled: false,
    };

    private ariaID = getUuidShort({});

    context: CollapseContextType;

    renderHeader(active: boolean, expandIconEnable = true) {
        const {
            showArrow,
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
            <span aria-hidden='true' className={cls([`${cssClasses.PREFIX}-header-icon`,
                { [`${cssClasses.PREFIX}-header-iconDisabled`]: !expandIconEnable }])}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {expandIconEnable ? (active ? collapseIcon : expandIcon) : expandIcon}
            </span>
        );
        const iconPosLeft = expandIconPosition === 'left';
        if (typeof header === 'string') {
            return (
                <>
                    {showArrow && (iconPosLeft ? icon : null)}
                    <span>{header}</span>
                    <span className={`${cssClasses.PREFIX}-header-right`}>
                        <span>{extra}</span>
                        {showArrow && (iconPosLeft ? null : icon)}
                    </span>
                </>
            );
        }
        return (
            <>
                {showArrow && (iconPosLeft ? icon : null)}
                {header}
                {showArrow && (iconPosLeft ? null : icon)}
            </>
        );
    }

    render() {
        const {
            className,
            children,
            itemKey,
            reCalcKey,
            header,
            extra,
            showArrow,
            disabled,
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
            [`${cssClasses.PREFIX}-header-disabled`]: disabled,
            [`${cssClasses.PREFIX}-header-iconLeft`]: expandIconPosition === 'left',
        });
        const contentCls = cls({
            [`${cssClasses.PREFIX}-content`]: true,
        });
        return (
            <div
                className={itemCls}
                {...restProps}
            >
                <div
                    role="button"
                    tabIndex={0}
                    className={headerCls}
                    aria-disabled={disabled}
                    aria-expanded={active ? 'true' : 'false'}
                    aria-owns={this.ariaID}
                    onClick={e => !disabled && onClick(itemKey, e)}
                >
                    {this.renderHeader(active, children !== undefined && !disabled)}
                </div>
                {
                    children && (
                        <Collapsible
                            isOpen={active} keepDOM={keepDOM} motion={motion}
                            reCalcKey={reCalcKey}>
                            <div
                                className={contentCls}
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
