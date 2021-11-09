import { get } from 'lodash';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { Motion } from '../utils/type';

export type OKType = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';
export type Size = 'small' | 'medium' | 'large' | 'full-width';

export interface ModalAdapter extends DefaultAdapter<ModalProps, ModalState> {
    disabledBodyScroll: () => void;
    enabledBodyScroll: () => void;
    notifyCancel: (e: any) => void;
    notifyOk: (e: any) => void;
    notifyClose: () => void;
    toggleHidden: (hidden: boolean) => void;
    notifyFullScreen: (isFullScreen: boolean) => void;
    getProps: () => ModalProps;
}

export interface ModalProps {
    afterClose?: () => void;
    bodyStyle?: Record<string, any>;
    cancelButtonProps?: any;
    cancelText?: string;
    centered?: boolean;
    className?: string;
    closable?: boolean;
    confirmLoading?: boolean;
    cancelLoading?: boolean;
    content?: any;
    footer?: any;
    hasCancel?: boolean;
    header?: any;
    height?: number;
    mask?: boolean;
    maskClosable?: boolean;
    maskStyle?: Record<string, any>;
    maskFixed?: boolean;
    motion?: Motion;
    okButtonProps?: any;
    okText?: string;
    okType?: OKType;
    onCancel?: (e: any) => void | Promise<any>;
    onOk?: (e: any) => void | Promise<any>;
    style?: Record<string, any>;
    title?: any;
    visible?: boolean;
    width?: number;
    zIndex?: number;
    icon?: any;
    getPopupContainer?: () => HTMLElement;
    closeIcon?: any;
    closeOnEsc?: boolean;
    size?: Size;
    lazyRender?: boolean;
    keepDOM?: boolean;
    direction?: any;
    fullScreen?: boolean;
}

export interface ModalState {
    hidden: boolean;
    isFullScreen: boolean;
}

export default class ModalFoundation extends BaseFoundation<ModalAdapter> {

    constructor(adapter: ModalAdapter) {
        super({
            ...adapter,
        });
    }

    destroy() {
        this.afterHide();
    }

    handleCancel(e: any) {
        this._adapter.notifyCancel(e);
    }

    handleOk(e: any) {
        this._adapter.notifyOk(e);
    }

    beforeShow() {
        this._adapter.disabledBodyScroll();
    }

    afterHide() {
        this._adapter.enabledBodyScroll();
    }

    afterClose() {
        this._adapter.notifyClose();
    }


    toggleHidden = (hidden: boolean) => {
        this._adapter.toggleHidden(hidden);
    };

    // // eslint-disable-next-line max-len
    // mergeMotionProp = (motion: Motion, prop: string, cb: () => void) => {
    //     const mergedMotion = typeof (motion) === 'undefined' || motion ? {
    //         ...(motion as { [key: string]: (() => void) | boolean }),
    //         [prop]: (...args: any) => {
    //             const curr = get(motion, prop);
    //             if (typeof curr === 'function') {
    //                 curr(...args);
    //             }
    //             cb();
    //         }
    //     } : false;
    //     return mergedMotion;
    // };
    //
    // getMergedMotion() {
    //     let { motion } = this._adapter.getProps();
    //     const { keepDOM } = this._adapter.getProps();
    //     motion = this.mergeMotionProp(motion, 'didLeave', this.afterClose.bind(this));
    //     if (!keepDOM) {
    //         return motion;
    //     }
    //     const mergedMotion = this.mergeMotionProp(motion, 'didLeave', this.toggleHidden.bind(this, true));
    //     return mergedMotion;
    // }
}
