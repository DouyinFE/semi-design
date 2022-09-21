/* eslint-disable no-nested-ternary */
import React, { CSSProperties } from 'react';
import BaseComponent from '../_base/baseComponent';
import PropTypes from 'prop-types';
import Portal from '../_portal';
import cls from 'classnames';
import ConfigContext, { ContextValue } from '../configProvider/context';
import { cssClasses, strings } from '@douyinfe/semi-foundation/sideSheet/constants';
import SideSheetContent from './SideSheetContent';
import { noop } from 'lodash';
import SideSheetFoundation, {
    SideSheetAdapter,
    SideSheetProps,
    SideSheetState
} from '@douyinfe/semi-foundation/sideSheet/sideSheetFoundation';
import '@douyinfe/semi-foundation/sideSheet/sideSheet.scss';
import CSSAnimation from "../_cssAnimation";
import { executeWhenCallTimesEnough } from "@douyinfe/semi-ui/_utils";

const prefixCls = cssClasses.PREFIX;
const defaultWidthList = strings.WIDTH;
const defaultHeight = strings.HEIGHT;

export type { SideSheetContentProps } from './SideSheetContent';
export type { SideSheetTransitionProps } from './SideSheetTransition';

export interface SideSheetReactProps extends SideSheetProps {
    bodyStyle?: CSSProperties;
    headerStyle?: CSSProperties;
    maskStyle?: CSSProperties;
    style?: CSSProperties;
    title?: React.ReactNode;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    onCancel?: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

export type {
    SideSheetState
};

export default class SideSheet extends BaseComponent<SideSheetReactProps, SideSheetState> {
    static contextType = ConfigContext;
    static propTypes = {
        bodyStyle: PropTypes.object,
        headerStyle: PropTypes.object,
        children: PropTypes.node,
        className: PropTypes.string,
        closable: PropTypes.bool,
        disableScroll: PropTypes.bool,
        getPopupContainer: PropTypes.func,
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        mask: PropTypes.bool,
        maskClosable: PropTypes.bool,
        maskStyle: PropTypes.object,
        motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.func]),
        onCancel: PropTypes.func,
        placement: PropTypes.oneOf(strings.PLACEMENT),
        size: PropTypes.oneOf(strings.SIZE),
        style: PropTypes.object,
        title: PropTypes.node,
        visible: PropTypes.bool,
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        zIndex: PropTypes.number,
        afterVisibleChange: PropTypes.func,
        closeOnEsc: PropTypes.bool,
        footer: PropTypes.node,
        keepDOM: PropTypes.bool,
        'aria-label': PropTypes.string,
    };

    static defaultProps: SideSheetReactProps = {
        visible: false,
        motion: true,
        mask: true,
        placement: 'right',
        closable: true,
        footer: null,
        zIndex: 1000,
        maskClosable: true,
        size: 'small',
        disableScroll: true,
        closeOnEsc: false,
        afterVisibleChange: noop,
        keepDOM: false
    };
    private _active: boolean;

    constructor(props: SideSheetReactProps) {
        super(props);
        this.state = { hidden: !this.props.visible, shouldRender: this.props.visible };
        this.foundation = new SideSheetFoundation(this.adapter);
    }

    context: ContextValue;

    get adapter(): SideSheetAdapter {
        return {
            ...super.adapter,
            disabledBodyScroll: () => {
                const { getPopupContainer } = this.props;
                if (!getPopupContainer && document) {
                    document.body.style.overflow = 'hidden';
                }
            },
            enabledBodyScroll: () => {
                const { getPopupContainer } = this.props;
                if (!getPopupContainer && document) {
                    document.body.style.overflow = '';
                }
            },
            notifyCancel: (e: React.MouseEvent | React.KeyboardEvent) => {
                this.props.onCancel && this.props.onCancel(e);
            },
            notifyVisibleChange: (visible: boolean) => {
                this.props.afterVisibleChange(visible);
            },
            setOnKeyDownListener: () => {
                if (window) {
                    window.addEventListener('keydown', this.handleKeyDown);
                }
            },
            removeKeyDownListener: () => {
                if (window) {
                    window.removeEventListener('keydown', this.handleKeyDown);
                }
            },
            toggleHidden: (hidden: boolean) => {
                if (hidden !== this.state.hidden) {
                    this.setState({ hidden });
                }
            },
            setShouldRender: (shouldRender: boolean) => {
                if (shouldRender !== this.state.shouldRender) {
                    this.setState({ shouldRender });
                }
            }
        };
    }

    static getDerivedStateFromProps(props: SideSheetReactProps, prevState: SideSheetState) {
        const newState: Partial<SideSheetState> = {};

        if (props.visible && prevState.hidden) {
            newState.hidden = false;
        }

        if (!props.visible && !props.motion && !prevState.hidden) {
            newState.hidden = true;
        }
        return newState;
    }

    componentDidMount() {
        if (this.props.visible) {
            this.foundation.beforeShow();
        }
    }

    componentDidUpdate(prevProps: SideSheetReactProps, prevState: SideSheetState, snapshot: any) {
        // hide => show
        if (!prevProps.visible && this.props.visible) {
            this.foundation.beforeShow();
        }
        // show => hide
        if (prevProps.visible && !this.props.visible) {
            this.foundation.afterHide();
        }


        const shouldRender = (this.props.visible || this.props.keepDOM);
        if (shouldRender === true && this.state.shouldRender === false) {
            this.foundation.setShouldRender(true);
        }
        if (prevState.hidden!==this.state.hidden){
            this.foundation.onVisibleChange(!this.state.hidden);
        }

        if (!this.props.motion){
            // if motion is true, we should set state after animation end, so we don't need to set state here
            this.updateState();
        }
    }

    componentWillUnmount() {
        if (this.props.visible) {
            this.foundation.destroy();
        }
    }

    handleCancel = (e: React.MouseEvent) => {
        this.foundation.handleCancel(e);
    };

    handleKeyDown = (e: KeyboardEvent) => {
        this.foundation.handleKeyDown(e);
    };

    updateState = ()=>{
        const shouldRender = (this.props.visible || this.props.keepDOM);
        this.foundation.setShouldRender(shouldRender);
        this.foundation.toggleHidden(!this.props.visible);
    }

    renderContent() {
        const {
            placement,
            className,
            children,
            width,
            height,
            motion,
            visible,
            style,
            maskStyle,
            size,
            zIndex,
            getPopupContainer,
            keepDOM,
            ...props
        } = this.props;
        const { direction } = this.context;
        const isVertical = placement === 'left' || placement === 'right';
        const isHorizontal = placement === 'top' || placement === 'bottom';
        const sheetWidth = isVertical ? (width ? width : defaultWidthList[size]) : '100%';
        const sheetHeight = isHorizontal ? (height ? height : defaultHeight) : '100%';
        const classList = cls(prefixCls, className, {
            [`${prefixCls}-${placement}`]: placement,
            [`${prefixCls}-popup`]: getPopupContainer,
            [`${prefixCls}-horizontal`]: isHorizontal,
            [`${prefixCls}-rtl`]: direction === 'rtl',
            [`${prefixCls}-hidden`]: keepDOM && this.state.hidden,
        });
        const contentProps = {
            ...props,
            visible,
            motion: false,
            className: classList,
            width: sheetWidth,
            height: sheetHeight,
            onClose: this.handleCancel,
        };

        // Since user could change animate duration , we don't know which animation end first. So we call updateState func twice.

        if (this.props.motion) {
            return <CSSAnimation animationState={visible ? 'enter' : 'leave'} startClassName={
                visible ? `${prefixCls}-animation-mask_show` : `${prefixCls}-animation-mask_hide`
            } onAnimationEnd={this.updateState}>
                {
                    ({
                        animationClassName: maskAnimationClassName,
                        animationEventsNeedBind: maskAnimationEventsNeedBind
                    }) => {
                        return <CSSAnimation
                            animationState={visible ? 'enter' : 'leave'}
                            startClassName={visible ? `${prefixCls}-animation-content_show_${this.props.placement}` : `${prefixCls}-animation-content_hide_${this.props.placement}`}
                            onAnimationEnd={this.updateState /* for no mask case*/}
                        >
                            {({ animationClassName, animationStyle, animationEventsNeedBind }) => {
                                return this.state.shouldRender ? <SideSheetContent
                                    {...contentProps}
                                    maskExtraProps={maskAnimationEventsNeedBind}
                                    wrapperExtraProps={animationEventsNeedBind}
                                    dialogClassName={animationClassName}
                                    maskClassName={maskAnimationClassName}
                                    style={{ ...animationStyle, ...style }}>
                                    {children}
                                </SideSheetContent> : <></>;
                            }}
                        </CSSAnimation>;

                    }
                }
            </CSSAnimation>;
        }
        if (this.state.shouldRender) {
            return (
                <SideSheetContent {...contentProps} style={style} maskStyle={maskStyle}>
                    {children}
                </SideSheetContent>
            );
        }
        return null;
    }

    render() {
        const {
            zIndex,
            getPopupContainer,
        } = this.props;
        let wrapperStyle: CSSProperties = {
            zIndex,
        };
        if (getPopupContainer) {
            wrapperStyle = {
                zIndex,
                position: 'static',
            };
        }
        return (
            <Portal getPopupContainer={getPopupContainer} style={wrapperStyle}>
                {this.renderContent()}
            </Portal>
        );
    }
}

