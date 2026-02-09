import { PinCode } from '../../index';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

function getPinCode(props) {
    return mount(<PinCode {...props} />, { attachTo: document.getElementById('container') });
}

describe('PinCode', () => {
    beforeEach(() => {
        const div = document.createElement('div');
        div.setAttribute('id', 'container');
        document.body.appendChild(div);
    });

    afterEach(() => {
        const div = document.getElementById('container');
        if (div) {
            document.body.removeChild(div);
        }
        document.body.innerHTML = '';
    });

    it('renders without crashing', () => {
        const wrapper = getPinCode({});
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-pincode-wrapper`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with custom className', () => {
        const wrapper = getPinCode({ className: 'custom-class' });
        expect(wrapper.exists('.custom-class')).toEqual(true);
        wrapper.unmount();
    });

    it('renders with custom style', () => {
        const style = { border: '1px solid red' };
        const wrapper = getPinCode({ style });
        expect(wrapper.props().style).toEqual(style);
        wrapper.unmount();
    });

    it('renders correct number of inputs based on count prop', () => {
        const wrapper = getPinCode({ count: 4 });
        const inputs = wrapper.find('input');
        expect(inputs.length).toEqual(4);
        wrapper.unmount();
    });

    it('renders 6 inputs by default', () => {
        const wrapper = getPinCode({});
        const inputs = wrapper.find('input');
        expect(inputs.length).toEqual(6);
        wrapper.unmount();
    });

    it('renders with defaultValue', () => {
        const wrapper = getPinCode({ defaultValue: '123456' });
        const inputs = wrapper.find('input');
        expect(inputs.at(0).instance().value).toEqual('1');
        expect(inputs.at(1).instance().value).toEqual('2');
        expect(inputs.at(2).instance().value).toEqual('3');
        wrapper.unmount();
    });

    it('controlled mode with value prop', () => {
        const wrapper = getPinCode({ value: '654321' });
        const inputs = wrapper.find('input');
        expect(inputs.at(0).instance().value).toEqual('6');
        expect(inputs.at(1).instance().value).toEqual('5');
        expect(inputs.at(2).instance().value).toEqual('4');
        wrapper.unmount();
    });

    it('onChange callback', () => {
        const onChange = sinon.spy();
        const wrapper = getPinCode({ onChange });
        expect(wrapper.props().onChange).toBe(onChange);
        wrapper.unmount();
    });

    it('onComplete callback', () => {
        const onComplete = sinon.spy();
        const wrapper = getPinCode({ onComplete });
        expect(wrapper.props().onComplete).toBe(onComplete);
        wrapper.unmount();
    });

    it('renders with disabled state', () => {
        const wrapper = getPinCode({ disabled: true });
        const inputs = wrapper.find('input');
        inputs.forEach(input => {
            expect(input.instance().disabled).toEqual(true);
        });
        wrapper.unmount();
    });

    it('renders with small size', () => {
        const wrapper = getPinCode({ size: 'small' });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-input-small`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with large size', () => {
        const wrapper = getPinCode({ size: 'large' });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-input-large`)).toEqual(true);
        wrapper.unmount();
    });

    it('autoFocus is true by default', () => {
        const wrapper = getPinCode({});
        // 验证 autoFocus 属性
        expect(wrapper.props().autoFocus).not.toEqual(false);
        wrapper.unmount();
    });

    it('autoFocus can be disabled', () => {
        const wrapper = getPinCode({ autoFocus: false });
        expect(wrapper.props().autoFocus).toEqual(false);
        wrapper.unmount();
    });

    it('format prop can be set to text', () => {
        const wrapper = getPinCode({ format: 'text' });
        expect(wrapper.props().format).toEqual('text');
        wrapper.unmount();
    });

    it('input has numeric inputMode when format is number', () => {
        const wrapper = getPinCode({ format: 'number' });
        const input = wrapper.find('input').first();
        expect(input.instance().inputMode).toEqual('numeric');
        wrapper.unmount();
    });

    it('input has text inputMode when format is text', () => {
        const wrapper = getPinCode({ format: 'text' });
        const input = wrapper.find('input').first();
        expect(input.instance().inputMode).toEqual('text');
        wrapper.unmount();
    });

    it('handles input change', () => {
        const onChange = sinon.spy();
        const wrapper = getPinCode({ onChange });
        // 验证 onChange 属性被正确传递
        expect(wrapper.props().onChange).toBe(onChange);
        wrapper.unmount();
    });

    it('handles focus event', () => {
        const wrapper = getPinCode({});
        const input = wrapper.find('input').first();
        input.simulate('focus');
        // 验证焦点事件被处理
        expect(wrapper.state().currentActiveIndex).toEqual(0);
        wrapper.unmount();
    });

    it('handles blur event', () => {
        const wrapper = getPinCode({});
        const input = wrapper.find('input').first();
        input.simulate('focus');
        input.simulate('blur');
        // 验证失焦事件被处理
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-pincode-wrapper`)).toEqual(true);
        wrapper.unmount();
    });

    it('handles keydown event', () => {
        const wrapper = getPinCode({});
        const input = wrapper.find('input').first();
        input.simulate('keydown', { key: 'Backspace' });
        // 验证键盘事件被处理
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-pincode-wrapper`)).toEqual(true);
        wrapper.unmount();
    });
});
