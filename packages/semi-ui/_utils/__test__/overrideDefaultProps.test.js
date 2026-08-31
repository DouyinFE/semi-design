import React from 'react';
import { mount } from 'enzyme';
import semiGlobal from '../semi-global';
import Input from '../../input';
import Checkbox from '../../checkbox';

describe('semiGlobal.config.overrideDefaultProps (#3318)', () => {
    afterEach(() => {
        semiGlobal.config.overrideDefaultProps = {};
    });

    it('Input defaultProps 可被全局配置覆盖（showClear）', () => {
        semiGlobal.config.overrideDefaultProps = { Input: { showClear: true } };
        const wrapper = mount(<Input />);
        // Input 开启 showClear 后 wrapper 带 clearable class（无需 value/focus）
        expect(wrapper.exists('.semi-input-wrapper-clearable')).toEqual(true);
        wrapper.unmount();
    });

    it('未设置全局配置时 Input 行为不变（showClear 默认 false）', () => {
        semiGlobal.config.overrideDefaultProps = {};
        const wrapper = mount(<Input />);
        expect(wrapper.exists('.semi-input-wrapper-clearable')).toEqual(false);
        wrapper.unmount();
    });

    it('Checkbox defaultProps 可被全局配置覆盖（defaultChecked）', () => {
        semiGlobal.config.overrideDefaultProps = { Checkbox: { defaultChecked: true } };
        const wrapper = mount(<Checkbox>test</Checkbox>);
        expect(wrapper.find('input[type="checkbox"]').getDOMNode().checked).toEqual(true);
        wrapper.unmount();
    });

    it('组件级 props 优先级高于全局配置', () => {
        semiGlobal.config.overrideDefaultProps = { Input: { showClear: true } };
        const wrapper = mount(<Input showClear={false} />);
        expect(wrapper.exists('.semi-input-wrapper-clearable')).toEqual(false);
        wrapper.unmount();
    });
});
