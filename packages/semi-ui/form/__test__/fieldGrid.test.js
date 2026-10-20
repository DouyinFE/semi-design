import React from 'react';
import { Form } from '../index';
import { Row } from '../../grid';

describe('Form field grid layout', () => {
    it.each(['left', 'top'])('supports field-level columns with labels on the %s', labelPosition => {
        const wrapper = mount(<Form labelPosition={labelPosition}>
            <Form.Input field="name" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} />
        </Form>);
        try {
            expect(wrapper.find('.semi-col-6').exists()).toBe(true);
            expect(wrapper.find('.semi-col-18').exists()).toBe(true);
            wrapper.find('input').simulate('change', { target: { value: 'hello' } });
            expect(wrapper.instance().formApi.getValue('name')).toBe('hello');
        } finally { wrapper.unmount(); }
    });

    it('supports columns split between the form and the field', () => {
        const wrapper = mount(<Form labelCol={{ span: 6 }}>
            <Form.Input field="name" wrapperCol={{ span: 18 }} />
        </Form>);
        try { expect(wrapper.find('.semi-col-18').exists()).toBe(true); }
        finally { wrapper.unmount(); }
    });

    it('preserves an existing row and its gutter', () => {
        const wrapper = mount(<Row gutter={24}><Form>
            <Form.Input field="name" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} />
        </Form></Row>);
        try {
            expect(wrapper.find('.semi-row')).toHaveLength(1);
            expect(wrapper.find('.semi-col-6').prop('style').paddingLeft).toBe(12);
            expect(wrapper.find('.semi-col-18').prop('style').paddingRight).toBe(12);
        } finally { wrapper.unmount(); }
    });
});
