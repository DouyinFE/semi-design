import React from 'react';
import { act } from 'react-dom/test-utils';
import { Form, withField } from '../index';

describe.each(['setValue', 'setValues'])('Form validation snapshots after %s', update => {
    const change = api => {
        if (update === 'setValue') {
            api.setValue('name', 'bad');
        } else {
            api.setValues({ name: 'bad' }, { isOverride: true });
        }
    };

    it.each(['submit', 'silent'])('returns the values actually checked by asynchronous %s', async operation => {
        let api, release, completed;
        const gate = new Promise(resolve => { release = resolve; });
        const submitted = new Promise(resolve => { completed = resolve; });
        const checked = [];
        const validator = async values => {
            await gate;
            checked.push(values.name);
            return values.name === 'good' ? undefined : { name: 'invalid name' };
        };
        const wrapper = mount(<Form initValues={{ name: 'good' }} validator={validator}
            getFormApi={value => { api = value; }} onSubmit={completed}>
            <Form.Input field="name" trigger="blur" />
        </Form>);
        try {
            let result;
            await act(async () => {
                const pending = operation === 'submit' ? (api.submitForm(), submitted) : api.validate({ silent: true });
                change(api);
                release();
                result = await pending;
            });
            expect(checked).toEqual(['good']);
            expect(result.name).toBe('good');
            expect(api.getValue('name')).toBe('bad');
        } finally {
            wrapper.unmount();
        }
    });

    it('reports errors together with the snapshot that failed validation', async () => {
        let api, release, completed;
        const gate = new Promise(resolve => { release = resolve; });
        const failed = new Promise(resolve => { completed = resolve; });
        const wrapper = mount(<Form initValues={{ name: 'good' }}
            validator={async values => { await gate; return { name: `rejected ${values.name}` }; }}
            getFormApi={value => { api = value; }}
            onSubmitFail={(errors, values) => completed({ errors, values })}>
            <Form.Input field="name" trigger="blur" />
        </Form>);
        try {
            let result;
            await act(async () => {
                api.submitForm();
                change(api);
                release();
                result = await failed;
            });
            expect(result.errors.name).toBe('rejected good');
            expect(result.values.name).toBe('good');
            expect(api.getValue('name')).toBe('bad');
        } finally {
            wrapper.unmount();
        }
    });
});

it('preserves Error ancestors and previous snapshots when a nested field changes', () => {
    let api;
    const error = Object.assign(new Error('network failed'), { retry: { count: '0' } });
    Object.defineProperty(error, 'cause', { value: 'offline', configurable: true });
    const wrapper = mount(<Form initValues={{ error }} getFormApi={value => { api = value; }}>
        <Form.Input field="error.retry.count" trigger="blur" />
    </Form>);
    try {
        const previous = api.getValue('error');
        expect(previous).toBeInstanceOf(Error);
        expect(previous.message).toBe('network failed');
        expect(previous.stack).toBe(error.stack);
        expect(previous.cause).toBe('offline');
        act(() => { api.setValue('error.retry.count', '1'); });
        const current = api.getValue('error');
        expect(current).toBeInstanceOf(Error);
        expect(current.message).toBe('network failed');
        expect(current.stack).toBe(error.stack);
        expect(current.cause).toBe('offline');
        expect(Object.keys(current)).not.toContain('message');
        expect(current.retry.count).toBe('1');
        expect(previous.retry.count).toBe('0');
    } finally {
        wrapper.unmount();
    }
});

it('preserves array metadata supplied by a custom field when editing a nested value', () => {
    let api, values;
    const rows = Object.assign([{ name: 'old' }], { metadata: { total: 1 } });
    const Rows = withField(({ onChange }) => <button onClick={() => onChange(rows)}>Set rows</button>);
    const wrapper = mount(<Form getFormApi={value => { api = value; }} onValueChange={value => { values = value; }}>
        <Rows field="rows" />
        <Form.Input field="rows[0].name" trigger="blur" />
    </Form>);
    try {
        wrapper.find('button').simulate('click');
        const previous = values.rows;
        expect(previous.metadata).toEqual({ total: 1 });
        act(() => { api.setValue('rows[0].name', 'new'); });
        expect(values.rows.metadata).toEqual({ total: 1 });
        expect(values.rows[0].name).toBe('new');
        expect(previous[0].name).toBe('old');
    } finally {
        wrapper.unmount();
    }
});
