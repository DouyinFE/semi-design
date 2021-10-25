import BaseFoundation, { DefaultAdapter } from '../base/foundation';


export interface DropdownAdapter extends Partial<DefaultAdapter> {
    setPopVisible(visible: boolean): void;
    notifyVisibleChange(visible: boolean): void;
}

export default class DropdownFoundation extends BaseFoundation<DropdownAdapter> {
    handleVisibleChange(visible: boolean) {
        this._adapter.setPopVisible(visible);
        this._adapter.notifyVisibleChange(visible);
    }
}
