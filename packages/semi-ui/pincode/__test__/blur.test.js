import React from 'react';
import { act } from 'react-dom/test-utils';
import PinCode from '../index';
import { Form } from '../../form';

describe('PinCode blur', () => {
    it('only notifies when focus leaves the whole component', () => {
        const onBlur = sinon.spy();
        const wrapper = mount(<div><PinCode autoFocus={false} onBlur={onBlur} /><button>Outside</button></div>);
        try {
            const inputs = wrapper.find('input');
            inputs.at(0).simulate('blur', { relatedTarget: inputs.at(1).getDOMNode() });
            expect(onBlur.callCount).toBe(0);
            inputs.at(1).simulate('blur', { relatedTarget: wrapper.find('button').getDOMNode() });
            expect(onBlur.callCount).toBe(1);
            expect(onBlur.firstCall.args[0].target).toBe(inputs.at(1).getDOMNode());
            inputs.at(0).simulate('blur', { relatedTarget: null });
            expect(onBlur.callCount).toBe(2);
        } finally { wrapper.unmount(); }
    });

    it('runs Form blur validation after leaving the component', async () => {
        const validator = sinon.spy(() => 'Please enter the code');
        let api;
        const wrapper = mount(<Form trigger="blur" getFormApi={value => { api = value; }}>
            <Form.PinCode field="code" autoFocus={false} validator={validator} />
        </Form>);
        try {
            const inputs = wrapper.find('input');
            await act(async () => { inputs.at(0).simulate('blur', { relatedTarget: inputs.at(1).getDOMNode() }); });
            expect(validator.callCount).toBe(0);
            await act(async () => { inputs.at(1).simulate('blur', { relatedTarget: null }); });
            wrapper.update();
            expect(validator.callCount).toBe(1);
            expect(wrapper.text()).toContain('Please enter the code');
            expect(api.getTouched('code')).toBe(true);
        } finally { wrapper.unmount(); }
    });
});
