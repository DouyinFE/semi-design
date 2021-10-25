import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export interface RadioAdapter extends DefaultAdapter {
    setHover: (hover: boolean) => void;
}
export default class RadioFoundation extends BaseFoundation<RadioAdapter> {
    setHover(hover: boolean) {
        this._adapter.setHover(hover);
    }
}
