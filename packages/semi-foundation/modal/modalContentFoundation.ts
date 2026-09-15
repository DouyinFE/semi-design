import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import KeyCode from '../utils/keyCode';
import { ModalProps } from '../modal/modalFoundation';

export interface ModalContentProps extends ModalProps {
    onClose: (e: any) => void;
    getContainerContext: () => any;
    isFullScreen?: boolean;
    contentClassName?: string;
    maskClassName?: string;
    onAnimationEnd?: (e: any) => void;
    maskExtraProps?: Record<string, any>;
    contentExtraProps?: Record<string, any>
}

export interface ModalContentState {
    dialogMouseDown: boolean;
    prevFocusElement: HTMLElement
}

export interface ModalContentAdapter extends DefaultAdapter<ModalContentProps, ModalContentState> {
    notifyClose: (e: any) => void;
    notifyDialogMouseDown: () => void;
    notifyDialogMouseUp: () => void;
    addKeyDownEventListener: () => void;
    removeKeyDownEventListener: () => void;
    getMouseState: () => boolean;
    modalDialogFocus: () => void;
    modalDialogBlur: () => void;
    prevFocusElementReFocus: () => void
}

/**
 * Stack of `handleKeyDown` handlers for modals that currently listen on
 * `document`. Every ModalContent registers its own document-level keydown
 * listener, so `stopPropagation()` cannot stop sibling listeners on the same
 * node — one ESC used to close every open dialog. Only the most recently
 * mounted (top-most) listener should respond.
 */
const escListenerStack: Array<(e: any) => void> = [];

export default class ModalContentFoundation extends BaseFoundation<ModalContentAdapter> {

    constructor(adapter: ModalContentAdapter) {
        super({ ...ModalContentFoundation.defaultAdapter, ...adapter });
    }

    destroy() {
        this.handleKeyDownEventListenerUnmount();
        this.modalDialogBlur();
        this.prevFocusElementReFocus();
    }

    handleDialogMouseDown() {
        this._adapter.notifyDialogMouseDown();
    }

    handleMaskMouseUp() {
        this._adapter.notifyDialogMouseUp();
    }

    handleKeyDown = (e: any) => {
        const { closeOnEsc } = this.getProps();
        if (closeOnEsc && e.keyCode === KeyCode.ESC) {
            // Multiple open modals each registered a document-level keydown
            // listener; only the top-most (most recently mounted) one may
            // close, so a single ESC closes dialogs one at a time.
            if (escListenerStack[escListenerStack.length - 1] !== this.handleKeyDown) {
                return;
            }
            e.stopPropagation();
            this.close(e);
            return;
        }
    }

    handleKeyDownEventListenerMount() {
        this._adapter.addKeyDownEventListener();
        if (this.getProps().closeOnEsc) {
            escListenerStack.push(this.handleKeyDown);
        }
    }

    handleKeyDownEventListenerUnmount() {
        this._adapter.removeKeyDownEventListener();
        const index = escListenerStack.indexOf(this.handleKeyDown);
        if (index !== -1) {
            escListenerStack.splice(index, 1);
        }
    }

    getMouseState() {
        this._adapter.getMouseState();
    }

    handleMaskClick(e: any) {
        const { dialogMouseDown } = this.getStates();
        if (e.target === e.currentTarget && !dialogMouseDown) {
            this.close(e);
        }
    }

    close(e: any) {
        this._adapter.notifyClose(e);
    }

    modalDialogFocus() {
        this._adapter.modalDialogFocus();
    }

    modalDialogBlur() {
        this._adapter.modalDialogBlur();
    }

    prevFocusElementReFocus() {
        this._adapter.prevFocusElementReFocus();
    }
}
