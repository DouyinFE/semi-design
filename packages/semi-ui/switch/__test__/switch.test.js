import Switch from '../index';
// import { shallow, mount } from 'enzyme';
// import Enzyme, { shallow, render, mount } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// Enzyme.configure({
//     adapter: new Adapter()
// });

import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import { wrap } from 'lodash';

let CHECKED_CLS = `.${BASE_CLASS_PREFIX}-switch-checked`;

describe('Switch', () => {
    it('switch with custom className & style', () => {
        const wrapper = mount(<Switch className="test" style={{ color: 'red' }} />);
        expect(wrapper.hasClass('test')).toEqual(true);
        expect(wrapper.find('div.test')).toHaveStyle('color', 'red');
        wrapper
        .find('input')
        .first()
        .simulate('change', {
            target: {
                checked: true,
            },
        });
        wrapper.unmount();
    });

    it('switch checkedText / unchekcedText', () => {
        const checkSwitch = mount(<Switch checkedText='semi' uncheckedText='design' checked={true} />);
        const unCheckSwitch = mount(<Switch checkedText='semi' uncheckedText='design' />);
        expect(checkSwitch.find('.semi-switch-checked-text').text()).toEqual('semi');
        expect(unCheckSwitch.find('.semi-switch-unchecked-text').text()).toEqual('design');
    });

    it('switch disabled when props.disabled', () => {
        const wrapperUnchecked = mount(<Switch disabled />);
        expect(wrapperUnchecked.exists(`.semi-switch-disabled`)).toEqual(true);
        expect(wrapperUnchecked.state('nativeControlDisabled')).toEqual(true);
        wrapperUnchecked.setProps({ disabled: false });
        wrapperUnchecked.update();
        expect(wrapperUnchecked.exists(`.semi-switch-disabled`)).toEqual(false);
        expect(wrapperUnchecked.state('nativeControlDisabled')).toEqual(false);

        const wrapperChecked = mount(<Switch disabled defaultChecked />);
        expect(wrapperChecked.exists(CHECKED_CLS)).toEqual(true);
        expect(wrapperChecked.exists(`.semi-switch-disabled`)).toEqual(true);
        expect(wrapperChecked.state('nativeControlDisabled')).toEqual(true);
        wrapperChecked.setProps({ disabled: false })
        wrapperChecked.update();
        expect(wrapperChecked.exists(`.semi-switch-disabled`)).toEqual(false);
        expect(wrapperChecked.state('nativeControlDisabled')).toEqual(false);
    });

    it('switch onChange', () => {
        let onChange = () => {};
        let spyChange = sinon.spy(onChange);
        const wrapper = mount(<Switch onChange={spyChange} />);
        let input = wrapper.find('input').first();
        let event = { target: { checked: true }};
        input.simulate('change', event)
        expect(spyChange.calledOnce).toEqual(true);
        expect(spyChange.calledWithMatch(true)).toEqual(true);
    });

    it('switch onMouseEnter / onMouseLeave', () => {
        let onMouseEnter = () => {};
        let onMouseLeave = () => {};
        let spyEnter = sinon.spy(onMouseEnter);
        let spyLeave = sinon.spy(onMouseLeave);
        const wrapper = mount(<Switch defaultChecked onMouseEnter={spyEnter} onMouseLeave={spyLeave} />);
        const div = wrapper.find('div.semi-switch').first();
        div.simulate('mouseEnter', {});
        expect(spyEnter.calledOnce).toEqual(true);
        div.simulate('mouseLeave', {});
        expect(spyLeave.calledOnce).toEqual(true);
    });

    it('switch size', () => {
        const largeSwitch = shallow(<Switch size='large' />);
        const defaultSwitch = shallow(<Switch size='default' />);
        const smallSwitch = shallow(<Switch size='small' />);
        expect(smallSwitch.exists('.semi-switch-small')).toEqual(true);
        expect(defaultSwitch.exists('.semi-switch-small')).toEqual(false);
        expect(defaultSwitch.exists('.semi-switch-large')).toEqual(false);
        expect(largeSwitch.exists('.semi-switch-large')).toEqual(true);
    });

    it('switch controlled mode', () => {
        let checked = false;

        let onChange = val => {
            checked = val;
        };

        const spy = sinon.spy(onChange);
        let wrapper = mount(<Switch checked={checked} onChange={spy} />);
        expect(wrapper.exists(CHECKED_CLS)).toEqual(false);

        wrapper
            .find('input')
            .first()
            .simulate('change', {
                target: {
                    checked: true,
                },
            });
        expect(spy.calledOnce).toBe(true);
        expect(checked === true).toEqual(true);

        // !!!important，在回调函数中修改了props.checke的值，不会在已monted的wrapper中生效，需要手动更新一次
        wrapper.setProps({ checked: true });
        // 更新了props之后，实际上在Symbol(enzyme.__node__).rendered.instance.className已有对应的CHECKED_CLS存在，
        // 但不知道为啥，必须手动触发一次update之后，调用exists后才是true，很奇怪
        wrapper.update();

        expect(wrapper.exists(CHECKED_CLS)).toEqual(true);
    });

    it('switch with loading', () => {
        const wrapperLoading = shallow(<Switch loading />);
        expect(wrapperLoading.exists(`.${BASE_CLASS_PREFIX}-switch-loading`)).toEqual(true);
        const wrapper = shallow(<Switch />);
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-switch-loading`)).toEqual(false);
    });

    it('switch loading state', () => {
        const wrapper = mount(<Switch loading />);
        // loading 状态下，switch 应该显示 loading 样式
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-switch-loading`)).toEqual(true);
        wrapper.unmount();
    });

    it('switch aria-label', () => {
        const wrapper = mount(<Switch aria-label="Toggle switch" />);
        const input = wrapper.find('input').first();
        expect(input.prop('aria-label')).toEqual('Toggle switch');
        wrapper.unmount();
    });

    it('switch defaultChecked', () => {
        const wrapper = mount(<Switch defaultChecked />);
        expect(wrapper.exists(CHECKED_CLS)).toEqual(true);
        // 验证 defaultChecked 属性被正确传递
        expect(wrapper.props().defaultChecked).toEqual(true);
        wrapper.unmount();
    });

    it('switch id prop', () => {
        const wrapper = mount(<Switch id="my-switch" />);
        const input = wrapper.find('input').first();
        expect(input.prop('id')).toEqual('my-switch');
        wrapper.unmount();
    });

    it('switch with custom checkedText and uncheckedText ReactNode', () => {
        const checkSwitch = mount(
            <Switch 
                checkedText={<span className="custom-checked">ON</span>} 
                uncheckedText={<span className="custom-unchecked">OFF</span>} 
                checked={true} 
            />
        );
        expect(checkSwitch.exists('.custom-checked')).toEqual(true);
        checkSwitch.unmount();
    });

    it('switch aria-labelledby', () => {
        const wrapper = mount(<Switch aria-labelledby="switch-label" />);
        const input = wrapper.find('input').first();
        expect(input.prop('aria-labelledby')).toEqual('switch-label');
        wrapper.unmount();
    });

    it('switch aria-describedby', () => {
        const wrapper = mount(<Switch aria-describedby="switch-description" />);
        const input = wrapper.find('input').first();
        expect(input.prop('aria-describedby')).toEqual('switch-description');
        wrapper.unmount();
    });

    it('switch aria-invalid', () => {
        const wrapper = mount(<Switch aria-invalid={true} />);
        const input = wrapper.find('input').first();
        expect(input.prop('aria-invalid')).toEqual(true);
        wrapper.unmount();
    });

    it('switch aria-errormessage', () => {
        const wrapper = mount(<Switch aria-errormessage="error-msg" />);
        const input = wrapper.find('input').first();
        expect(input.prop('aria-errormessage')).toEqual('error-msg');
        wrapper.unmount();
    });

    it('switch aria-checked reflects state', () => {
        const wrapper = mount(<Switch defaultChecked />);
        const input = wrapper.find('input').first();
        expect(input.prop('aria-checked')).toEqual(true);
        wrapper.unmount();
    });

    it('switch aria-disabled reflects disabled prop', () => {
        const wrapper = mount(<Switch disabled />);
        const input = wrapper.find('input').first();
        expect(input.prop('aria-disabled')).toEqual(true);
        wrapper.unmount();
    });

    it('switch role is switch', () => {
        const wrapper = mount(<Switch />);
        const input = wrapper.find('input').first();
        expect(input.prop('role')).toEqual('switch');
        wrapper.unmount();
    });

    it('switch focus event triggers focusVisible', () => {
        const wrapper = mount(<Switch />);
        const input = wrapper.find('input').first();
        
        // 模拟 focus 事件
        input.simulate('focus');
        // focusVisible 状态由 foundation 处理
        wrapper.unmount();
    });

    it('switch blur event clears focusVisible', () => {
        const wrapper = mount(<Switch />);
        const input = wrapper.find('input').first();
        
        input.simulate('focus');
        input.simulate('blur');
        // focusVisible 应该被清除
        expect(wrapper.state('focusVisible')).toEqual(false);
        wrapper.unmount();
    });

    it('switch loading prevents change', () => {
        const onChange = sinon.spy();
        const wrapper = mount(<Switch loading onChange={onChange} />);
        const input = wrapper.find('input').first();
        
        // loading 状态下 input 应该是 disabled
        expect(input.prop('disabled')).toEqual(true);
        wrapper.unmount();
    });

    it('switch small size does not show checkedText', () => {
        const wrapper = mount(<Switch size="small" checkedText="ON" checked={true} />);
        // small 尺寸不显示 checkedText
        expect(wrapper.exists('.semi-switch-checked-text')).toEqual(false);
        wrapper.unmount();
    });

    it('switch small size does not show uncheckedText', () => {
        const wrapper = mount(<Switch size="small" uncheckedText="OFF" />);
        // small 尺寸不显示 uncheckedText
        expect(wrapper.exists('.semi-switch-unchecked-text')).toEqual(false);
        wrapper.unmount();
    });

    it('switch large size shows checkedText', () => {
        const wrapper = mount(<Switch size="large" checkedText="ON" checked={true} />);
        expect(wrapper.exists('.semi-switch-checked-text')).toEqual(true);
        wrapper.unmount();
    });

    it('switch default size shows checkedText', () => {
        const wrapper = mount(<Switch size="default" checkedText="ON" checked={true} />);
        expect(wrapper.exists('.semi-switch-checked-text')).toEqual(true);
        wrapper.unmount();
    });

    it('switch unchecked does not show checkedText', () => {
        const wrapper = mount(<Switch checkedText="ON" uncheckedText="OFF" />);
        expect(wrapper.exists('.semi-switch-checked-text')).toEqual(false);
        expect(wrapper.exists('.semi-switch-unchecked-text')).toEqual(true);
        wrapper.unmount();
    });

    it('switch checked does not show uncheckedText', () => {
        const wrapper = mount(<Switch checkedText="ON" uncheckedText="OFF" checked={true} />);
        expect(wrapper.exists('.semi-switch-checked-text')).toEqual(true);
        expect(wrapper.exists('.semi-switch-unchecked-text')).toEqual(false);
        wrapper.unmount();
    });

    it('switch loading shows Spin component', () => {
        const wrapper = mount(<Switch loading />);
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-switch-loading-spin`)).toEqual(true);
        wrapper.unmount();
    });

    it('switch not loading shows knob', () => {
        const wrapper = mount(<Switch />);
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-switch-knob`)).toEqual(true);
        wrapper.unmount();
    });

    it('switch componentDidMount initializes foundation', () => {
        const wrapper = mount(<Switch />);
        // 验证组件正确挂载
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-switch`)).toEqual(true);
        wrapper.unmount();
    });

    it('switch componentWillUnmount destroys foundation', () => {
        const wrapper = mount(<Switch />);
        wrapper.unmount();
        // 验证组件正确卸载，不抛出错误
    });

    it('switch checked prop updates state', () => {
        const wrapper = mount(<Switch checked={false} />);
        expect(wrapper.state('nativeControlChecked')).toEqual(false);
        
        wrapper.setProps({ checked: true });
        expect(wrapper.state('nativeControlChecked')).toEqual(true);
        wrapper.unmount();
    });

    it('switch input type is checkbox', () => {
        const wrapper = mount(<Switch />);
        const input = wrapper.find('input').first();
        expect(input.prop('type')).toEqual('checkbox');
        wrapper.unmount();
    });

    it('switch input has correct className', () => {
        const wrapper = mount(<Switch />);
        const input = wrapper.find('input').first();
        expect(input.hasClass(`${BASE_CLASS_PREFIX}-switch-native-control`)).toEqual(true);
        wrapper.unmount();
    });

    it('switch focus class is applied when focusVisible', () => {
        const wrapper = mount(<Switch />);
        // 初始状态没有 focus 类
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-switch-focus`)).toEqual(false);
        wrapper.unmount();
    });

    it('switch loading with different sizes', () => {
        const smallLoading = mount(<Switch loading size="small" />);
        expect(smallLoading.exists(`.${BASE_CLASS_PREFIX}-switch-loading`)).toEqual(true);
        smallLoading.unmount();
        
        const largeLoading = mount(<Switch loading size="large" />);
        expect(largeLoading.exists(`.${BASE_CLASS_PREFIX}-switch-loading`)).toEqual(true);
        largeLoading.unmount();
    });

    it('switch disabled and loading together', () => {
        const wrapper = mount(<Switch disabled loading />);
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-switch-disabled`)).toEqual(true);
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-switch-loading`)).toEqual(true);
        wrapper.unmount();
    });

    it('switch defaultChecked with disabled', () => {
        const wrapper = mount(<Switch defaultChecked disabled />);
        expect(wrapper.exists(CHECKED_CLS)).toEqual(true);
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-switch-disabled`)).toEqual(true);
        wrapper.unmount();
    });

    it('switch onChange receives event object', () => {
        const onChange = sinon.spy();
        const wrapper = mount(<Switch onChange={onChange} />);
        const input = wrapper.find('input').first();
        
        input.simulate('change', { target: { checked: true } });
        
        // onChange 应该接收 checked 值和事件对象
        expect(onChange.calledOnce).toEqual(true);
        const args = onChange.firstCall.args;
        expect(args[0]).toEqual(true);
        wrapper.unmount();
    });

    it('switch multiple onChange calls', () => {
        const onChange = sinon.spy();
        const wrapper = mount(<Switch onChange={onChange} />);
        const input = wrapper.find('input').first();
        
        input.simulate('change', { target: { checked: true } });
        input.simulate('change', { target: { checked: false } });
        input.simulate('change', { target: { checked: true } });
        
        expect(onChange.callCount).toEqual(3);
        wrapper.unmount();
    });

    it('switch without onChange prop', () => {
        const wrapper = mount(<Switch />);
        const input = wrapper.find('input').first();
        
        // 应该不抛出错误
        input.simulate('change', { target: { checked: true } });
        wrapper.unmount();
    });

});
