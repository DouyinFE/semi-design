/* eslint-disable @typescript-eslint/no-empty-function */

import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export interface PopconfirmAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    setVisible: (visible: boolean) => void;
    notifyConfirm: (e: any) => void;
    notifyCancel: (e: any) => void;
    notifyVisibleChange: (visible: boolean) => void;
    notifyClickOutSide: (e: any) => void;
}

export default class PopConfirmFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<PopconfirmAdapter<P, S>, P, S> {

    init(): void {}

    destroy(): void {}

    handleCancel(e: any): void {
        this._adapter.notifyCancel(e);
        this.handleVisibleChange(false);
    }

    handleConfirm(e: any): void {
        this._adapter.notifyConfirm(e);
        this.handleVisibleChange(false);
    }

    handleClickOutSide(e: any): void {
        this._adapter.notifyClickOutSide(e);
    }

    handleVisibleChange(visible: boolean): void {
        if (!this._isControlledComponent('visible')) {
            this._adapter.setVisible(visible);
        }
        this._adapter.notifyVisibleChange(visible);
    }
}
