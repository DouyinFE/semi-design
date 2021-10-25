import BaseFoundation, { DefaultAdapter } from '../base/foundation';


export interface BasicOptionProps {
    [x: string]: any;
    value?: string | number;
    label?: string | number | unknown;
    children?: unknown;
    disabled?: boolean;
    showTick?: boolean;
    className?: string;
    style?: Record<string, any>;
}
export interface OptionDefaultAdapter extends Partial<DefaultAdapter> {
    notifyClick(option: BasicOptionProps): void;
}


export default class OptionFoundation extends BaseFoundation<OptionDefaultAdapter> {

    constructor(adapter: OptionDefaultAdapter) {
        super({ ...adapter });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    destroy() {}

    onOptionClick(option: BasicOptionProps) {
        const isDisbled = this.isDisbled_();
        if (!isDisbled) {
            this._adapter.notifyClick(option);
        }
    }

    isDisbled_() {
        return this.getProp('disabled');
    }
}