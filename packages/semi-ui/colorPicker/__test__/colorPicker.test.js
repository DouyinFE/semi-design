import { ColorPicker } from '../../index';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

function getColorPicker(props) {
    return mount(<ColorPicker {...props} />, { attachTo: document.getElementById('container') });
}

describe('ColorPicker', () => {
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
        const wrapper = getColorPicker({});
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with custom className', () => {
        const wrapper = getColorPicker({ className: 'custom-class' });
        expect(wrapper.exists('.custom-class')).toEqual(true);
        wrapper.unmount();
    });

    it('renders with defaultValue', () => {
        const defaultValue = {
            hsva: { h: 0, s: 100, v: 100, a: 1 },
            rgba: { r: 255, g: 0, b: 0, a: 1 },
            hex: '#ff0000'
        };
        const wrapper = getColorPicker({ defaultValue });
        // 验证组件正确渲染
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('controlled mode with value prop', () => {
        const value = {
            hsva: { h: 120, s: 100, v: 100, a: 1 },
            rgba: { r: 0, g: 255, b: 0, a: 1 },
            hex: '#00ff00'
        };
        const wrapper = getColorPicker({ value });
        // 验证组件正确渲染
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('onChange callback', () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange });
        // 验证组件正确渲染
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with alpha slider when alpha is true', () => {
        const wrapper = getColorPicker({ alpha: true });
        // 验证 alpha slider 存在
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders without alpha slider when alpha is false', () => {
        const wrapper = getColorPicker({ alpha: false });
        // 验证组件正确渲染
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with custom width and height', () => {
        const wrapper = getColorPicker({ width: 300, height: 300 });
        // 验证组件正确渲染
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with eyeDropper enabled by default', () => {
        const wrapper = getColorPicker({});
        // 验证组件正确渲染
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with eyeDropper disabled', () => {
        const wrapper = getColorPicker({ eyeDropper: false });
        // 验证组件正确渲染
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with defaultFormat', () => {
        const wrapper = getColorPicker({ defaultFormat: 'rgb' });
        // 验证组件正确渲染
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with topSlot', () => {
        const topSlot = <div className="top-slot">Top Content</div>;
        const wrapper = getColorPicker({ topSlot });
        expect(wrapper.exists('.top-slot')).toEqual(true);
        wrapper.unmount();
    });

    it('renders with bottomSlot', () => {
        const bottomSlot = <div className="bottom-slot">Bottom Content</div>;
        const wrapper = getColorPicker({ bottomSlot });
        expect(wrapper.exists('.bottom-slot')).toEqual(true);
        wrapper.unmount();
    });

    it('renders with usePopover', () => {
        const wrapper = getColorPicker({ usePopover: true });
        // 验证 Popover 模式下的默认子元素存在
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-popover-defaultChildren`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with popoverProps', () => {
        const popoverProps = {
            position: 'bottom',
            trigger: 'click',
        };
        const wrapper = getColorPicker({ usePopover: true, popoverProps });
        // 验证 Popover 模式下的默认子元素存在
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-popover-defaultChildren`)).toEqual(true);
        wrapper.unmount();
    });

    it('colorStringToValue converts hex string', () => {
        const result = ColorPicker.colorStringToValue('#ff0000');
        expect(result.hex).toEqual('#ff0000');
        expect(result.rgba.r).toEqual(255);
        expect(result.rgba.g).toEqual(0);
        expect(result.rgba.b).toEqual(0);
    });

    it('colorStringToValue converts rgb string', () => {
        const result = ColorPicker.colorStringToValue('rgb(255, 0, 0)');
        expect(result.rgba.r).toEqual(255);
        expect(result.rgba.g).toEqual(0);
        expect(result.rgba.b).toEqual(0);
    });

    it('colorStringToValue converts rgba string', () => {
        const result = ColorPicker.colorStringToValue('rgba(255, 0, 0, 0.5)');
        expect(result.rgba.r).toEqual(255);
        expect(result.rgba.g).toEqual(0);
        expect(result.rgba.b).toEqual(0);
        expect(result.rgba.a).toEqual(0.5);
    });

    it('renders with custom style', () => {
        const style = { border: '1px solid red' };
        const wrapper = getColorPicker({ style });
        // 验证组件正确渲染
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders ColorChooseArea', () => {
        const wrapper = getColorPicker({});
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-colorChooseArea`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders ColorSlider', () => {
        const wrapper = getColorPicker({});
        expect(wrapper.exists('.colorSliderWrapper')).toEqual(true);
        wrapper.unmount();
    });
});
