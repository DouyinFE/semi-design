import React from 'react';
import { mount } from 'enzyme';
import TextArea from '../textarea';
import ResizeObserver from '../../resizeObserver';

describe('TextArea autosize after clear', () => {
    const initialValue = 'one\ntwo\nthree\nfour\nfive\nsix';
    const textareaStyle = {
        boxSizing: 'content-box', lineHeight: '20px',
        paddingTop: 0, paddingBottom: 0, borderTopWidth: 0, borderBottomWidth: 0,
    };
    let wrapper;
    let scrollHeight;

    beforeEach(() => {
        scrollHeight = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'scrollHeight');
        Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
            configurable: true,
            get() { return Math.max(1, this.value.split('\n').length) * 20; },
        });
    });

    afterEach(() => {
        wrapper.unmount();
        if (scrollHeight) Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', scrollHeight);
        else delete HTMLTextAreaElement.prototype.scrollHeight;
    });

    const height = () => wrapper.find('textarea').getDOMNode().style.height;
    const measureInitialHeight = () => {
        wrapper.find(ResizeObserver).prop('onResize')([]);
        wrapper.update();
    };
    const clear = () => {
        wrapper.find('textarea').simulate('focus');
        wrapper.find('.semi-input-clearbtn').simulate('click');
    };

    it.each([true, { minRows: 2, maxRows: 8 }])('shrinks an uncontrolled textarea with autosize %s', autosize => {
        const onChange = sinon.spy();
        const onClear = sinon.spy();
        const onBlur = sinon.spy();
        const onResize = sinon.spy();
        wrapper = mount(<TextArea rows={2} autosize={autosize} showClear defaultValue={initialValue}
            textareaStyle={textareaStyle} onChange={onChange} onClear={onClear} onBlur={onBlur} onResize={onResize} />);
        measureInitialHeight();
        expect(height()).toBe('120px');
        clear();
        expect(wrapper.find('textarea').getDOMNode().value).toBe('');
        expect(height()).toBe('40px');
        expect(onChange.calledOnce).toBe(true);
        expect(onChange.firstCall.args[0]).toBe('');
        expect(onClear.calledOnce).toBe(true);
        expect(onBlur.calledOnce).toBe(true);
        expect(onResize.lastCall.args[0]).toEqual({ height: 40 });
    });

    it('measures the placeholder after clearing the value', () => {
        wrapper = mount(<TextArea autosize={{ minRows: 2 }} showClear defaultValue={initialValue}
            placeholder={'First\nSecond\nThird'} textareaStyle={textareaStyle} />);
        measureInitialHeight();
        clear();
        expect(height()).toBe('60px');
    });

    it('continues resizing when typing after clearing', () => {
        wrapper = mount(<TextArea rows={2} autosize showClear defaultValue={initialValue} textareaStyle={textareaStyle} />);
        measureInitialHeight();
        clear();
        expect(height()).toBe('40px');
        wrapper.find('textarea').simulate('change', { target: { value: 'a\nb\nc' } });
        expect(height()).toBe('60px');
    });

    it('resizes a controlled textarea when the parent accepts the clear', () => {
        const onChange = value => wrapper.setProps({ value });
        wrapper = mount(<TextArea rows={2} autosize showClear value={initialValue}
            onChange={onChange} textareaStyle={textareaStyle} />);
        measureInitialHeight();
        clear();
        expect(wrapper.find('textarea').getDOMNode().value).toBe('');
        expect(height()).toBe('40px');
    });

    it('keeps the controlled value and height when the parent does not clear', () => {
        const onChange = sinon.spy();
        wrapper = mount(<TextArea rows={2} autosize showClear value={initialValue}
            onChange={onChange} textareaStyle={textareaStyle} />);
        measureInitialHeight();
        clear();
        expect(wrapper.find('textarea').getDOMNode().value).toBe(initialValue);
        expect(height()).toBe('120px');
        expect(onChange.firstCall.args[0]).toBe('');
    });
});
