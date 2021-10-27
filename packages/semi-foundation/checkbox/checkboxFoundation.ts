import BaseFoundation, { DefaultAdapter, noopFunction } from '../base/foundation';

export interface BasicTargetObject {
    [x: string]: any;
    checked?: boolean;
}
export interface BasicCheckboxEvent {
    target: BasicTargetObject;
    stopPropagation: () => void;
    preventDefault: () => void;
}
export interface CheckboxAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getIsInGroup: () => boolean;
    getGroupValue: () => any[];
    notifyGroupChange: (event: BasicCheckboxEvent) => void;
    getGroupDisabled: () => boolean;
    setNativeControlChecked: (checked: boolean) => void;
    getState: noopFunction;
    notifyChange: (event: BasicCheckboxEvent) => void;
}

class CheckboxFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<CheckboxAdapter<P, S>, P, S> {

    constructor(adapter: CheckboxAdapter<P, S>) {
        super({ ...adapter });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init() {}

    getEvent(checked: boolean, e: MouseEvent) {
        const props = this.getProps();
        const cbValue = {
            target: {
                ...props,
                checked,
            },
            stopPropagation: () => {
                e.stopPropagation();
            },
            preventDefault: () => {
                e.preventDefault();
            },
        };
        return cbValue;
    }

    notifyChange(checked: boolean, e: MouseEvent) {
        const cbValue = this.getEvent(checked, e);
        this._adapter.notifyChange(cbValue);
    }

    handleChange(e: MouseEvent) {
        const disabled = this.getProp('disabled');

        if (disabled) {
            return;
        }

        const isInGroup = this._adapter.getIsInGroup();

        if (isInGroup) {
            const groupDisabled = this._adapter.getGroupDisabled();
            if (!groupDisabled) {
                this.handleChangeInGroup(e);
            }
            return;
        }

        const checked = this.getState('checked');

        const newChecked = !checked;
        if (this._isControlledComponent('checked')) {
            this.notifyChange(newChecked, e);
        } else {
            this.setChecked(newChecked);
            this.notifyChange(newChecked, e);
        }
    }

    handleChangeInGroup(e: MouseEvent) {
        const { value } = this.getProps();
        const groupValue = this._adapter.getGroupValue();
        const checked = groupValue.includes(value);
        const newChecked = !checked;
        const event = this.getEvent(newChecked, e);
        this._adapter.notifyChange(event);
        this._adapter.notifyGroupChange(event);
    }

    setChecked(checked: boolean) {
        this._adapter.setNativeControlChecked(checked);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    destroy() {}
}

export interface BaseCheckboxProps {
    autoFocus?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
    onChange?: (e: BasicCheckboxEvent) => any;
    value?: any;
    style?: Record<string, any>;
    className?: string;
    prefixCls?: string;
    onMouseEnter?: (e: any) => void;
    onMouseLeave?: (e: any) => void;
    extra?: any;
}

export default CheckboxFoundation;
