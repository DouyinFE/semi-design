import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ConfigContext, { ContextValue } from '../configProvider/context';
import { cssClasses, strings, numbers } from '@douyinfe/semi-foundation/popover/constants';
import Tooltip, { ArrowBounding, Position, TooltipProps, Trigger, RenderContentProps } from '../tooltip/index';
import Arrow from './Arrow';
import '@douyinfe/semi-foundation/popover/popover.scss';
import { BaseProps } from '../_base/baseComponent';
import { Motion } from '../_base/base';
import { isFunction, noop } from 'lodash';

export { ArrowProps } from './Arrow';
declare interface ArrowStyle {
    borderColor?: string;
    backgroundColor?: string;
    borderOpacity?: string | number;
}

export interface PopoverProps extends BaseProps {
    children?: React.ReactNode;
    content?: TooltipProps['content'];
    visible?: boolean;
    autoAdjustOverflow?: boolean;
    motion?: Motion;
    position?: Position;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    trigger?: Trigger;
    contentClassName?: string | any[];
    onVisibleChange?: (visible: boolean) => void;
    onClickOutSide?: (e: React.MouseEvent) => void;
    showArrow?: boolean;
    spacing?: number;
    stopPropagation?: boolean | string;
    arrowStyle?: ArrowStyle;
    arrowBounding?: ArrowBounding;
    arrowPointAtCenter?: boolean;
    prefixCls?: string;
    rePosKey?: string | number;
    getPopupContainer?: () => HTMLElement;
    zIndex?: number;
    closeOnEsc?: TooltipProps['closeOnEsc'];
    guardFocus?: TooltipProps['guardFocus'];
    returnFocusOnClose?: TooltipProps['returnFocusOnClose'];
    onEscKeyDown?: TooltipProps['onEscKeyDown'];
    clickToHide?:TooltipProps['clickToHide']
}

export interface PopoverState {
    popConfirmVisible: boolean;
}
const positionSet = strings.POSITION_SET;
const triggerSet = strings.TRIGGER_SET;

class Popover extends React.PureComponent<PopoverProps, PopoverState> {
    static contextType = ConfigContext;
    static propTypes = {
        children: PropTypes.node,
        content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
        visible: PropTypes.bool,
        autoAdjustOverflow: PropTypes.bool,
        motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.func]),
        position: PropTypes.oneOf(positionSet),
        // getPopupContainer: PropTypes.func,
        mouseEnterDelay: PropTypes.number,
        mouseLeaveDelay: PropTypes.number,
        trigger: PropTypes.oneOf(triggerSet).isRequired,
        contentClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        onVisibleChange: PropTypes.func,
        onClickOutSide: PropTypes.func,
        style: PropTypes.object,
        spacing: PropTypes.number,
        zIndex: PropTypes.number,
        showArrow: PropTypes.bool,
        arrowStyle: PropTypes.shape({
            borderColor: PropTypes.string,
            backgroundColor: PropTypes.string,
            borderOpacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
        arrowPointAtCenter: PropTypes.bool,
        arrowBounding: PropTypes.object,
        prefixCls: PropTypes.string,
        guardFocus: PropTypes.bool,
        disableArrowKeyDown: PropTypes.bool,
    };

    static defaultProps = {
        arrowBounding: numbers.ARROW_BOUNDING,
        showArrow: false,
        autoAdjustOverflow: true,
        zIndex: numbers.DEFAULT_Z_INDEX,
        motion: true,
        trigger: 'hover',
        cancelText: 'No',
        okText: 'Yes',
        position: 'bottom',
        prefixCls: cssClasses.PREFIX,
        onClickOutSide: noop,
        onEscKeyDown: noop,
        closeOnEsc: true,
        returnFocusOnClose: true,
        guardFocus: true,
    };

    context: ContextValue;

    renderPopCard = ({ initialFocusRef }: { initialFocusRef: RenderContentProps['initialFocusRef'] }) => {
        const { content, contentClassName, prefixCls } = this.props;
        const { direction } = this.context;
        const popCardCls = classNames(
            prefixCls,
            contentClassName,
            {
                [`${prefixCls}-rtl`]: direction === 'rtl',
            }
        );
        const contentNode = this.renderContentNode({ initialFocusRef, content });
        return (
            <div className={popCardCls}>
                <div className={`${prefixCls}-content`}>{contentNode}</div>
            </div>
        );
    }

    renderContentNode = (props: { content: TooltipProps['content'], initialFocusRef: RenderContentProps['initialFocusRef'] }) => {
        const { initialFocusRef, content } = props;
        const contentProps = { initialFocusRef };
        return !isFunction(content) ? content : content(contentProps);
    };

    render() {
        const {
            children,
            prefixCls,
            showArrow,
            arrowStyle = {},
            arrowBounding,
            position,
            style,
            trigger,
            ...attr
        } = this.props;
        let { spacing } = this.props;

        const arrowProps = {
            position,
            className: '',
            popStyle: style,
            arrowStyle,
        };

        const arrow = showArrow ? <Arrow {...arrowProps} /> : false;

        if (typeof spacing !== 'number') {
            spacing = showArrow ? numbers.SPACING_WITH_ARROW : numbers.SPACING;
        }

        const role = trigger === 'click' || trigger === 'custom' ? 'dialog' : 'tooltip';

        return (
            <Tooltip
                guardFocus
                {...(attr as any)}
                trigger={trigger}
                position={position}
                style={style}
                content={this.renderPopCard}
                prefixCls={prefixCls}
                spacing={spacing}
                showArrow={arrow}
                arrowBounding={arrowBounding}
                role={role}
            >
                {children}
            </Tooltip>
        );
    }
}
export default Popover;
