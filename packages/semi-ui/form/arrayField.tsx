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
 * 
 * 2 -> 3，理想情况，看加的哪个，复用2个
 * 3 -> 2, 理想情况，看删的哪个，减少，
 * 2 -> 2, 看值变不变
 *   嵌套场景，外部变不变无所谓，里面尽量不变，否则会走卸载。除非判断出嵌套时候
 *   外部 setValue、setValues 变更，不易判断改的是哪行
 *    如果只有自己一层，那都变问题也不大。如果有两层以上，变就会导致里面一层卸载再挂载。
 */

const generateKeys = (value: any[] = [], oldKeys?: string[], cacheValues: any[] = []) => {
    const val = initValueAdapter(value);
    const newKeys = getUuidByArray(val);
    // const keys = newKeys.map((key, i) => (oldKeys && oldKeys[i] ? oldKeys[i] : key));

    const keys = [];

    // Keys 的复用机制需要
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

    hasMounted: boolean;
    context: FormUpdaterContextType;

    constructor(props: ArrayFieldProps, context: FormUpdaterContextType) {
        super(props, context);
        const initValueInProps = this.props.initValue;
        const { field } = this.props;
        const initValueInForm = context.getValue(field);
        const initValue = initValueInProps || initValueInForm;

        this.hasMounted = Boolean(context.getArrayField(field));

        this.state = {
            keys: generateKeys(initValue),
        };
        this.add = this.add.bind(this);
        this.addWithInitValue = this.addWithInitValue.bind(this);
        this.remove = this.remove.bind(this);
        // /*
        //     If updateKey exists, it means that the arrayField (usually a nested ArrayField not at the first level) is only re-mounted due to setValues,
        //     and the fields it contains do not need to consume initValue
        // */
        // // whether the fields inside arrayField should use props.initValue in current render process

        // Separate the arrays that reset and the usual add and remove modify, otherwise they will affect each other
        const initValueCopyForFormState = cloneDeep(initValue);
        const initValueCopyForReset = cloneDeep(initValue);
        context.registerArrayField(field, { initValue: initValueCopyForReset, forceUpdate: this.forceUpdate });
        context.updateStateValue(field, initValueCopyForFormState, { notNotify: true, notUpdate: true });
    }

    componentDidMount() {
        const { field } = this.props;
        const initValueInArrayFieldProps = this.props.initValue;
        const updater = this.context;

        const formProps = updater.getFormProps(['initValues']);
        const initValueInFormProps = get(formProps, field);

        const initValueInFormState = updater.getValue(field);
        
        const initValue = initValueInArrayFieldProps || initValueInFormProps || initValueInFormState;

        const initValueCopyForFormState = cloneDeep(initValue);
        const initValueCopyForReset = cloneDeep(initValue);

        // 如果首次挂载，应该使用初始值，如果不是首次挂载，例如嵌套场景下，level 1 keys变更导致的 level 2子级重新挂载，那应该直接使用formState 中的值 , 且无需注册 initValue（否则会影响保存的 initValue）
        if (!this.hasMounted) {
            updater.registerArrayField(field, { initValue: initValueCopyForReset, forceUpdate: this.forceKeysUpdate });
            updater.updateStateValue(field, initValueCopyForFormState, { notNotify: true, notUpdate: true });
        } else {
            if (field === 'data[0].rules') {
                const a = updater.getArrayField();
                console.log('data[0].rules didmount');
            }
            updater.registerArrayField(field, { forceUpdate: this.forceKeysUpdate });
        }
        console.log('didMount', this.props.field);
    }

    componentWillUnmount() {
        const updater = this.context;
        const { field } = this.props;
        // 卸载时，不卸载 initValue？
        // 嵌套的不做卸载？
        updater.unRegisterArrayField(field);
        console.log('unmount', this.props.field);
    }

    forceKeysUpdate = ({ newValue, oldValue }): void => {
        const updater = this.context;
        const { field } = this.props;
        const { keys } = this.state;

        const fieldValues = newValue ? newValue : updater.getValue(field);
        const newKeys = generateKeys(fieldValues, keys, oldValue);
        // const newKeys = generateKeys(fieldValues, keys, this.cacheFieldValues);

        // eslint-disable-next-line
        this.setState({ keys: newKeys });
        // A: A1、A2   ->  A: A1-new  -> A: A1、A2
        // 如果 forecUpdate child，改变了 child 的length，但是这个无法更新父级的 cacheFieldValue。会有问题, cache不是一个好的设计，要做完善还得在 setValue时检测潜在的对父子 cacheValue的影响
        // this.cacheFieldValues = cloneDeep(value);
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
        // this.cacheFieldValues = cloneDeep(newArrayFieldValue);
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
            isInArrayField: true,
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
