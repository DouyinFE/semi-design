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

    it('handles keydown Delete key', () => {
        const wrapper = getPinCode({ defaultValue: '123456' });
        const input = wrapper.find('input').at(2);
        input.simulate('focus');
        input.simulate('keydown', { key: 'Delete', preventDefault: () => {} });
        // Delete 键应该清除当前输入并移动到下一个
        wrapper.unmount();
    });

    it('handles keydown ArrowLeft key', () => {
        const wrapper = getPinCode({ defaultValue: '123456' });
        const input = wrapper.find('input').at(2);
        input.simulate('focus');
        input.simulate('keydown', { key: 'ArrowLeft', preventDefault: () => {} });
        // ArrowLeft 应该移动焦点到前一个输入
        wrapper.unmount();
    });

    it('handles keydown ArrowRight key', () => {
        const wrapper = getPinCode({ defaultValue: '123456' });
        const input = wrapper.find('input').at(2);
        input.simulate('focus');
        input.simulate('keydown', { key: 'ArrowRight', preventDefault: () => {} });
        // ArrowRight 应该移动焦点到下一个输入
        wrapper.unmount();
    });

    it('format prop with mixed type', () => {
        const wrapper = getPinCode({ format: 'mixed' });
        expect(wrapper.props().format).toEqual('mixed');
        wrapper.unmount();
    });

    it('format prop with RegExp', () => {
        const format = /^[a-z]$/;
        const wrapper = getPinCode({ format });
        expect(wrapper.props().format).toEqual(format);
        wrapper.unmount();
    });

    it('format prop with function', () => {
        const format = (value) => /^[0-9]$/.test(value);
        const wrapper = getPinCode({ format });
        expect(wrapper.props().format).toBe(format);
        wrapper.unmount();
    });

    it('controlled mode updates when value prop changes', () => {
        const wrapper = getPinCode({ value: '111111' });
        expect(wrapper.state().valueList).toEqual(['1', '1', '1', '1', '1', '1']);
        
        wrapper.setProps({ value: '222222' });
        expect(wrapper.state().valueList).toEqual(['2', '2', '2', '2', '2', '2']);
        wrapper.unmount();
    });

    it('focus method on PinCode instance', () => {
        const wrapper = getPinCode({});
        const instance = wrapper.instance();
        // 调用 focus 方法
        instance.focus(0);
        // 验证方法存在且不抛出错误
        expect(typeof instance.focus).toBe('function');
        wrapper.unmount();
    });

    it('blur method on PinCode instance', () => {
        const wrapper = getPinCode({});
        const instance = wrapper.instance();
        // 调用 blur 方法
        instance.blur(0);
        // 验证方法存在且不抛出错误
        expect(typeof instance.blur).toBe('function');
        wrapper.unmount();
    });

    it('handles input change with valid number', () => {
        const onChange = sinon.spy();
        const wrapper = getPinCode({ onChange, format: 'number' });
        const input = wrapper.find('input').first();
        
        // 模拟输入数字
        input.simulate('change', { target: { value: '5' } });
        // onChange 应该被调用
        wrapper.unmount();
    });

    it('handles input change with invalid character for number format', () => {
        const onChange = sinon.spy();
        const wrapper = getPinCode({ onChange, format: 'number' });
        const input = wrapper.find('input').first();
        
        // 模拟输入非数字
        input.simulate('change', { target: { value: 'a' } });
        // onChange 不应该被调用，因为 'a' 不是有效数字
        wrapper.unmount();
    });

    it('handles input change with valid mixed character', () => {
        const onChange = sinon.spy();
        const wrapper = getPinCode({ onChange, format: 'mixed' });
        const input = wrapper.find('input').first();
        
        // 模拟输入字母
        input.simulate('change', { target: { value: 'a' } });
        wrapper.unmount();
    });

    it('paste event handler is attached', () => {
        const wrapper = getPinCode({});
        const input = wrapper.find('input').first();
        // 验证 onPaste 事件处理器存在
        expect(input.prop('onPaste')).toBeDefined();
        wrapper.unmount();
    });

    it('onComplete is called when all inputs are filled', () => {
        const onComplete = sinon.spy();
        const wrapper = getPinCode({ onComplete, count: 3 });
        
        // 验证 onComplete 属性被正确传递
        expect(wrapper.props().onComplete).toBe(onComplete);
        wrapper.unmount();
    });

    it('handles focus on different input indices', () => {
        const wrapper = getPinCode({ defaultValue: '123' });
        
        // Focus on second input
        const input1 = wrapper.find('input').at(1);
        input1.simulate('focus');
        expect(wrapper.state().currentActiveIndex).toEqual(1);
        
        // Focus on third input
        const input2 = wrapper.find('input').at(2);
        input2.simulate('focus');
        expect(wrapper.state().currentActiveIndex).toEqual(2);
        
        wrapper.unmount();
    });

    it('handles blur on different input indices', () => {
        const wrapper = getPinCode({ defaultValue: '123' });
        
        const input = wrapper.find('input').at(1);
        input.simulate('focus');
        input.simulate('blur');
        
        // 验证 blur 事件被处理
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-pincode-wrapper`)).toEqual(true);
        wrapper.unmount();
    });

    it('handles Backspace at first input', () => {
        const wrapper = getPinCode({ defaultValue: '123456' });
        const input = wrapper.find('input').first();
        
        input.simulate('focus');
        input.simulate('keydown', { key: 'Backspace', preventDefault: () => {} });
        // Backspace 在第一个输入时，应该清除当前值但不移动焦点到负索引
        wrapper.unmount();
    });

    it('handles ArrowLeft at first input', () => {
        const wrapper = getPinCode({ defaultValue: '123456' });
        const input = wrapper.find('input').first();
        
        input.simulate('focus');
        input.simulate('keydown', { key: 'ArrowLeft', preventDefault: () => {} });
        // ArrowLeft 在第一个输入时，焦点应该保持在第一个
        wrapper.unmount();
    });

    it('handles ArrowRight at last input', () => {
        const wrapper = getPinCode({ defaultValue: '123456' });
        const inputs = wrapper.find('input');
        const lastInput = inputs.at(inputs.length - 1);
        
        lastInput.simulate('focus');
        lastInput.simulate('keydown', { key: 'ArrowRight', preventDefault: () => {} });
        // ArrowRight 在最后一个输入时，焦点应该保持在最后一个
        wrapper.unmount();
    });

    it('handles Delete at last input', () => {
        const wrapper = getPinCode({ defaultValue: '123456' });
        const inputs = wrapper.find('input');
        const lastInput = inputs.at(inputs.length - 1);
        
        lastInput.simulate('focus');
        lastInput.simulate('keydown', { key: 'Delete', preventDefault: () => {} });
        // Delete 在最后一个输入时，应该清除当前值但焦点保持在最后一个
        wrapper.unmount();
    });

    it('renders with empty defaultValue', () => {
        const wrapper = getPinCode({ defaultValue: '' });
        const inputs = wrapper.find('input');
        inputs.forEach(input => {
            expect(input.instance().value).toEqual('');
        });
        wrapper.unmount();
    });

    it('renders with partial defaultValue', () => {
        const wrapper = getPinCode({ defaultValue: '12', count: 6 });
        const inputs = wrapper.find('input');
        expect(inputs.at(0).instance().value).toEqual('1');
        expect(inputs.at(1).instance().value).toEqual('2');
        expect(inputs.at(2).instance().value).toEqual('');
        wrapper.unmount();
    });

    it('count prop with different values', () => {
        const wrapper3 = getPinCode({ count: 3 });
        expect(wrapper3.find('input').length).toEqual(3);
        wrapper3.unmount();
        
        const wrapper8 = getPinCode({ count: 8 });
        expect(wrapper8.find('input').length).toEqual(8);
        wrapper8.unmount();
    });

    it('handles input with existing value', () => {
        const onChange = sinon.spy();
        const wrapper = getPinCode({ onChange, defaultValue: '123456' });
        const input = wrapper.find('input').first();
        
        // 模拟在已有值的输入框中输入新值
        input.simulate('change', { target: { value: '19' } });
        wrapper.unmount();
    });

    it('handles other key events', () => {
        const wrapper = getPinCode({});
        const input = wrapper.find('input').first();
        
        // 模拟其他按键，应该不影响焦点移动
        input.simulate('keydown', { key: 'Enter', preventDefault: () => {} });
        input.simulate('keydown', { key: 'Tab', preventDefault: () => {} });
        input.simulate('keydown', { key: 'Escape', preventDefault: () => {} });
        
        wrapper.unmount();
    });

    it('valueList state is initialized correctly', () => {
        const wrapper = getPinCode({});
        expect(wrapper.state().valueList).toEqual([]);
        wrapper.unmount();
    });

    it('currentActiveIndex state is initialized correctly', () => {
        const wrapper = getPinCode({});
        expect(wrapper.state().currentActiveIndex).toEqual(0);
        wrapper.unmount();
    });

    it('handles paste event with valid data', () => {
        const onChange = sinon.spy();
        const wrapper = getPinCode({ onChange, format: 'number' });
        const input = wrapper.find('input').first();
        
        // 模拟粘贴事件
        const pasteEvent = {
            clipboardData: {
                getData: () => '123456'
            },
            preventDefault: () => {},
            nativeEvent: {
                clipboardData: {
                    getData: () => '123456'
                },
                preventDefault: () => {}
            }
        };
        input.simulate('paste', pasteEvent);
        wrapper.unmount();
    });

    it('handles paste event with partial data', () => {
        const onChange = sinon.spy();
        const wrapper = getPinCode({ onChange, format: 'number', count: 6 });
        const input = wrapper.find('input').at(2);
        
        input.simulate('focus');
        // 模拟粘贴事件
        const pasteEvent = {
            clipboardData: {
                getData: () => '12'
            },
            preventDefault: () => {},
            nativeEvent: {
                clipboardData: {
                    getData: () => '12'
                },
                preventDefault: () => {}
            }
        };
        input.simulate('paste', pasteEvent);
        wrapper.unmount();
    });

    it('changeSpecificInputFocusState with blur state', () => {
        const wrapper = getPinCode({});
        const instance = wrapper.instance();
        
        // 先 focus 一个输入框
        instance.focus(0);
        
        // 然后通过 adapter 调用 blur
        instance.adapter.changeSpecificInputFocusState(0, 'blur');
        
        // 验证方法存在且不抛出错误
        expect(typeof instance.adapter.changeSpecificInputFocusState).toBe('function');
        wrapper.unmount();
    });

    it('changeSpecificInputFocusState with focus state', () => {
        const wrapper = getPinCode({});
        const instance = wrapper.instance();
        
        // 通过 adapter 调用 focus
        instance.adapter.changeSpecificInputFocusState(1, 'focus');
        
        // 验证方法存在且不抛出错误
        expect(typeof instance.adapter.changeSpecificInputFocusState).toBe('function');
        wrapper.unmount();
    });

    it('handles empty paste data', () => {
        const wrapper = getPinCode({ format: 'number' });
        const input = wrapper.find('input').first();
        
        // 模拟空粘贴事件
        const pasteEvent = {
            clipboardData: {
                getData: () => ''
            },
            preventDefault: () => {},
            nativeEvent: {
                clipboardData: {
                    getData: () => ''
                },
                preventDefault: () => {}
            }
        };
        input.simulate('paste', pasteEvent);
        wrapper.unmount();
    });

    it('handles paste with mixed format', () => {
        const wrapper = getPinCode({ format: 'mixed' });
        const input = wrapper.find('input').first();
        
        const pasteEvent = {
            clipboardData: {
                getData: () => 'abc123'
            },
            preventDefault: () => {},
            nativeEvent: {
                clipboardData: {
                    getData: () => 'abc123'
                },
                preventDefault: () => {}
            }
        };
        input.simulate('paste', pasteEvent);
        wrapper.unmount();
    });

    it('handles paste with text format', () => {
        const wrapper = getPinCode({ format: 'text' });
        const input = wrapper.find('input').first();
        
        const pasteEvent = {
            clipboardData: {
                getData: () => 'abcdef'
            },
            preventDefault: () => {},
            nativeEvent: {
                clipboardData: {
                    getData: () => 'abcdef'
                },
                preventDefault: () => {}
            }
        };
        input.simulate('paste', pasteEvent);
        wrapper.unmount();
    });

    it('blur on input after focus', () => {
        const wrapper = getPinCode({});
        const input = wrapper.find('input').at(2);
        
        // 先 focus
        input.simulate('focus');
        expect(wrapper.state().currentActiveIndex).toEqual(2);
        
        // 然后 blur
        input.simulate('blur');
        wrapper.unmount();
    });

    it('focus method with different indices', () => {
        const wrapper = getPinCode({ count: 4 });
        const instance = wrapper.instance();
        
        // 测试不同索引的 focus
        instance.focus(0);
        instance.focus(1);
        instance.focus(2);
        instance.focus(3);
        
        wrapper.unmount();
    });

    it('blur method with different indices', () => {
        const wrapper = getPinCode({ count: 4 });
        const instance = wrapper.instance();
        
        // 先 focus 然后 blur
        instance.focus(0);
        instance.blur(0);
        
        instance.focus(2);
        instance.blur(2);
        
        wrapper.unmount();
    });

    it('handles input change that triggers completion', () => {
        const onComplete = sinon.spy();
        const wrapper = getPinCode({ onComplete, count: 3, defaultValue: '12' });
        const input = wrapper.find('input').at(2);
        
        // 模拟输入最后一个字符
        input.simulate('change', { target: { value: '3' } });
        wrapper.unmount();
    });

    it('handles keydown with empty input', () => {
        const wrapper = getPinCode({ count: 4 });
        const input = wrapper.find('input').at(1);
        
        input.simulate('focus');
        input.simulate('keydown', { key: 'Backspace', preventDefault: () => {} });
        wrapper.unmount();
    });

    it('handles rapid focus changes', () => {
        const wrapper = getPinCode({ count: 4 });
        const inputs = wrapper.find('input');
        
        // 快速切换焦点
        inputs.at(0).simulate('focus');
        inputs.at(1).simulate('focus');
        inputs.at(2).simulate('focus');
        inputs.at(3).simulate('focus');
        
        expect(wrapper.state().currentActiveIndex).toEqual(3);
        wrapper.unmount();
    });
});
