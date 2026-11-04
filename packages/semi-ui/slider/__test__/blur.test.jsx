import React from 'react';
import { act } from 'react-dom/test-utils';
import Slider from '..';
import { Form } from '../../form';

describe('Slider blur callbacks', () => {
    [false, true].forEach(range => {
        [{}, { tooltipVisible: false }, { tipFormatter: null }].forEach(props => {
            it(`notifies blur when focus leaves the slider, range=${range}, tooltip=${JSON.stringify(props)}`, () => {
                const onBlur = sinon.spy();
                const wrapper = mount(<Slider {...props} range={range} onBlur={onBlur} />);
                const handles = wrapper.find('[role="slider"]').hostNodes();
                handles.forEach(handle => {
                    const event = { target: handle.getDOMNode() };
                    handle.simulate('blur', event);
                    expect(onBlur.lastCall.args[0].target).toBe(event.target);
                });
                expect(onBlur.callCount).toBe(range ? 2 : 1);
                wrapper.unmount();
            });
        });
    });

    it('does not notify blur when focus moves between the range handles', () => {
        const onBlur = sinon.spy();
        const wrapper = mount(<Slider range onBlur={onBlur} />);
        const handles = wrapper.find('[role="slider"]').hostNodes();
        handles.at(0).simulate('blur', { relatedTarget: handles.at(1).getDOMNode() });
        handles.at(1).simulate('blur', { relatedTarget: handles.at(0).getDOMNode() });
        expect(onBlur.callCount).toBe(0);
        handles.at(1).simulate('blur', { relatedTarget: document.body });
        expect(onBlur.callCount).toBe(1);
        wrapper.unmount();
    });

    it('validates Form.Slider once when focus moves between the range handles and leaves', async () => {
        const validate = sinon.spy(() => 'err');
        const wrapper = mount(<Form><Form.Slider field="r" range initValue={[10, 20]} trigger="blur" validate={validate} /></Form>);
        const handles = wrapper.find('[role="slider"]').hostNodes();
        await act(async () => {
            handles.at(0).simulate('blur', { relatedTarget: handles.at(1).getDOMNode() });
            await Promise.resolve();
        });
        expect(validate.callCount).toBe(0);
        await act(async () => {
            handles.at(1).simulate('blur', { relatedTarget: document.body });
            await Promise.resolve();
        });
        expect(validate.callCount).toBe(1);
        wrapper.unmount();
    });

    it('runs Form.Slider validation on blur and keeps the user callback', async () => {
        const validate = sinon.spy(value => value < 50 ? 'At least 50' : '');
        const onBlur = sinon.spy();
        const wrapper = mount(<Form><Form.Slider field="score" initValue={20} trigger="blur" validate={validate} onBlur={onBlur} /></Form>);
        expect(validate.callCount).toBe(0);
        await act(async () => {
            wrapper.find('[role="slider"]').hostNodes().simulate('blur');
            await Promise.resolve();
        });
        wrapper.update();
        expect(validate.callCount).toBe(1);
        expect(validate.firstCall.args[0]).toBe(20);
        expect(onBlur.callCount).toBe(1);
        expect(wrapper.find('.semi-form-field-error-message').text()).toBe('At least 50');
        wrapper.unmount();
    });
});
