import React from 'react';
import { mount } from 'enzyme';
import { Checkbox } from '../../index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

function getCb(props) {
    return mount(<Checkbox children={'Semi Design'} {...props} />);
}

describe('checkbox', () => {
    it('className & style', () => {
        const checkbox = getCb({
            className: 'test',
            style: { color: 'red' },
        });
        expect(checkbox.exists(`.${BASE_CLASS_PREFIX}-checkbox.test`)).toEqual(true);
        expect(checkbox.find(`.${BASE_CLASS_PREFIX}-checkbox.test`)).toHaveStyle('color', 'red');
    });

    it('should work basically & click behaviour', () => {
        const checkbox = getCb();
        let checkboxDOM = checkbox.find('input');
        expect(checkboxDOM.exists()).toEqual(true);
        expect(checkbox.state().checked).toEqual(false);
        expect(!!checkboxDOM.disabled).toEqual(false);
        checkbox.find(`.${BASE_CLASS_PREFIX}-checkbox`).simulate('click', {});
        expect(checkbox.state().checked).toEqual(true);
    });

    it('defaultChecked', () => {
        const checkbox = getCb({ defaultChecked: true });
        const checkboxDOM = checkbox.find('input').getDOMNode();
        expect(!!checkboxDOM.checked).toEqual(true);
    });

    it('checked, controlled mode', () => {
        const checkbox = getCb({ checked: true });
        expect(checkbox.state().checked).toEqual(true);
        expect(checkbox.find('input').getDOMNode().checked).toEqual(true);
        expect(checkbox.exists(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`)).toEqual(true);

        checkbox.setProps({ checked: false });
        checkbox.update();
        expect(checkbox.state().checked).toEqual(false);
        expect(checkbox.find('input').getDOMNode().checked).toEqual(false);
        expect(checkbox.exists(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`)).toEqual(false);

        checkbox.setProps({ checked: true }) 
        checkbox.update();
        expect(checkbox.state().checked).toEqual(true);
        expect(checkbox.find('input').getDOMNode().checked).toEqual(true);
        expect(checkbox.exists(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`)).toEqual(true);

        // case like formApi.reset() will case checked  true => undefined
        // can't setProps({}) here, otherwise props compare can't work
        checkbox.setProps({ checked: undefined });
        checkbox.update();
        expect(checkbox.state().checked).toEqual(false);
        expect(checkbox.find('input').getDOMNode().checked).toEqual(false);
        expect(checkbox.exists(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`)).toEqual(false);
    });
 
    it('disabled', () => {
        const checkbox = getCb({ disabled: true });
        expect(checkbox.exists(`.${BASE_CLASS_PREFIX}-checkbox-disabled`)).toEqual(true);
        expect(checkbox.state().checked).toEqual(false);
        checkbox.find(`.${BASE_CLASS_PREFIX}-checkbox`).simulate('click', {});
        expect(checkbox.state().checked).toEqual(false);
    });

    it('onChange', () => {
        const onChange = sinon.spy(value => {});
        const checkbox = mount(<Checkbox onChange={onChange} />);
        checkbox.find(`.${BASE_CLASS_PREFIX}-checkbox`).simulate('click', {});
        expect(onChange.getCall(0).args[0].target.checked).toEqual(true);
        checkbox.find(`.${BASE_CLASS_PREFIX}-checkbox`).simulate('click', {});
        expect(onChange.getCall(1).args[0].target.checked).toEqual(false);
    });

    it('extra', () => {
        let text = 'abcd';
        const checkbox = getCb({ extra: text });
        expect(checkbox.find(`.${BASE_CLASS_PREFIX}-checkbox-extra`).text()).toEqual(text);
    });

    it('indeterminate state', () => {
        const checkbox = getCb({ indeterminate: true });
        expect(checkbox.exists(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`)).toEqual(true);
        // indeterminate 状态下，checked 应该为 false
        expect(checkbox.state().checked).toEqual(false);
    });

    it('indeterminate with checked', () => {
        const checkbox = getCb({ indeterminate: true, checked: true });
        expect(checkbox.exists(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`)).toEqual(true);
        // indeterminate 优先级高于 checked 的视觉效果
        expect(checkbox.state().checked).toEqual(true);
    });

    it('keyboard Enter press', () => {
        const onChange = sinon.spy(value => {});
        const checkbox = mount(<Checkbox onChange={onChange} />);
        // 模拟 Enter 键按下
        checkbox.find(`.${BASE_CLASS_PREFIX}-checkbox`).simulate('keypress', { key: 'Enter', keyCode: 13 });
        expect(onChange.calledOnce).toBe(true);
    });

    it('onMouseEnter and onMouseLeave', () => {
        const onMouseEnter = sinon.spy(() => {});
        const onMouseLeave = sinon.spy(() => {});
        const checkbox = getCb({ onMouseEnter, onMouseLeave });
        checkbox.find(`.${BASE_CLASS_PREFIX}-checkbox`).simulate('mouseEnter', {});
        expect(onMouseEnter.calledOnce).toBe(true);
        checkbox.find(`.${BASE_CLASS_PREFIX}-checkbox`).simulate('mouseLeave', {});
        expect(onMouseLeave.calledOnce).toBe(true);
    });

    it('ARIA attributes - aria-labelledby', () => {
        const checkbox = getCb({ 'aria-labelledby': 'label-id' });
        expect(checkbox.find(`.${BASE_CLASS_PREFIX}-checkbox`).prop('aria-labelledby')).toEqual('label-id');
    });

    it('type card', () => {
        const checkbox = getCb({ type: 'card' });
        expect(checkbox.exists(`.${BASE_CLASS_PREFIX}-checkbox-cardType`)).toEqual(true);
    });

    it('type pureCard', () => {
        const checkbox = getCb({ type: 'pureCard' });
        expect(checkbox.exists(`.${BASE_CLASS_PREFIX}-checkbox-cardType`)).toEqual(true);
    });

    it('focus and blur methods', () => {
        const checkbox = getCb({ defaultChecked: false });
        const instance = checkbox.instance();
        // 测试 focus 方法
        instance.focus();
        // 测试 blur 方法
        instance.blur();
        checkbox.unmount();
    });

    it('handleFocusVisible and handleBlur', () => {
        const checkbox = getCb({ defaultChecked: false });
        const instance = checkbox.instance();
        // 直接调用 handleFocusVisible 方法
        instance.handleFocusVisible({ target: {} });
        checkbox.update();
        // 直接调用 handleBlur 方法
        instance.handleBlur({ target: {} });
        checkbox.update();
        checkbox.unmount();
    });

    it('setFocusVisible adapter method', () => {
        const checkbox = getCb({ defaultChecked: false });
        const instance = checkbox.instance();
        // 直接调用 adapter 方法
        instance.adapter.setFocusVisible(true);
        checkbox.update();
        expect(checkbox.state().focusVisible).toEqual(true);
        
        instance.adapter.setFocusVisible(false);
        checkbox.update();
        expect(checkbox.state().focusVisible).toEqual(false);
        checkbox.unmount();
    });

    it('onChange event with stopPropagation and preventDefault', () => {
        const onChange = sinon.spy(e => {
            // 调用 stopPropagation
            e.stopPropagation();
            // 调用 preventDefault
            e.preventDefault();
        });
        const checkbox = mount(<Checkbox onChange={onChange} />);
        checkbox.find(`.${BASE_CLASS_PREFIX}-checkbox`).simulate('click', {});
        expect(onChange.calledOnce).toBe(true);
        checkbox.unmount();
    });

    it('onChange event with nativeEvent.stopImmediatePropagation', () => {
        const onChange = sinon.spy(e => {
            // 调用 nativeEvent.stopImmediatePropagation
            if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
                e.nativeEvent.stopImmediatePropagation();
            }
        });
        const checkbox = mount(<Checkbox onChange={onChange} />);
        // 创建带有 nativeEvent 的事件
        const event = {
            nativeEvent: {
                stopImmediatePropagation: sinon.spy()
            }
        };
        checkbox.find(`.${BASE_CLASS_PREFIX}-checkbox`).simulate('click', event);
        expect(onChange.calledOnce).toBe(true);
        checkbox.unmount();
    });

    it('checkboxInner blur method', () => {
        const checkbox = getCb({ defaultChecked: false });
        // 获取 CheckboxInner 组件
        const checkboxInner = checkbox.find('CheckboxInner');
        if (checkboxInner.length > 0) {
            const innerInstance = checkboxInner.instance();
            if (innerInstance && innerInstance.blur) {
                innerInstance.blur();
            }
        }
        checkbox.unmount();
    });
});

describe('CheckboxGroup', () => {
    const { Group } = Checkbox;

    function getCheckboxGroup(props) {
        return mount(
            <Group {...props}>
                <Checkbox value="A">A</Checkbox>
                <Checkbox value="B">B</Checkbox>
                <Checkbox value="C">C</Checkbox>
            </Group>
        );
    }

    it('basic render', () => {
        const group = getCheckboxGroup();
        expect(group.find(`.${BASE_CLASS_PREFIX}-checkbox`).length).toEqual(3);
    });

    it('defaultValue', () => {
        const group = getCheckboxGroup({ defaultValue: ['A', 'B'] });
        const checkboxes = group.find(`.${BASE_CLASS_PREFIX}-checkbox`);
        expect(checkboxes.at(0).hasClass(`${BASE_CLASS_PREFIX}-checkbox-checked`)).toEqual(true);
        expect(checkboxes.at(1).hasClass(`${BASE_CLASS_PREFIX}-checkbox-checked`)).toEqual(true);
        expect(checkboxes.at(2).hasClass(`${BASE_CLASS_PREFIX}-checkbox-checked`)).toEqual(false);
    });

    it('controlled value', () => {
        const group = getCheckboxGroup({ value: ['A'] });
        const checkboxes = group.find(`.${BASE_CLASS_PREFIX}-checkbox`);
        expect(checkboxes.at(0).hasClass(`${BASE_CLASS_PREFIX}-checkbox-checked`)).toEqual(true);
        expect(checkboxes.at(1).hasClass(`${BASE_CLASS_PREFIX}-checkbox-checked`)).toEqual(false);
        
        group.setProps({ value: ['B', 'C'] });
        group.update();
        const updatedCheckboxes = group.find(`.${BASE_CLASS_PREFIX}-checkbox`);
        expect(updatedCheckboxes.at(0).hasClass(`${BASE_CLASS_PREFIX}-checkbox-checked`)).toEqual(false);
        expect(updatedCheckboxes.at(1).hasClass(`${BASE_CLASS_PREFIX}-checkbox-checked`)).toEqual(true);
        expect(updatedCheckboxes.at(2).hasClass(`${BASE_CLASS_PREFIX}-checkbox-checked`)).toEqual(true);
    });

    it('onChange callback', () => {
        const onChange = sinon.spy(value => {});
        const group = getCheckboxGroup({ onChange });
        group.find(`.${BASE_CLASS_PREFIX}-checkbox`).at(0).simulate('click', {});
        expect(onChange.calledOnce).toBe(true);
        expect(onChange.getCall(0).args[0]).toEqual(['A']);
    });

    it('disabled group', () => {
        const group = getCheckboxGroup({ disabled: true });
        const checkboxes = group.find(`.${BASE_CLASS_PREFIX}-checkbox`);
        checkboxes.forEach(checkbox => {
            expect(checkbox.hasClass(`${BASE_CLASS_PREFIX}-checkbox-disabled`)).toEqual(true);
        });
    });

    it('direction horizontal', () => {
        const group = getCheckboxGroup({ direction: 'horizontal' });
        expect(group.exists(`.${BASE_CLASS_PREFIX}-checkboxGroup-horizontal`)).toEqual(true);
    });

    it('direction vertical', () => {
        const group = getCheckboxGroup({ direction: 'vertical' });
        expect(group.exists(`.${BASE_CLASS_PREFIX}-checkboxGroup-vertical`)).toEqual(true);
    });

    it('type card', () => {
        const group = getCheckboxGroup({ type: 'card' });
        // card 类型会应用到子 checkbox 上
        expect(group.exists(`.${BASE_CLASS_PREFIX}-checkbox-cardType`)).toEqual(true);
    });

    it('options prop', () => {
        const options = [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3', disabled: true },
        ];
        const group = mount(<Group options={options} />);
        expect(group.find(`.${BASE_CLASS_PREFIX}-checkbox`).length).toEqual(3);
        // 验证第三个选项是禁用的
        expect(group.find(`.${BASE_CLASS_PREFIX}-checkbox`).at(2).hasClass(`${BASE_CLASS_PREFIX}-checkbox-disabled`)).toEqual(true);
    });

    it('name prop', () => {
        const group = getCheckboxGroup({ name: 'test-group' });
        group.find('input').forEach(input => {
            expect(input.prop('name')).toEqual('test-group');
        });
    });

    it('ARIA attributes - aria-label', () => {
        const group = getCheckboxGroup({ 'aria-label': 'Checkbox group' });
        expect(group.find(`.${BASE_CLASS_PREFIX}-checkboxGroup-wrapper`).prop('aria-label')).toEqual('Checkbox group');
    });
});
