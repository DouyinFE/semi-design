/* eslint-disable react/destructuring-assignment, prefer-const, @typescript-eslint/no-unused-vars */
import React, { CSSProperties, LegacyRef, ReactNode } from 'react';
import { cssClasses, strings } from '@douyinfe/semi-foundation/modal/constants';
import Button from '../button';
import ModalFoundation, { ModalAdapter, ModalProps, ModalState } from '@douyinfe/semi-foundation/modal/modalFoundation';
import ModalContent from './ModalContent';
import Portal from '../_portal';
import LocaleConsumer from '../locale/localeConsumer';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { noop } from 'lodash-es';
import '@douyinfe/semi-foundation/modal/modal.scss';
import BaseComponent from '../_base/baseComponent';
import confirm, { withConfirm, withError, withInfo, withSuccess, withWarning } from '../modal/confirm';
import { Locale } from '../locale/interface';
import useModal from '../modal/useModal';
import { ButtonProps } from '../button/Button';

export const destroyFns: any[] = [];
export type ConfirmType = 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
export type Directions = 'ltr' | 'rtl';

export interface ModalReactProps extends ModalProps {
    cancelButtonProps?: ButtonProps;
    okButtonProps?: ButtonProps;
    bodyStyle?: CSSProperties;
    maskStyle?: CSSProperties;
    style?: CSSProperties;
    icon?: ReactNode;
    closeIcon?: ReactNode;
    title?: ReactNode;
    content?: ReactNode;
    footer?: ReactNode;
    header?: ReactNode;
    onCancel?: (e: React.MouseEvent) => void | Promise<any>;
    onOk?: (e: React.MouseEvent) => void | Promise<any>;
}

export {
    ModalState
};

class Modal extends BaseComponent<ModalReactProps, ModalState> {

    static propTypes = {
        mask: PropTypes.bool,
        closable: PropTypes.bool,
        centered: PropTypes.bool,
        visible: PropTypes.bool,
        width: PropTypes.number,
        height: PropTypes.number,
        confirmLoading: PropTypes.bool,
        cancelLoading: PropTypes.bool,
        okText: PropTypes.string,
        okType: PropTypes.string,
        cancelText: PropTypes.string,
        maskClosable: PropTypes.bool,
        onCancel: PropTypes.func,
        onOk: PropTypes.func,
        afterClose: PropTypes.func,
        okButtonProps: PropTypes.object,
        cancelButtonProps: PropTypes.object,
        style: PropTypes.object,
        className: PropTypes.string,
        maskStyle: PropTypes.object,
        bodyStyle: PropTypes.object,
        zIndex: PropTypes.number,
        title: PropTypes.node,
        icon: PropTypes.node,
        header: PropTypes.node,
        footer: PropTypes.node,
        hasCancel: PropTypes.bool,
        motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.func, PropTypes.object]),
        children: PropTypes.node,
        getPopupContainer: PropTypes.func,
        getContainerContext: PropTypes.func,
        maskFixed: PropTypes.bool,
        closeIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        closeOnEsc: PropTypes.bool,
        size: PropTypes.oneOf(strings.SIZE),
        keepDOM: PropTypes.bool,
        lazyRender: PropTypes.bool,
        direction: PropTypes.oneOf(strings.directions),
        fullScreen: PropTypes.bool,
    };


    static defaultProps = {
        zIndex: 1000,
        motion: true,
        mask: true,
        centered: false,
        closable: true,
        visible: false,
        confirmLoading: false,
        cancelLoading: false,
        okType: 'primary',
        maskClosable: true,
        hasCancel: true,
        onCancel: noop,
        onOk: noop,
        afterClose: noop,
        maskFixed: false,
        closeOnEsc: false,
        size: 'small',
        keepDOM: false,
        lazyRender: true,
        fullScreen: false,
    };
    static useModal = useModal;
    foundation: ModalFoundation;

    private readonly modalRef: LegacyRef<ModalContent>;
    private bodyOverflow: string;
    private scrollBarWidth: number;
    private originBodyWith: string;
    private _active: boolean;

    constructor(props: ModalReactProps) {
        super(props);
        this.state = {
            hidden: !props.visible,
            isFullScreen: props.fullScreen,
        };
        this.foundation = new ModalFoundation(this.adapter);
        this.modalRef = React.createRef();
        this.bodyOverflow = '';
        this.scrollBarWidth = 0;
        this.originBodyWith = '100%';
    }

    get adapter(): ModalAdapter {
        return {
            ...super.adapter,
            getProps: () => this.props,
            disabledBodyScroll: () => {
                const { getPopupContainer } = this.props;
                this.bodyOverflow = document.body.style.overflow || '';
                if (!getPopupContainer && this.bodyOverflow !== 'hidden') {
                    document.body.style.overflow = 'hidden';
                    document.body.style.width = `calc(${this.originBodyWith || '100%'} - ${this.scrollBarWidth}px)`;
                }
            },
            enabledBodyScroll: () => {
                const { getPopupContainer } = this.props;
                if (!getPopupContainer && this.bodyOverflow !== 'hidden') {
                    document.body.style.overflow = this.bodyOverflow;
                    document.body.style.width = this.originBodyWith;
                }
            },
            notifyCancel: (e: React.MouseEvent) => {
                this.props.onCancel(e);
            },
            notifyOk: (e: React.MouseEvent) => {
                this.props.onOk(e);
            },
            notifyClose: () => {
                this.props.afterClose();
            },
            toggleHidden: (hidden: boolean) => {
                if (hidden !== this.state.hidden) {
                    this.setState({ hidden });
                }
            },
            notifyFullScreen: (isFullScreen: boolean) => {
                if (isFullScreen !== this.state.isFullScreen) {
                    this.setState({ isFullScreen });
                }
            },
        };
    }

    static getDerivedStateFromProps(props: ModalReactProps, prevState: ModalState) {
        const newState: Partial<ModalState> = {};

        if (props.visible && prevState.hidden) {
            newState.hidden = false;
        }
        if (props.fullScreen !== prevState.isFullScreen) {
            newState.isFullScreen = props.fullScreen;
        }

        // if not using animation, need to update hidden state from props
        if (!props.visible && !props.motion && !prevState.hidden) {
            newState.hidden = true;
        }
        return newState;
    }

    static getScrollbarWidth() {
        if (globalThis && Object.prototype.toString.call(globalThis) === '[object Window]') {
            return window.innerWidth - document.documentElement.clientWidth;
        }
        return 0;
    }


    static info = function (props: ModalReactProps) {
        return confirm(withInfo(props));
    };

    static success = function (props: ModalReactProps) {
        return confirm(withSuccess(props));
    };

    static error = function (props: ModalReactProps) {
        return confirm(withError(props));
    };

    static warning = function (props: ModalReactProps) {
        return confirm(withWarning(props));
    };

    static confirm = function (props: ModalReactProps) {
        return confirm(withConfirm(props));
    };

    static destroyAll = function destroyAllFn() {
        while (destroyFns.length) {
            const close = destroyFns.pop();
            if (close) {
                close();
            }
        }
    };


    componentDidMount() {

        this.scrollBarWidth = Modal.getScrollbarWidth();
        this.originBodyWith = document.body.style.width;
        if (this.props.visible) {
            this.foundation.beforeShow();
            this._active = this._active || this.props.visible;
        }
    }

    componentDidUpdate(prevProps: ModalReactProps, prevState: ModalState, snapshot: any) {
        // hide => show
        if (!prevProps.visible && this.props.visible) {
            this.foundation.beforeShow();
        }
        // show => hide
        if (prevProps.visible && !this.props.visible) {
            this.foundation.afterHide();
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

    handleOk = (e: React.MouseEvent) => {
        this.foundation.handleOk(e);
    };

    renderFooter = (): ReactNode => {
        const {
            okText,
            okType,
            cancelText,
            confirmLoading,
            cancelLoading,
            hasCancel,
        } = this.props;
        const getCancelButton = (locale: Locale['Modal']) => {
            if (!hasCancel) {
                return null;
            } else {
                return (
                    <Button
                        onClick={this.handleCancel}
                        loading={cancelLoading}
                        type="tertiary"
                        {...this.props.cancelButtonProps}
                    >
                        {cancelText || locale.cancel}
                    </Button>
                );
            }
        };

        return (
            <LocaleConsumer componentName="Modal">
                {(locale: Locale['Modal'], localeCode: Locale['code']) => (
                    <div>
                        {getCancelButton(locale)}
                        <Button
                            type={okType}
                            theme="solid"
                            loading={confirmLoading}
                            onClick={this.handleOk}
                            {...this.props.okButtonProps}
                        >
                            {okText || locale.confirm}
                        </Button>
                    </div>
                )}
            </LocaleConsumer>
        );
    };

    // getDialog = () => {
    //     const {
    //         footer,
    //         ...restProps
    //     } = this.props;
    //     const renderFooter = 'footer' in this.props ? footer : this.renderFooter();
    //     return <ModalContent {...restProps} footer={renderFooter} onClose={this.handleCancel}/>;
    // };

    renderDialog = () => {
        let {
            footer,
            className,
            motion,
            maskStyle: maskStyleFromProps,
            keepDOM,
            style: styleFromProps,
            zIndex,
            getPopupContainer,
            visible,
            ...restProps
        } = this.props;
        let style = styleFromProps;
        const maskStyle = maskStyleFromProps;
        const renderFooter = 'footer' in this.props ? footer : this.renderFooter();
        if (this.props.centered) {
            style = {
                transform: 'translateY(-50%)',
                top: '50%', ...style,
            };
        }
        let wrapperStyle: {
            zIndex?: CSSProperties['zIndex'];
            position?: CSSProperties['position'];
        } = {
            zIndex,
        };
        if (getPopupContainer) {
            wrapperStyle = {
                zIndex,
                position: 'static',
            };
        }

        const classList = cls(className, {
            [`${cssClasses.DIALOG}-displayNone`]: keepDOM && this.state.hidden,
        });
        const contentClassName = cls({
            [`${cssClasses.DIALOG}-content-animate-hide`]: !visible,
            [`${cssClasses.DIALOG}-content-animate-show`]: visible
        });
        const maskClassName = cls({
            [`${cssClasses.DIALOG}-mask-animate-hide`]: !visible,
            [`${cssClasses.DIALOG}-mask-animate-show`]: visible
        })

        return (
            <Portal style={wrapperStyle} getPopupContainer={getPopupContainer}>
                <ModalContent
                    {...restProps}
                    isFullScreen={this.state.isFullScreen}
                    contentClassName={contentClassName}
                    maskClassName={maskClassName}
                    className={classList}
                    getPopupContainer={getPopupContainer}
                    maskStyle={maskStyle}
                    style={style}
                    ref={this.modalRef}
                    onAnimationEnd={() => {
                        if (!visible && !this.state.hidden) {
                            this.foundation.toggleHidden(true)
                        } else if (visible && this.state.hidden) {
                            this.foundation.toggleHidden(false)
                        }
                    }}
                    footer={renderFooter}
                    onClose={this.handleCancel}

                />
            </Portal>
        );
    };

    render() {
        const {
            visible,
            keepDOM,
            lazyRender,
        } = this.props;
        this._active = this._active || visible;
        const shouldRender = ((visible || keepDOM) && (!lazyRender || this._active)) || !this.state.hidden;
        if (shouldRender) {
            return this.renderDialog();
        }

        return null;
    }


}


export default Modal;
