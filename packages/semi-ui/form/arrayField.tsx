/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { getUuidv4 } from '@douyinfe/semi-foundation/utils/uuid';
import { cloneDeep, isUndefined, isEqual, get } from 'lodash';
import { FormUpdaterContext, ArrayFieldContext } from './context';
import warning from '@douyinfe/semi-foundation/utils/warning';
import type { ArrayFieldStaff, FormUpdaterContextType } from '@douyinfe/semi-foundation/form/interface';

export interface ArrayFieldProps {
    initValue?: any[];
    field?: string;
    children?: (props: ArrayFieldChildrenProps) => React.ReactNode
}

export interface ArrayFieldChildrenProps {
    arrayFields: {
        key: string;
        field: string;
        remove: () => void
    }[];
    add: () => void;
    addWithInitValue: (lineObject: Record<string, any>) => void
}

export interface ArrayFieldState {
    keys: string[]
}

const filterArrayByIndex = (array: any[], index: number) => array.filter((item, i) => i !== index);

const getUuidByArray = (array: any[]) => array.map(() => getUuidv4());

// const getUpdateKey = (arrayField: ArrayFieldStaff): string | undefined => {
//     if (!arrayField) {
//         return undefined;
//     }
//     // TODO
//     if (arrayField && arrayField.updateKey) {
//         return arrayField.updateKey;
//     }
//     return undefined;
// };

const initValueAdapter = (initValue: any) => {
    const iv: any[] = [];
    if (Array.isArray(initValue)) {
        return initValue;
    } else {
        warning(
            !isUndefined(initValue),
            '[Semi Form ArrayField] initValue of ArrayField must be an array. Please check the type of your props'
        );
        return iv;
    }
};

/**
 *
 * @param {any[]} value
 * @param {string[]} oldKeys
 * @param {any[]} cacheValue
 * @returns string[]
 */
const generateKeys = (value: any[] = [], oldKeys?: string[], cacheValues: any[] = []) => {
    const val = initValueAdapter(value);
    const newKeys = getUuidByArray(val);
    const keys = [];

    //  todo cacheValue 与 oldKeys 是对不上的

    value.forEach((newRow, i) => {
        const cacheRow = get(cacheValues, i);
        if (!isEqual(newRow, cacheRow)) {
            keys[i] = newKeys[i];
        } else {
            keys[i] = oldKeys && oldKeys[i] ? oldKeys[i] : newKeys[i];
        }

    });
    return keys;
};

class ArrayFieldComponent extends Component<ArrayFieldProps, ArrayFieldState> {
    static contextType = FormUpdaterContext;

    cacheFieldValues: any[] | null;
    shouldUseInitValue: boolean;
    // cacheUpdateKey: string;
    context: FormUpdaterContextType;

    constructor(props: ArrayFieldProps, context: FormUpdaterContextType) {
        super(props, context);
        const initValueInProps = this.props.initValue;
        const { field } = this.props;
        const initValueInForm = context.getValue(field);
        const initValue = initValueInProps || initValueInForm;
        this.state = {
            keys: generateKeys(initValue),
        };
        this.add = this.add.bind(this);
        this.addWithInitValue = this.addWithInitValue.bind(this);
        this.remove = this.remove.bind(this);
        this.cacheFieldValues = initValue;

        // /*
        //     If updateKey exists, it means that the arrayField (usually a nested ArrayField not at the first level) is only re-mounted due to setValues,
        //     and the fields it contains do not need to consume initValue
        // */
        // // whether the fields inside arrayField should use props.initValue in current render process
        // this.shouldUseInitValue = !context.getArrayField(field);

        // Separate the arrays that reset and the usual add and remove modify, otherwise they will affect each other
        const initValueCopyForFormState = cloneDeep(initValue);
        const initValueCopyForReset = cloneDeep(initValue);
        context.registerArrayField(field, { initValue: initValueCopyForReset, forceUpdate: this.forceUpdate });
        context.updateStateValue(field, initValueCopyForFormState, { notNotify: true, notUpdate: true });
    }

    componentDidMount() {
        // const { field } = this.props;
        // const updater = this.context;
    //     updater.updateArrayField(field, { forceUpdate: this.forceUpdate });
    }

    componentWillUnmount() {
        const updater = this.context;
        const { field } = this.props;
        updater.unRegisterArrayField(field);
    }

    // componentDidUpdate() {
    //     const updater = this.context;
    //     // const { field } = this.props;
    //     // const { keys } = this.state;
    //     // const fieldValues = updater.getValue(field);
    //     // const updateKey = getUpdateKey(updater.getArrayField(field));
    //     // // when update form outside, like use formApi.setValue('field', [{newItem1, newItem2}]),  formApi.setValues
    //     // // re generate keys to update arrayField;
    //     // if (updateKey !== this.cacheUpdateKey) {
    //     //     const newKeys = generateKeys(fieldValues, keys);
    //     //     // eslint-disable-next-line
    //     //     this.setState({ keys: newKeys });
    //     //     this.cacheUpdateKey = updateKey;
    //     //     if (this.cacheUpdateKey !== null) {
    //     //         this.shouldUseInitValue = false;
    //     //     }
    //     // } else {
    //     //     console.log('not update');
    //     // }
    // }

    forceUpdate = (value?: any): void => {
        const updater = this.context;
        const { field } = this.props;
        const { keys } = this.state;
        console.log(this.cacheFieldValues);
        const fieldValues = value ? value : updater.getValue(field);
        // TODO fieldValues 如果长度相同，keys目前仍会相同，需要为新的
        const newKeys = generateKeys(fieldValues, keys, this.cacheFieldValues);
        // eslint-disable-next-line
        this.setState({ keys: newKeys });
        this.cacheFieldValues = [...value];
    }

    add() {
        const { keys } = this.state;
        keys.push(getUuidv4());
        // this.shouldUseInitValue = true;
        // TODO allowEmpty 为 false 的情况下
        this.setState({ keys });
    }

    addWithInitValue(lineObject: Record<string, any>) {
        const updater = this.context;
        const { field } = this.props;
        const newArrayFieldVal = updater.getValue(field) ? updater.getValue(field).slice() : [];
        newArrayFieldVal.push(lineObject);
        updater.updateStateValue(field, newArrayFieldVal, {});
        updater.updateArrayField(field, { updateValue: newArrayFieldVal });
    }

    remove(i: number) {
        const updater = this.context;
        const { keys } = this.state;
        const { field } = this.props;
        const newKeys = filterArrayByIndex(keys, i);
        // Make sure that all the keys in the line are removed, because some keys are not taken over by the field, only set in the initValue
        let newArrayFieldError = updater.getError(field);
        const opts = { notNotify: true, notUpdate: true };
        if (Array.isArray(newArrayFieldError)) {
            newArrayFieldError = newArrayFieldError.slice();
            newArrayFieldError.splice(i, 1);
            updater.updateStateError(field, newArrayFieldError, opts);
        }
        // if (Array.isArray(newArrayFieldTouched)) {
        //     newArrayFieldTouched = newArrayFieldTouched.slice();
        //     newArrayFieldTouched.splice(i, 1);
        //     updater.updateStateTouched(field, newArrayFieldTouched, opts);
        // }
        let newArrayFieldValue = updater.getValue(field);
        if (Array.isArray(newArrayFieldValue)) {
            newArrayFieldValue = newArrayFieldValue.slice();
            newArrayFieldValue.splice(i, 1);
            updater.updateStateValue(field, newArrayFieldValue);
        }
        this.setState({ keys: newKeys });
        this.cacheFieldValues = [...newArrayFieldValue];
    }

    render() {
        const { children, field } = this.props;
        const { keys } = this.state;
        const arrayFields = keys.map((key, i) => ({
            key,
            field: `${field}[${i}]`,
            remove: () => this.remove(i),
        }));
        const { add } = this;
        const { addWithInitValue } = this;
        const contextVal = {
            // shouldUseInitValue: this.shouldUseInitValue,
        };
        return (
            <ArrayFieldContext.Provider value={contextVal}>
                {children({ arrayFields, add, addWithInitValue })}
            </ArrayFieldContext.Provider>
        );
    }
}

export default ArrayFieldComponent;
