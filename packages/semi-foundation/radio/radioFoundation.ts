import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export interface RadioAdapter extends DefaultAdapter {
    setHover: (hover: boolean) => void;
    setAddonId: () => void;
    setExtraId: () => void;
}
export default class RadioFoundation extends BaseFoundation<RadioAdapter> {
    init() {
        const { children, extra, extraId, addonId } = this._adapter.getProps();
        if (children && !addonId) {
            this._adapter.setAddonId();
        }
        if (extra && !extraId) {
            this._adapter.setExtraId();
        }
    }
    setHover(hover: boolean) {
        this._adapter.setHover(hover);
    }
}
