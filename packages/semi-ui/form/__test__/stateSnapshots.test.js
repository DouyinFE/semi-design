import React, { useMemo, useState } from 'react';
import { cloneDeep } from 'lodash';
import FormFoundation from '@douyinfe/semi-foundation/form/foundation';
import { Form, useFormState } from '../index';

function createFoundation(props = {}, adapter = {}) {
    return new FormFoundation({
        getProps: () => ({ initValues: { rows: [{ name: 'first' }], other: { enabled: true } }, ...props }),
        getProp: () => undefined,
        cloneDeep,
        notifyChange: () => {},
        notifyValueChange: () => {},
        notifyErrorChange: () => {},
        forceUpdate: () => {},
        getFormProps: () => ({ autoScrollToError: false }),
        ...adapter,
    });
}

describe('Form state snapshots', () => {
    it('updates memoized callback values and useFormState values', () => {
        function Summary() {
            const { values } = useFormState();
            const text = useMemo(() => values.name || '', [values]);
            return <output className="context-value">{text}</output>;
        }
        function Demo() {
            const [values, setValues] = useState({});
            const text = useMemo(() => values.name || '', [values]);
            return <><Form onValueChange={setValues}><Form.Input field="name" /><Summary /></Form>
                <output className="callback-value">{text}</output></>;
        }
        const wrapper = mount(<Demo />);
        try {
            wrapper.find('input').simulate('change', { target: { value: 'first' } });
            wrapper.find('input').simulate('change', { target: { value: 'second' } });
            expect(wrapper.find('.callback-value').text()).toBe('second');
            expect(wrapper.find('.context-value').text()).toBe('second');
        } finally { wrapper.unmount(); }
    });

    it('keeps earlier nested values and reuses unchanged branches', () => {
        const foundation = createFoundation();
        const previous = foundation.data;
        foundation.updateStateValue('rows[0].name', 'second', {});
        expect(previous.values.rows[0].name).toBe('first');
        expect(foundation.data.values.rows[0].name).toBe('second');
        expect(foundation.data.values.other).toBe(previous.values.other);
        expect(foundation.data.errors).toBe(previous.errors);
        expect(foundation.data.touched).toBe(previous.touched);
    });

    it('keeps earlier errors and touched state', () => {
        const foundation = createFoundation();
        foundation.updateStateError('rows[0].name', 'first error', {});
        foundation.updateStateTouched('rows[0].name', false);
        const previous = foundation.data;
        foundation.updateStateError('rows[0].name', 'second error', {});
        foundation.updateStateTouched('rows[0].name', true);
        expect(previous.errors.rows[0].name).toBe('first error');
        expect(previous.touched.rows[0].name).toBe(false);
        expect(foundation.data.errors.rows[0].name).toBe('second error');
        expect(foundation.data.touched.rows[0].name).toBe(true);
    });

    it('removes nested fields without changing earlier snapshots', () => {
        const foundation = createFoundation();
        foundation.fields.set('rows[0].name', { keepState: false });
        const previous = foundation.data;
        foundation.unRegister('rows[0].name');
        expect(previous.values.rows[0].name).toBe('first');
        expect(foundation.data.values.rows).toBeUndefined();
        expect(foundation.data.values.other).toBe(previous.values.other);
    });

    it('preserves previous form state when overriding all values', () => {
        const foundation = createFoundation();
        const previous = foundation.data;
        foundation.setValues({ name: 'replacement' }, { isOverride: true });
        expect(previous.values.rows[0].name).toBe('first');
        expect(foundation.data.values).toEqual({ name: 'replacement' });
    });

    it.each(['form', 'field'])('returns current values after asynchronous %s validation', async level => {
        let finish;
        const pending = new Promise(resolve => { finish = resolve; });
        const foundation = createFoundation(level === 'form' ? { validator: () => pending } : {});
        if (level === 'field') {
            foundation.fields.set('rows[0].name', { fieldApi: { validate: () => pending } });
        }
        const validation = foundation.validate({ silent: true });
        foundation.updateStateValue('rows[0].name', 'second', {});
        finish();
        const values = await validation;
        expect(values.rows[0].name).toBe('second');
    });

    it('reports current values after asynchronous submission failure', async () => {
        let finish;
        const validation = new Promise(resolve => { finish = resolve; });
        let notifyFailure;
        const failed = new Promise(resolve => { notifyFailure = resolve; });
        const foundation = createFoundation({ validator: () => validation }, {
            notifySubmitFail: (errors, values) => notifyFailure(values),
        });
        foundation.submit();
        foundation.updateStateValue('rows[0].name', 'second', {});
        finish({ rows: [{ name: 'invalid' }] });
        const values = await failed;
        expect(values.rows[0].name).toBe('second');
    });

    it('preserves sparse array holes and removes empty paths without changing old values', () => {
        const foundation = createFoundation();
        foundation.updateStateValue('rows[3].name', 'fourth', {});
        const previous = foundation.data;
        foundation.updateStateValue('rows[3].name', undefined, {});
        expect(previous.values.rows[3].name).toBe('fourth');
        expect(1 in foundation.data.values.rows).toBe(false);
        expect(2 in foundation.data.values.rows).toBe(false);
        expect(foundation.data.values.rows[3]).toBeUndefined();
        expect(foundation.data.values.rows[0]).toBe(previous.values.rows[0]);
    });
});
