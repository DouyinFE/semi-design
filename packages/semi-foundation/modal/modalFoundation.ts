import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import isPromise from "../utils/isPromise";
import { debounce } from 'lodash';

export type OKType = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';
export type Size = 'small' | 'medium' | 'large' | 'full-width';

export interface ModalAdapter extends DefaultAdapter<ModalProps, ModalState> {
    disabledBodyScroll: () => void;
    enabledBodyScroll: () => void;
    notifyCancel: (e: any) => void | Promise<any>;
    notifyOk: (e: any) => void | Promise<any>;
    notifyClose: () => void;
    toggleDisplayNone: (displayNone: boolean, callback?: (displayNone: boolean) => void) => void;
    notifyFullScreen: (isFullScreen: boolean) => void;
    getProps: () => ModalProps
}

export interface ModalProps {
    afterClose?: () => void;
    bodyStyle?: Record<string, any>;
    cancelButtonProps?: any;
    cancelText?: string;
    centered?: boolean;
    className?: string;
    modalContentClass?: string;
    closable?: boolean;
    confirmLoading?: boolean;
    cancelLoading?: boolean;
    content?: any;
    footer?: any;
    hasCancel?: boolean;
    header?: any;
    height?: string | number;
    mask?: boolean;
    maskClosable?: boolean;
    maskStyle?: Record<string, any>;
    maskFixed?: boolean;
    motion?: boolean;
    okButtonProps?: any;
    okText?: string;
    okType?: OKType;
    onCancel?: (e: any) => void | Promise<any>;
    onOk?: (e: any) => void | Promise<any>;
    style?: Record<string, any>;
    title?: any;
    visible?: boolean;
    width?: string | number;
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
    preventScroll?: boolean;
    footerFill?: boolean
}
export interface ModalState {
    displayNone: boolean;
    isFullScreen: boolean;
    onOKReturnPromiseStatus?: "pending"|"fulfilled"|"rejected";
    onCancelReturnPromiseStatus?: "pending"|"fulfilled"|"rejected"
}

export default class ModalFoundation extends BaseFoundation<ModalAdapter> {

    private _debouncedOk = debounce((e: any) => {
        this._invokeOk(e);
    }, 100, { leading: true, trailing: false });

    private _debouncedCancel = debounce((e: any) => {
        this._invokeCancel(e);
    }, 100, { leading: true, trailing: false });

    private _lastCancelTarget: EventTarget | null = null;
    private _lastOkTarget: EventTarget | null = null;

    constructor(adapter: ModalAdapter) {
        super({
            ...adapter,
        });
    }

    destroy() {
        this._debouncedOk.cancel();
        this._debouncedCancel.cancel();
        this.afterHide();
    }

    handleCancel(e: any) {
        const target = e?.currentTarget ?? e?.target ?? null;
        if (target !== this._lastCancelTarget) {
            this._debouncedCancel.cancel();
        }
        this._lastCancelTarget = target;
        this._debouncedCancel(e);
    }

    handleOk(e: any) {
        const target = e?.currentTarget ?? e?.target ?? null;
        if (target !== this._lastOkTarget) {
            this._debouncedOk.cancel();
        }
        this._lastOkTarget = target;
        this._debouncedOk(e);
    }

    private _invokeCancel(e: any) {
        const result = this._adapter.notifyCancel(e);
        if (isPromise(result)) {
            this._adapter.setState({ onCancelReturnPromiseStatus: "pending" });
            (result as Promise<any>)?.then(() => {
                this._adapter.setState({ onCancelReturnPromiseStatus: "fulfilled" });
            })?.catch(e => {
                this._adapter.setState({ onCancelReturnPromiseStatus: "rejected" });
                throw e;
            });
        }
    }

    private _invokeOk(e: any) {
        const result = this._adapter.notifyOk(e);
        if (isPromise(result)) {
            this._adapter.setState({ onOKReturnPromiseStatus: "pending" });
            (result as Promise<any>)?.then(() => {
                this._adapter.setState({ onOKReturnPromiseStatus: "fulfilled" });
            })?.catch(e => {
                this._adapter.setState({ onOKReturnPromiseStatus: "rejected" });
                throw e;
            });
        }
    }

    beforeShow() {
        this._adapter.disabledBodyScroll();
    }

    afterHide() {
        this._adapter.enabledBodyScroll();
        this._adapter.notifyClose();
    }

    enabledBodyScroll() {
        this._adapter.enabledBodyScroll();
    }

    toggleDisplayNone = (displayNone: boolean, callback?: (displayNone: boolean) => void) => {
        this._adapter.toggleDisplayNone(displayNone, callback);
    };
}
