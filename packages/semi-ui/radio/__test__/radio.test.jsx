import React from 'react';
import { mount } from 'enzyme';
import Radio from '../index';
import RadioInner from '../radioInner';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

describe('radio', () => {

    it('radio should work basically', () => {
        const radio = mount(
            <Radio />
        );
        const radioDOM = radio.find('input');

        expect(radioDOM.exists()).toEqual(true);
        expect(Boolean(radioDOM.checked)).toEqual(false);
        expect(Boolean(radioDOM.disabled)).toEqual(false);

    });

    it('radio default checked', () => {
        const radio = mount(
            <Radio checked />
        );

        const radioDOM = radio.find('input').getDOMNode();

        expect(Boolean(radioDOM.checked)).toEqual(true);

    });

    it('radio default disabled', () => {
        const radio = mount(
            <Radio disabled />
        );

        const radioDOM = radio.find('input').getDOMNode();

        expect(Boolean(radioDOM.disabled)).toEqual(true);

    });

    it('radio onChange', () => {
        const onChange = sinon.spy(value => {});
        const onChange2 = sinon.spy(value => {});
        const radio = mount(<Radio onChange={onChange} />);
        const advancedRadio = mount(<Radio mode="advanced" onChange={onChange2} />);

        // 普通 Radio
        const elem = radio.find('input');
        elem.simulate('change', { target: { checked: true } });
        expect(onChange.calledOnce).toBe(true);
        expect(onChange.getCall(0).args[0].target.checked).toBe(true);

        // mode=advanced Radio
        const elem2 = advancedRadio.find('input');
        elem2.simulate('change', { target: { checked: true } });
        expect(onChange2.calledOnce).toBe(true);
        // 验证是否能正确获取参数
        expect(onChange2.getCall(0).args[0].target.checked).toBe(true);
    });

    it('radio advanced mode', () => {
        // Radio即使不是mode=advanced测试时也可以通过调用onChange修改选中状态
        // 而用户点击时，由于input的type为radio，用户点击这时不会触发onChange
        // 这个用例用于验证onChange是否能跑通
        const onChange = sinon.spy(value => {});
        const wrapper = mount(<Radio mode="advanced" onChange={onChange}>允许取消选择</Radio>);

        const radioInner = wrapper.find(RadioInner);
        wrapper
            .find('input')
            .first()
            .simulate('change', { target: { checked: true, stopPropagation: () => {}, preventDefault: () => {} } });
        expect(radioInner.state().checked).toBe(true);

        wrapper
            .find('input')
            .first()
            .simulate('change', { target: { checked: false, stopPropagation: () => {}, preventDefault: () => {} } });
        expect(radioInner.state().checked).toBe(false);
    });

    it('radio button style', () => {
        const radio = mount(
            <Radio type="button" />
        );
        expect(radio.exists(`.${BASE_CLASS_PREFIX}-radio-buttonRadioComponent`)).toEqual(true);
    });

    it('radio card style', () => {
        const radio = mount(
            <Radio type="card">Card Radio</Radio>
        );
        expect(radio.exists(`.${BASE_CLASS_PREFIX}-radio-cardRadioGroup`)).toEqual(true);
    });

    it('radio pureCard style', () => {
        const radio = mount(
            <Radio type="pureCard">Pure Card Radio</Radio>
        );
        expect(radio.exists(`.${BASE_CLASS_PREFIX}-radio-cardRadioGroup`)).toEqual(true);
        expect(radio.exists(`.${BASE_CLASS_PREFIX}-radio-inner-pureCardRadio`)).toEqual(true);
    });

    it('radio onMouseEnter and onMouseLeave', () => {
        const onMouseEnter = sinon.spy(() => {});
        const onMouseLeave = sinon.spy(() => {});
        const radio = mount(
            <Radio onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>Test</Radio>
        );
        radio.find('label').simulate('mouseEnter', {});
        expect(onMouseEnter.calledOnce).toBe(true);
        radio.find('label').simulate('mouseLeave', {});
        expect(onMouseLeave.calledOnce).toBe(true);
    });

    it('radio extra prop', () => {
        const extraText = 'Extra information';
        const radio = mount(
            <Radio extra={extraText}>Radio with extra</Radio>
        );
        expect(radio.find(`.${BASE_CLASS_PREFIX}-radio-extra`).text()).toEqual(extraText);
    });

    it('radio displayMode vertical', () => {
        const radio = mount(
            <Radio displayMode="vertical">Vertical Radio</Radio>
        );
        expect(radio.exists(`.${BASE_CLASS_PREFIX}-radio-vertical`)).toEqual(true);
    });

    it('radio controlled mode', () => {
        const radio = mount(
            <Radio checked={true}>Controlled Radio</Radio>
        );
        expect(radio.find('input').getDOMNode().checked).toEqual(true);
        
        radio.setProps({ checked: false });
        radio.update();
        expect(radio.find('input').getDOMNode().checked).toEqual(false);
    });

    it('radio with value prop', () => {
        const radio = mount(
            <Radio value="test-value">Radio with value</Radio>
        );
        // value 属性在 Radio 组件中用于 RadioGroup 的选中判断，不直接传递给 input
        expect(radio.props().value).toEqual('test-value');
    });

    it('radio aria-label', () => {
        const radio = mount(
            <Radio aria-label="Test radio">Radio</Radio>
        );
        expect(radio.find('input').prop('aria-label')).toEqual('Test radio');
    });

    it('radio focus and blur methods', () => {
        const radio = mount(<Radio>Test Radio</Radio>);
        const instance = radio.instance();
        // 测试 focus 方法
        instance.focus();
        // 测试 blur 方法
        instance.blur();
        radio.unmount();
    });

    it('radio handleFocusVisible and handleBlur', () => {
        const radio = mount(<Radio>Test Radio</Radio>);
        const instance = radio.instance();
        // 直接调用 handleFocusVisible 方法
        instance.handleFocusVisible({ target: {} });
        radio.update();
        // 直接调用 handleBlur 方法
        instance.handleBlur({ target: {} });
        radio.update();
        radio.unmount();
    });

    it('radio setFocusVisible adapter method', () => {
        const radio = mount(<Radio>Test Radio</Radio>);
        const instance = radio.instance();
        // 直接调用 adapter 方法
        instance.adapter.setFocusVisible(true);
        radio.update();
        expect(radio.state().focusVisible).toEqual(true);
        
        instance.adapter.setFocusVisible(false);
        radio.update();
        expect(radio.state().focusVisible).toEqual(false);
        radio.unmount();
    });

    it('radio controlled mode with undefined', () => {
        const radio = mount(<Radio checked={true}>Controlled Radio</Radio>);
        expect(radio.find('input').getDOMNode().checked).toEqual(true);
        
        // 设置 checked 为 undefined
        radio.setProps({ checked: undefined });
        radio.update();
        expect(radio.state().checked).toEqual(false);
        radio.unmount();
    });

    it('radioInner blur and focus methods', () => {
        const radio = mount(<Radio>Test Radio</Radio>);
        const radioInner = radio.find(RadioInner);
        if (radioInner.length > 0) {
            const innerInstance = radioInner.instance();
            if (innerInstance) {
                // 测试 focus 方法
                innerInstance.focus();
                // 测试 blur 方法
                innerInstance.blur();
            }
        }
        radio.unmount();
    });

    it('radioInner with preventScroll', () => {
        const radio = mount(<Radio preventScroll={true}>Test Radio</Radio>);
        const radioInner = radio.find(RadioInner);
        if (radioInner.length > 0) {
            const innerInstance = radioInner.instance();
            if (innerInstance) {
                // 测试带 preventScroll 的 focus 方法
                innerInstance.focus();
            }
        }
        radio.unmount();
    });
});