import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { get, noop } from 'lodash-es';
import KeyCode from '../utils/keyCode';
import { Motion } from '../utils/type';


export interface SideSheetProps {
    afterVisibleChange?: (isVisible: boolean) => void;
    bodyStyle?: Record<string, any>;
    className?: string;
    closable?: boolean;
    closeOnEsc?: boolean;
    disableScroll?: boolean;
    footer?: any;
    getPopupContainer?: () => HTMLElement;
    headerStyle?: Record<string, any>;
    height?: number | string;
    keepDOM?: boolean;
    mask?: boolean;
    maskClosable?: boolean;
    maskStyle?: Record<string, any>;
    motion?: Motion;
    onCancel?: (e: any) => void;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    size?: 'small' | 'medium' | 'large';
    style?: Record<string, any>;
    title?: any;
    visible?: boolean;
    width?: number | string;
    zIndex?: number;
    children?: any;
}

export interface SideSheetState{
    hidden: boolean;
}

export interface SideSheetAdapter extends DefaultAdapter<SideSheetProps, SideSheetState>{
    disabledBodyScroll: () => void;
    enabledBodyScroll: () => void;
    notifyCancel: (e: any) => void;
    notifyVisibleChange: (visible: boolean) => void;
    setOnKeyDownListener: () => void;
    removeKeyDownListener: () => void;
    toggleHidden: (hidden: boolean) => void;
}





export default class SideSheetFoundation extends BaseFoundation<SideSheetAdapter> {
    constructor(adapter: SideSheetAdapter) {
        super({ ...SideSheetFoundation.defaultAdapter, ...adapter });
    }

    get defaultAdapter() {
        return ({
            handleCancel: noop,
            beforeShow: noop,
            afterHide: noop,
        });
    }

    destroy() {
        this.afterHide();
    }

    handleCancel(e: any) {
        this._adapter.notifyCancel(e);
    }

    beforeShow() {
        const allowDisable = this.getProp('disableScroll');
        allowDisable && this._adapter.disabledBodyScroll();
        this._adapter.setOnKeyDownListener();
    }

    afterHide() {
        const allowDisable = this.getProp('disableScroll');
        allowDisable && this._adapter.enabledBodyScroll();
        this._adapter.removeKeyDownListener();
    }

    handleKeyDown(e: any) {
        const { closeOnEsc } = this.getProps();
        if (closeOnEsc && e.keyCode === KeyCode.ESC) {
            e.stopPropagation();
            this.handleCancel(e);
            return;
        }
    }

    mergeMotionProp = (motion: any, prop: string, cb: () => void) => {
        const mergedMotion = typeof (motion) === 'undefined' || motion ? {
            ...motion,
            [prop]: (...args: any) => {
                const curr = get(motion, prop);
                if (typeof curr === 'function') {
                    curr(...args);
                }
                cb();
            },
        } : false;
        return mergedMotion;
    };

    getMergedMotion = () => {
        const {
            motion,
            visible,
            keepDOM,
        } = this.getProps();
        let mergedMotion = this.mergeMotionProp(motion, 'didEnter', (...args) => {
            const didEnter = get(motion, 'didEnter');
            if (typeof didEnter === 'function') {
                didEnter(...args);
            }
            this._adapter.notifyVisibleChange(visible);
        });
        mergedMotion = this.mergeMotionProp(mergedMotion, 'didLeave', (...args) => {
            const didLeave = get(motion, 'didLeave');
            if (typeof didLeave === 'function') {
                didLeave(...args);
            }
            this._adapter.notifyVisibleChange(visible);
        });
        if (keepDOM) {
            mergedMotion = this.mergeMotionProp(mergedMotion, 'didLeave', this._adapter.toggleHidden.bind(this, true));
        }
        return mergedMotion;
    };
}
