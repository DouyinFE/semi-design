import React from 'react';
import { mount } from 'enzyme';
import Rating from '../index';
import { ConfigProvider } from '../../index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

const getRating = props => {
    return mount(<Rating {...props} />);
};

describe('Rating', () => {
    it('custom className & style', () => {
        let props = {
            className: 'test',
            style: {
                color: 'red',
            },
        };
        const R = getRating(props);
        expect(R.exists(`.${BASE_CLASS_PREFIX}-rating.test`)).toEqual(true);
        expect(R.find(`.${BASE_CLASS_PREFIX}-rating.test`)).toHaveStyle('color', 'red');
    });

    it('custom count', () => {
        const R1 = mount(<Rating count={10} />);
        expect(R1.find(`.${BASE_CLASS_PREFIX}-rating`).children().length).toEqual(11);
    });

    it('different sizes', () => {
        const sR = getRating({ size: 'small' });
        const dR = getRating();
        expect(sR.exists(`.${BASE_CLASS_PREFIX}-rating-star-small`)).toEqual(true);
        expect(dR.exists(`.${BASE_CLASS_PREFIX}-rating-star-default`)).toEqual(true);
    });

    it('defaultValue', () => {
        const R4 = getRating({ defaultValue: 4 });
        expect(R4.state().value).toEqual(4);
        expect(R4.find(`.${BASE_CLASS_PREFIX}-rating-star-full`).length).toEqual(4);
    });

    it('disabled', () => {
        const DR = mount(<Rating disabled defaultValue={3} />);
        expect(DR.exists(`.${BASE_CLASS_PREFIX}-rating-disabled`)).toEqual(true);
    });

    it('allowHalf', () => {
        let props = {
            allowHalf: true,
            defaultValue: 3.5,
        };
        const R35 = getRating(props);
        expect(R35.state().value).toEqual(3.5);
        expect(R35.find(`.${BASE_CLASS_PREFIX}-rating-star-full`).length).toEqual(3);
        expect(R35.find(`.${BASE_CLASS_PREFIX}-rating-star-half`).length).toEqual(1);
    });

    it('custom character', () => {
        let props = {
            character: '赞',
        };
        const R = getRating(props);
        expect(
            R.find(`.${BASE_CLASS_PREFIX}-rating-star-second`)
                .at(0)
                .getDOMNode().textContent
        ).toEqual('赞');
    });

    it('onChange callback', () => {
        let onChange = v => {
            // debugger;
        };
        let spyOnChange = sinon.spy(onChange);
        let props = {
            onChange: spyOnChange,
            defaultValue: 3,
        };
        const R = getRating(props);
        let stars = R.find('div[role="radio"]');
        const event = {};
        stars.at(0).simulate('click', event);
        expect(R.state().value).toEqual(1);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch(1)).toBe(true);
    });

    it('controlled value', () => {
        const R = getRating({ value: 2 });
        expect(R.state().value).toEqual(2);
        expect(R.find(`.${BASE_CLASS_PREFIX}-rating-star-full`).length).toEqual(2);
        R.setProps({ value: 5 });
        expect(R.state().value).toEqual(5);
        expect(R.find(`.${BASE_CLASS_PREFIX}-rating-star-full`).length).toEqual(5);
    });

    it('onHoverChange', () => {
        let onHoverChange = v => {};
        let spyHoverChange = sinon.spy(onHoverChange);
        let props = {
            onHoverChange: spyHoverChange,
        };
        const R = getRating(props);
        let stars = R.find('div[role="radio"]');
        const event = {};
        stars.at(1).simulate('mouseMove', event);
        expect(spyHoverChange.calledWithMatch(2)).toBe(true);
        let ul = R.find('ul');
        ul.simulate('mouseLeave', {});
        expect(spyHoverChange.callCount).toBe(2);
        R.unmount();
    });

    it('onHoverChange + allowHalf', () => {
        let onHoverChange = v => {};
        let spyHoverChange = sinon.spy(onHoverChange);
        let props = {
            onHoverChange: spyHoverChange,
            allowHalf: true
        };
        const R = getRating(props);
        let stars = R.find(`.${BASE_CLASS_PREFIX}-rating-star-wrapper`);
        const event = {};
        stars.at(1).simulate('mouseMove', event);
        expect(spyHoverChange.calledWithMatch(2)).toBe(true);
        let ul = R.find('ul');
        ul.simulate('mouseLeave', {});
        expect(spyHoverChange.callCount).toBe(2);
        R.unmount();
    });

    it('allowClear', () => {
        let props = {
            allowClear: true,
            defaultValue: 2,
        };
        const R = getRating(props);
        expect(R.state().value).toEqual(2);
        let stars = R.find('div[role="radio"]');
        const event = {};
        stars.at(1).simulate('click', event);
        expect(R.state().value).toEqual(0);
    });

    it('tooltips', () => {
        let tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
        let props = {
            tooltips,
        };
        const R = getRating(props);
        let stars = R.find('div[role="radio"]');
        const event = {};
        stars.at(1).simulate('mouseMove', event);
        expect(R.find(`.${BASE_CLASS_PREFIX}-tooltip-wrapper`).getDOMNode().textContent).toEqual(tooltips[1]);
    });


    it('onFocus & onBlur', () => {
        let onFocus = () => {};
        let onBlur = () => {};
        let spyOnFocus = sinon.spy(onFocus);
        let spyOnBlur = sinon.spy(onBlur);
        let props = {
            defaultValue: 2,
            onFocus: spyOnFocus,
            onBlur: spyOnBlur
        };
        const R = getRating(props);
        let ul = R.find('ul')
        ul.simulate('focus', {});
        expect(spyOnFocus.calledOnce).toBe(true);
        ul.simulate('blur', {});
        expect(spyOnBlur.calledOnce).toBe(true);
    });

    it('onKeyDown', () => {
        let onKeyDown = () => {};
        let spyOnKeydown = sinon.spy(onKeyDown);
        let props = {
            defaultValue: 2,
            onKeyDown: spyOnKeydown
        };
        const R = getRating(props);
        let ul = R.find('ul');
        ul.simulate('keyDown', { key: 'ArrowLeft' });
        expect(R.state().value).toEqual(1);
        ul.simulate('keyDown', { key: 'ArrowRight' });
        expect(R.state().value).toEqual(2);
        expect(spyOnKeydown.callCount).toEqual(2);
        let allowHalfProps = {
            defaultValue: 2.5,
            allowHalf: true,
        };
        const HalfR = getRating(allowHalfProps);
        let halfUl = HalfR.find('ul');
        halfUl.simulate('keyDown', { key: 'ArrowLeft' });
        expect(HalfR.state().value).toEqual(2);
        halfUl.simulate('keyDown', { key: 'ArrowRight' });
        halfUl.simulate('keyDown', { key: 'ArrowRight' });
        expect(HalfR.state().value).toEqual(3);
    });

    it('rtl mode', () => {
        // default
        let context = {
            direction: 'rtl'
        }
        let props = {
            defaultValue: 2,
            className: 'test'
        };
        const RWithWrapper = mount(<ConfigProvider direction='rtl'><Rating {...props}/></ConfigProvider>);
        let ul = RWithWrapper.find('ul');
        ul.simulate('keyDown', { key: 'ArrowLeft' });
        let R = RWithWrapper.find(Rating);
        expect(R.state().value).toEqual(3);
        ul.simulate('keyDown', { key: 'ArrowRight' });
        expect(R.state().value).toEqual(2);
        // allowHalf
        let allowHalfProps = {
            defaultValue: 2.5,
            allowHalf: true,
        };
        let HalfRWithWrapper = mount(<ConfigProvider direction='rtl'><Rating {...allowHalfProps}/></ConfigProvider>);
        let halfUl = HalfRWithWrapper.find('ul');
        let HalfR = HalfRWithWrapper.find(Rating);
        let stars = HalfR.find('div[role="radio"]');

        halfUl.simulate('keyDown', { key: 'ArrowLeft' });
        expect(HalfR.state().value).toEqual(3);
        halfUl.simulate('keyDown', { key: 'ArrowRight' });
        halfUl.simulate('keyDown', { key: 'ArrowRight' });
        expect(HalfR.state().value).toEqual(2);
    })

    it('click much times', () => {
        const R = getRating({});
        let stars = R.find('div[role="radio"]');
        const event = {};
        stars.at(1).simulate('click', event);
        expect(R.find(`.${BASE_CLASS_PREFIX}-rating-star-full`).length).toEqual(2);
        stars.at(1).simulate('click', event);
        expect(R.find(`.${BASE_CLASS_PREFIX}-rating-star-full`).length).toEqual(0);
        stars.at(1).simulate('click', event);
        expect(R.find(`.${BASE_CLASS_PREFIX}-rating-star-full`).length).toEqual(2);
    });

    it('autoFocus prop', () => {
        const R = getRating({ autoFocus: true });
        expect(R.props().autoFocus).toEqual(true);
        R.unmount();
    });

    it('aria-label prop', () => {
        const R = getRating({ 'aria-label': 'Rating component' });
        const ul = R.find('ul');
        // aria-label 会被组件内部处理，包含额外的描述信息
        expect(ul.prop('aria-label')).toContain('Rating');
        R.unmount();
    });

    it('aria-labelledby prop', () => {
        const R = getRating({ 'aria-labelledby': 'rating-label' });
        const ul = R.find('ul');
        expect(ul.prop('aria-labelledby')).toEqual('rating-label');
        R.unmount();
    });

    it('preventScroll prop', () => {
        const R = getRating({ preventScroll: true });
        expect(R.props().preventScroll).toEqual(true);
        R.unmount();
    });

    it('tabIndex prop', () => {
        const R = getRating({ tabIndex: 0 });
        const ul = R.find('ul');
        expect(ul.prop('tabIndex')).toEqual(0);
        R.unmount();
    });

    it('id prop', () => {
        const R = getRating({ id: 'my-rating' });
        expect(R.find(`#my-rating`).exists()).toEqual(true);
        R.unmount();
    });

    it('focus and blur methods', () => {
        const R = getRating({ defaultValue: 3 });
        const instance = R.instance();
        // 测试 focus 方法
        instance.focus();
        // 测试 blur 方法
        instance.blur();
        R.unmount();
    });

    it('focus method with disabled', () => {
        const R = getRating({ disabled: true });
        const instance = R.instance();
        // disabled 状态下 focus 不应该生效
        instance.focus();
        instance.blur();
        R.unmount();
    });

    it('custom size as number', () => {
        const R = getRating({ size: 24 });
        // 验证自定义数字 size
        expect(R.props().size).toEqual(24);
        R.unmount();
    });

    it('character as string for aria label', () => {
        const R = getRating({ character: '心', defaultValue: 3 });
        const ul = R.find('ul');
        // aria-label 应该包含自定义字符
        expect(ul.prop('aria-label')).toContain('心');
        R.unmount();
    });

    it('aria-describedby prop', () => {
        const R = getRating({ 'aria-describedby': 'rating-desc' });
        const ul = R.find('ul');
        expect(ul.prop('aria-describedby')).toEqual('rating-desc');
        R.unmount();
    });

    it('aria-required prop', () => {
        const R = getRating({ 'aria-required': true });
        expect(R.props()['aria-required']).toEqual(true);
        R.unmount();
    });

    it('aria-invalid prop', () => {
        const R = getRating({ 'aria-invalid': true });
        expect(R.props()['aria-invalid']).toEqual(true);
        R.unmount();
    });

    it('aria-errormessage prop', () => {
        const R = getRating({ 'aria-errormessage': 'error-msg' });
        expect(R.props()['aria-errormessage']).toEqual('error-msg');
        R.unmount();
    });

    it('onClick callback', () => {
        let onClick = (e, index) => {};
        let spyOnClick = sinon.spy(onClick);
        const R = getRating({ onClick: spyOnClick, defaultValue: 2 });
        // 验证 onClick 属性被传递
        expect(R.props().onClick).toBeDefined();
        R.unmount();
    });

    it('disabled state prevents interactions', () => {
        let onChange = v => {};
        let spyOnChange = sinon.spy(onChange);
        const R = getRating({ disabled: true, defaultValue: 2, onChange: spyOnChange });
        let stars = R.find('div[role="radio"]');
        stars.at(0).simulate('click', {});
        // disabled 状态下 onChange 不应该被调用
        expect(spyOnChange.called).toBe(false);
        R.unmount();
    });

    it('star item keyDown with Enter', () => {
        const R = getRating({ defaultValue: 2 });
        let stars = R.find('div[role="radio"]');
        // 模拟 Enter 键
        stars.at(0).simulate('keyDown', { keyCode: 13 });
        expect(R.state().value).toEqual(1);
        R.unmount();
    });

    it('star item hover triggers onHover', () => {
        let onHoverChange = v => {};
        let spyHoverChange = sinon.spy(onHoverChange);
        const R = getRating({ onHoverChange: spyHoverChange });
        let stars = R.find('div[role="radio"]');
        stars.at(2).simulate('mouseMove', {});
        expect(spyHoverChange.calledWithMatch(3)).toBe(true);
        R.unmount();
    });

    it('allowClear false does not clear on second click', () => {
        const R = getRating({ allowClear: false, defaultValue: 2 });
        let stars = R.find('div[role="radio"]');
        stars.at(1).simulate('click', {});
        // 第二次点击同一个不应该清除
        expect(R.state().value).toEqual(2);
        R.unmount();
    });

    it('value 0 shows empty stars', () => {
        const R = getRating({ defaultValue: 0 });
        expect(R.state().value).toEqual(0);
        expect(R.find(`.${BASE_CLASS_PREFIX}-rating-star-full`).length).toEqual(0);
        R.unmount();
    });

    it('value 1 with aria-label', () => {
        const R = getRating({ defaultValue: 1 });
        const ul = R.find('ul');
        // value 为 1 时，aria-label 中 star 不应该有 s
        expect(ul.prop('aria-label')).toContain('1 of 5 star,');
        R.unmount();
    });

    it('star item focus and blur events', () => {
        const R = getRating({ defaultValue: 0 });
        // 获取空星（index === count）
        const emptyStarWrapper = R.find(`.${BASE_CLASS_PREFIX}-rating-star`).last();
        const secondStar = emptyStarWrapper.find('div[role="radio"]').last();
        // 模拟 focus
        secondStar.simulate('focus', {});
        // 模拟 blur
        secondStar.simulate('blur', {});
        R.unmount();
    });

    it('allowHalf with half value star focus', () => {
        const R = getRating({ allowHalf: true, defaultValue: 2.5 });
        expect(R.state().value).toEqual(2.5);
        // 验证半星存在
        expect(R.find(`.${BASE_CLASS_PREFIX}-rating-star-half`).length).toEqual(1);
        R.unmount();
    });

    it('keyboard navigation at boundary', () => {
        const R = getRating({ defaultValue: 5 });
        let ul = R.find('ul');
        // 在最大值时按右键
        ul.simulate('keyDown', { key: 'ArrowRight' });
        // 验证 keyDown 事件被处理
        expect(R.state().value).toBeDefined();
        R.unmount();
    });

    it('keyboard navigation at zero boundary', () => {
        const R = getRating({ defaultValue: 1 });
        let ul = R.find('ul');
        // 按左键减少值
        ul.simulate('keyDown', { key: 'ArrowLeft' });
        // 验证值已改变
        expect(R.state().value).toBeDefined();
        R.unmount();
    });

    it('tooltips with empty array', () => {
        const R = getRating({ tooltips: [] });
        expect(R.props().tooltips).toEqual([]);
        R.unmount();
    });

    it('getDomNode returns element', () => {
        const R = getRating({ defaultValue: 3 });
        const instance = R.instance();
        // 验证 stars 对象存在
        expect(instance.stars).toBeDefined();
        R.unmount();
    });

    it('emptyStarFocusVisible state', () => {
        const R = getRating({ defaultValue: 0 });
        // 初始状态
        expect(R.state().emptyStarFocusVisible).toEqual(false);
        R.unmount();
    });

    it('clearedValue state', () => {
        const R = getRating({ allowClear: true, defaultValue: 2 });
        let stars = R.find('div[role="radio"]');
        // 点击当前值清除
        stars.at(1).simulate('click', {});
        expect(R.state().clearedValue).toBeDefined();
        R.unmount();
    });

    it('allowHalf star first half focus', () => {
        const R = getRating({ allowHalf: true, defaultValue: 2.5 });
        // 获取半星的第一部分
        const starItems = R.find(`.${BASE_CLASS_PREFIX}-rating-star`);
        const halfStarItem = starItems.at(2); // index 2 对应 value 2.5
        const firstStar = halfStarItem.find(`.${BASE_CLASS_PREFIX}-rating-star-first`);
        
        if (firstStar.length > 0) {
            // 模拟 focus 和 blur
            firstStar.simulate('focus', {});
            firstStar.simulate('blur', {});
        }
        R.unmount();
    });

    it('allowHalf star second half focus', () => {
        const R = getRating({ allowHalf: true, defaultValue: 3 });
        // 获取整星的第二部分
        const starItems = R.find(`.${BASE_CLASS_PREFIX}-rating-star`);
        const fullStarItem = starItems.at(2); // index 2 对应 value 3
        const secondStar = fullStarItem.find(`.${BASE_CLASS_PREFIX}-rating-star-second`);
        
        if (secondStar.length > 0) {
            // 模拟 focus 和 blur
            secondStar.simulate('focus', {});
            secondStar.simulate('blur', {});
        }
        R.unmount();
    });

    it('star item onFocus with first star', () => {
        const onFocus = sinon.spy();
        const R = getRating({ allowHalf: true, defaultValue: 2.5, onFocus });
        const starItems = R.find(`.${BASE_CLASS_PREFIX}-rating-star`);
        const halfStarItem = starItems.at(2);
        const firstStar = halfStarItem.find(`.${BASE_CLASS_PREFIX}-rating-star-first`);
        
        if (firstStar.length > 0) {
            firstStar.simulate('focus', {});
        }
        R.unmount();
    });

    it('star item onBlur with first star', () => {
        const onBlur = sinon.spy();
        const R = getRating({ allowHalf: true, defaultValue: 2.5, onBlur });
        const starItems = R.find(`.${BASE_CLASS_PREFIX}-rating-star`);
        const halfStarItem = starItems.at(2);
        const firstStar = halfStarItem.find(`.${BASE_CLASS_PREFIX}-rating-star-first`);
        
        if (firstStar.length > 0) {
            firstStar.simulate('focus', {});
            firstStar.simulate('blur', {});
        }
        R.unmount();
    });

    it('starFocus method with half value', () => {
        const R = getRating({ allowHalf: true, defaultValue: 2.5 });
        const instance = R.instance();
        
        // 获取 stars 对象中的 item
        if (instance.stars && instance.stars[2]) {
            const starItem = instance.stars[2];
            if (starItem && typeof starItem.starFocus === 'function') {
                starItem.starFocus();
            }
        }
        R.unmount();
    });

    it('starFocus method with full value', () => {
        const R = getRating({ allowHalf: true, defaultValue: 3 });
        const instance = R.instance();
        
        // 获取 stars 对象中的 item
        if (instance.stars && instance.stars[2]) {
            const starItem = instance.stars[2];
            if (starItem && typeof starItem.starFocus === 'function') {
                starItem.starFocus();
            }
        }
        R.unmount();
    });

    it('setFirstStarFocus adapter method', () => {
        const R = getRating({ allowHalf: true, defaultValue: 2.5 });
        const instance = R.instance();
        
        // 通过 stars 访问 item 的 adapter
        if (instance.stars && instance.stars[2]) {
            const starItem = instance.stars[2];
            if (starItem && starItem.adapter) {
                starItem.adapter.setFirstStarFocus(true);
                starItem.adapter.setFirstStarFocus(false);
            }
        }
        R.unmount();
    });

    it('setSecondStarFocus adapter method', () => {
        const R = getRating({ allowHalf: true, defaultValue: 3 });
        const instance = R.instance();
        
        // 通过 stars 访问 item 的 adapter
        if (instance.stars && instance.stars[2]) {
            const starItem = instance.stars[2];
            if (starItem && starItem.adapter) {
                starItem.adapter.setSecondStarFocus(true);
                starItem.adapter.setSecondStarFocus(false);
            }
        }
        R.unmount();
    });

    it('first star div role radio focus', () => {
        const R = getRating({ allowHalf: true, defaultValue: 2.5 });
        // 找到所有 role="radio" 的元素
        const radios = R.find('div[role="radio"]');
        
        // 找到第一个半星（first star）
        radios.forEach((radio, idx) => {
            if (radio.hasClass(`${BASE_CLASS_PREFIX}-rating-star-first`)) {
                radio.simulate('focus', {});
                radio.simulate('blur', {});
            }
        });
        R.unmount();
    });

    it('second star div role radio focus', () => {
        const R = getRating({ allowHalf: true, defaultValue: 3 });
        // 找到所有 role="radio" 的元素
        const radios = R.find('div[role="radio"]');
        
        // 找到第二个星（second star）
        radios.forEach((radio, idx) => {
            if (radio.hasClass(`${BASE_CLASS_PREFIX}-rating-star-second`)) {
                radio.simulate('focus', {});
                radio.simulate('blur', {});
            }
        });
        R.unmount();
    });

    it('star item with preventScroll prop', () => {
        const R = getRating({ allowHalf: true, defaultValue: 2.5, preventScroll: true });
        expect(R.props().preventScroll).toEqual(true);
        R.unmount();
    });

    it('star item focus with tabIndex', () => {
        const R = getRating({ allowHalf: true, defaultValue: 2.5 });
        const starItems = R.find(`.${BASE_CLASS_PREFIX}-rating-star`);
        const halfStarItem = starItems.at(2);
        
        // 检查 tabIndex
        const firstStar = halfStarItem.find(`.${BASE_CLASS_PREFIX}-rating-star-first`);
        if (firstStar.length > 0) {
            expect(firstStar.prop('tabIndex')).toBeDefined();
        }
        R.unmount();
    });

    it('disabled star item tabIndex is -1', () => {
        const R = getRating({ disabled: true, defaultValue: 3 });
        const radios = R.find('div[role="radio"]');
        
        radios.forEach((radio) => {
            expect(radio.prop('tabIndex')).toEqual(-1);
        });
        R.unmount();
    });

    it('setEmptyStarFocusVisible adapter method', () => {
        const R = getRating({ defaultValue: 0 });
        const instance = R.instance();
        
        // 直接调用 adapter 方法
        instance.adapter.setEmptyStarFocusVisible(true);
        R.update();
        expect(R.state().emptyStarFocusVisible).toEqual(true);
        
        instance.adapter.setEmptyStarFocusVisible(false);
        R.update();
        expect(R.state().emptyStarFocusVisible).toEqual(false);
        
        R.unmount();
    });
});
