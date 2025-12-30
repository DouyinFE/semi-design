import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import KeyCode from '../utils/keyCode';

export interface ContainerProps {
    title?: any;
    resizable?: boolean;
    style?: Record<string, any>;
    className?: string;
    defaultSize?: { width?: number | string; height?: number | string };
    onCancel?: (e: any) => void;
    children?: any;
    visible?: boolean;
    motion?: boolean;
    afterVisibleChange?: (isVisible: boolean) => void;
    minWidth?: string | number;
    maxWidth?: string | number;
    showClose?: boolean
}

export interface ContainerState {
    displayNone: boolean;
    onCancelReturnPromiseStatus?: "pending"|"fulfilled"|"rejected"
}

export interface ContainerAdapter extends DefaultAdapter<ContainerProps, ContainerState> {
    notifyCancel: (e: any) => void;
    notifyVisibleChange: (visible: boolean) => void;
    setOnKeyDownListener: () => void;
    removeKeyDownListener: () => void;
    toggleDisplayNone: (displayNone: boolean) => void
}

export default class ContainerFoundation extends BaseFoundation<ContainerAdapter> {
    constructor(adapter: ContainerAdapter) {
        super({ ...ContainerFoundation.defaultAdapter, ...adapter });
    }

    init = () => {};

    destroy = () => {
        this.afterHide();
    };

    handleCancel(e: any) {
        this._adapter.notifyCancel(e);
    }

    beforeShow() {
        this._adapter.setOnKeyDownListener();
    }

    afterHide() {
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

    onVisibleChange(visible: boolean) {
        this._adapter.notifyVisibleChange(visible);
    }

    toggleDisplayNone = (displayNone: boolean) => {
        this._adapter.toggleDisplayNone(displayNone);
    }

    handleAnimationEnd = () => {
        const { visible } = this.getProps();
        this.toggleDisplayNone(!visible);
    }
}
