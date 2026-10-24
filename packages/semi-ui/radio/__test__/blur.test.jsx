import React from 'react';
import { act } from 'react-dom/test-utils';
import Radio from '../index';
import { Form } from '../../form';

describe('RadioGroup blur', () => {
    it.each(['options', 'children'])('only notifies when focus leaves the group (%s)', mode => {
        const onBlur = sinon.spy();
        const content = mode === 'options' ? <Radio.Group options={['A', 'B']} onBlur={onBlur} />
            : <Radio.Group onBlur={onBlur}><Radio value="A">A</Radio><Radio value="B">B</Radio></Radio.Group>;
        const wrapper = mount(<div>{content}<button>Outside</button></div>);
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

    it('runs Form blur validation after leaving the group', async () => {
        const validator = sinon.spy(() => 'Please select an option');
        let api;
        const wrapper = mount(<Form trigger="blur" getFormApi={value => { api = value; }}>
            <Form.RadioGroup field="choice" options={['A', 'B']} validator={validator} />
        </Form>);
        try {
            const inputs = wrapper.find('input');
            await act(async () => { inputs.at(0).simulate('blur', { relatedTarget: inputs.at(1).getDOMNode() }); });
            expect(validator.callCount).toBe(0);
            await act(async () => { inputs.at(1).simulate('blur', { relatedTarget: null }); });
            wrapper.update();
            expect(validator.callCount).toBe(1);
            expect(wrapper.text()).toContain('Please select an option');
            expect(api.getTouched('choice')).toBe(true);
        } finally { wrapper.unmount(); }
    });
});
