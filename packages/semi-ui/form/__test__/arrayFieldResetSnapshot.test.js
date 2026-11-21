import React from 'react';
import { act } from 'react-dom/test-utils';
import { Form, ArrayField } from '../../index';

describe('ArrayField reset snapshot', () => {
    it.each([false, true])('keeps the initial nested values after edit, remove and reset, nested=%s', nested => {
        let formApi;
        const field = nested ? 'group.items' : 'items';
        const rows = [{ name: 'Alice' }, { name: 'Bob' }];
        const initValues = nested ? { group: { items: rows } } : { items: rows };
        const wrapper = mount(<Form initValues={initValues} getFormApi={api => { formApi = api; }}>
            <ArrayField field={field}>
                {({ arrayFields }) => arrayFields.map(({ field: rowField, key, remove }) => <div key={key}>
                    <Form.Input field={rowField + '.name'} />
                    <button type="button" onClick={remove}>Remove</button>
                </div>)}
            </ArrayField>
        </Form>);
        act(() => formApi.reset());
        wrapper.update();
        wrapper.find('input').at(1).simulate('change', { target: { value: 'Changed' } });
        wrapper.find('button').at(1).simulate('click');
        act(() => formApi.reset());
        wrapper.update();
        expect(formApi.getValue(field)).toEqual(rows);
        expect(wrapper.find('input').map(input => input.prop('value'))).toEqual(['Alice', 'Bob']);
        act(() => formApi.reset());
        expect(formApi.getValue(field)).toEqual(rows);
        wrapper.unmount();
    });
});

