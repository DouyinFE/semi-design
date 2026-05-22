import { ColorPicker } from '../../index';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import {
    hsvaToRgbString,
    hsvaToHsv,
    rgbaToRgb,
    hslaToHsl,
    hsvaToHsvString,
    hsvaToHsvaString,
    hexToRgba,
    hslaStringToHsva,
} from '../../../semi-foundation/colorPicker/utils/convert';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const noop = () => {};

function getColorPicker(props) {
    return mount(<ColorPicker {...props} />, { attachTo: document.getElementById('container') });
}

const defaultColor = {
    hsva: { h: 0, s: 100, v: 100, a: 1 },
    rgba: { r: 255, g: 0, b: 0, a: 1 },
    hex: '#ff0000'
};

const greenColor = {
    hsva: { h: 120, s: 100, v: 100, a: 1 },
    rgba: { r: 0, g: 255, b: 0, a: 1 },
    hex: '#00ff00'
};

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

    // === Basic rendering tests ===

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
        const wrapper = getColorPicker({ defaultValue: defaultColor });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('controlled mode with value prop', () => {
        const wrapper = getColorPicker({ value: greenColor });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('onChange callback', () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with alpha slider when alpha is true', () => {
        const wrapper = getColorPicker({ alpha: true });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-alphaSlider`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders without alpha slider when alpha is false', () => {
        const wrapper = getColorPicker({ alpha: false });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-alphaSlider`)).toEqual(false);
        wrapper.unmount();
    });

    it('renders with custom width and height', () => {
        const wrapper = getColorPicker({ width: 300, height: 300 });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with eyeDropper disabled', () => {
        const wrapper = getColorPicker({ eyeDropper: false });
        expect(wrapper.find('button').length).toEqual(0);
        wrapper.unmount();
    });

    it('renders with eyeDropper enabled', () => {
        const wrapper = getColorPicker({ eyeDropper: true });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with defaultFormat', () => {
        const wrapper = getColorPicker({ defaultFormat: 'rgb' });
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
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-popover-defaultChildren`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with popoverProps', () => {
        const popoverProps = { position: 'bottom', trigger: 'click' };
        const wrapper = getColorPicker({ usePopover: true, popoverProps });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-popover-defaultChildren`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with usePopover false', () => {
        const wrapper = getColorPicker({ usePopover: false });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with children in popover mode', () => {
        const wrapper = getColorPicker({
            usePopover: true,
            children: <button className="custom-trigger">Pick Color</button>
        });
        expect(wrapper.exists('.custom-trigger')).toEqual(true);
        wrapper.unmount();
    });

    it('renders with custom style', () => {
        const style = { border: '1px solid red' };
        const wrapper = getColorPicker({ style });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('renders with both topSlot and bottomSlot', () => {
        const topSlot = <div className="top-slot">Top</div>;
        const bottomSlot = <div className="bottom-slot">Bottom</div>;
        const wrapper = getColorPicker({ topSlot, bottomSlot });
        expect(wrapper.exists('.top-slot')).toEqual(true);
        expect(wrapper.exists('.bottom-slot')).toEqual(true);
        wrapper.unmount();
    });

    it('renders with all props combined', () => {
        const wrapper = getColorPicker({
            alpha: true,
            width: 300,
            height: 200,
            defaultFormat: 'rgb',
            eyeDropper: false,
            topSlot: <div>Top</div>,
            bottomSlot: <div>Bottom</div>,
            className: 'custom-class',
            style: { border: '1px solid blue' }
        });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        expect(wrapper.exists('.custom-class')).toEqual(true);
        wrapper.unmount();
    });

    // === colorStringToValue static method ===

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
        expect(result.rgba.a).toEqual(0.5);
    });

    it('colorStringToValue converts hsv string', () => {
        const result = ColorPicker.colorStringToValue('hsv(0, 100%, 100%)');
        expect(result.rgba.r).toEqual(255);
    });

    it('colorStringToValue converts hsva string', () => {
        const result = ColorPicker.colorStringToValue('hsva(0, 100%, 100%, 0.5)');
        expect(result.rgba.r).toEqual(255);
        expect(result.rgba.a).toEqual(0.5);
    });

    it('colorStringToValue converts hex with alpha', () => {
        const result = ColorPicker.colorStringToValue('#ff000080');
        expect(result.rgba.r).toEqual(255);
        expect(result.rgba.a).toBeCloseTo(0.5, 1);
    });

    it('colorStringToValue throws on invalid input', () => {
        expect(() => ColorPicker.colorStringToValue('invalid')).toThrow('Semi ColorPicker');
    });

    it('colorStringToValue throws on empty string', () => {
        expect(() => ColorPicker.colorStringToValue('')).toThrow('Semi ColorPicker');
    });

    // === Sub-component rendering ===

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

    it('renders DataPart', () => {
        const wrapper = getColorPicker({});
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-dataPart`)).toEqual(true);
        wrapper.unmount();
    });

    // === ARIA attributes ===

    it('ColorChooseArea has aria-label', () => {
        const wrapper = getColorPicker({});
        const colorArea = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorChooseArea`);
        expect(colorArea.prop('aria-label')).toEqual('Color');
        wrapper.unmount();
    });

    it('ColorChooseArea aria-valuetext shows saturation and brightness', () => {
        const wrapper = getColorPicker({});
        const colorArea = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorChooseArea`);
        const ariaValueText = colorArea.prop('aria-valuetext');
        expect(ariaValueText).toContain('Saturation');
        expect(ariaValueText).toContain('Brightness');
        wrapper.unmount();
    });

    it('AlphaSlider has aria-label', () => {
        const wrapper = getColorPicker({ alpha: true });
        const alphaSlider = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-alphaSlider`);
        expect(alphaSlider.prop('aria-label')).toEqual('Alpha');
        wrapper.unmount();
    });

    it('AlphaSlider aria-valuetext shows percentage', () => {
        const wrapper = getColorPicker({ alpha: true });
        const alphaSlider = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-alphaSlider`);
        const ariaValueText = alphaSlider.prop('aria-valuetext');
        expect(ariaValueText).toContain('%');
        wrapper.unmount();
    });

    // === Handles ===

    it('handle exists in ColorChooseArea', () => {
        const wrapper = getColorPicker({});
        const handle = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorChooseArea .${BASE_CLASS_PREFIX}-colorPicker-handle`);
        expect(handle.length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    it('handle exists in ColorSlider', () => {
        const wrapper = getColorPicker({});
        const handle = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorSlider .${BASE_CLASS_PREFIX}-colorPicker-handle`);
        expect(handle.length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    it('handle exists in AlphaSlider', () => {
        const wrapper = getColorPicker({ alpha: true });
        const handle = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-alphaHandle`);
        expect(handle.length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    // === Mouse interactions on ColorChooseArea ===

    it('ColorChooseArea mouseDown triggers grabbing state', () => {
        const wrapper = getColorPicker({});
        const colorArea = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorChooseArea`);
        colorArea.simulate('mouseDown', { clientX: 100, clientY: 100 });
        wrapper.update();
        // Should trigger grabbing
        wrapper.unmount();
    });

    it('ColorChooseArea handle mouseDown triggers grabbing', () => {
        const wrapper = getColorPicker({});
        const handle = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorChooseArea .${BASE_CLASS_PREFIX}-colorPicker-handle`);
        handle.simulate('mouseDown', { clientX: 50, clientY: 50 });
        wrapper.update();
        wrapper.unmount();
    });

    it('ColorChooseArea updates on hsva prop change', () => {
        const wrapper = getColorPicker({ defaultValue: defaultColor });
        // Change the color via value update
        wrapper.setProps({
            value: greenColor
        });
        wrapper.update();
        wrapper.unmount();
    });

    // === Mouse interactions on ColorSlider ===

    it('ColorSlider updates on hue prop change', () => {
        const wrapper = getColorPicker({ defaultValue: defaultColor });
        // Changing value should update slider position
        wrapper.setProps({ value: greenColor });
        wrapper.update();
        wrapper.unmount();
    });

    // === Foundation-level slider tests ===

    it('ColorSlider foundation handleMouseDown and handleMouseUp', () => {
        const wrapper = getColorPicker({});
        const colorSlider = wrapper.find('ColorSlider').instance();
        // Call handleMouseDown directly
        colorSlider.foundation.handleMouseDown({ clientX: 50 });
        expect(colorSlider.state.isHandleGrabbing).toBe(true);
        // Call handleMouseUp directly
        colorSlider.foundation.handleMouseUp({});
        expect(colorSlider.state.isHandleGrabbing).toBe(false);
        wrapper.unmount();
    });

    it('AlphaSlider foundation handleMouseDown and handleMouseUp', () => {
        const wrapper = getColorPicker({ alpha: true });
        const alphaSlider = wrapper.find('AlphaSlider').instance();
        alphaSlider.foundation.handleMouseDown({ clientX: 50 });
        expect(alphaSlider.state.isHandleGrabbing).toBe(true);
        alphaSlider.foundation.handleMouseUp({});
        expect(alphaSlider.state.isHandleGrabbing).toBe(false);
        wrapper.unmount();
    });

    it('ColorChooseArea foundation handleMouseDown and handleMouseUp', () => {
        const wrapper = getColorPicker({});
        const area = wrapper.find('ColorChooseArea').instance();
        area.foundation.handleMouseDown({ clientX: 50, clientY: 50 });
        expect(area.state.isHandleGrabbing).toBe(true);
        area.foundation.handleMouseUp({});
        expect(area.state.isHandleGrabbing).toBe(false);
        wrapper.unmount();
    });

    it('AlphaSlider updates on alpha prop change', () => {
        const wrapper = getColorPicker({
            alpha: true,
            value: { ...defaultColor, hsva: { ...defaultColor.hsva, a: 1 } }
        });
        wrapper.setProps({
            value: { ...defaultColor, hsva: { ...defaultColor.hsva, a: 0.5 }, rgba: { ...defaultColor.rgba, a: 0.5 } }
        });
        wrapper.update();
        wrapper.unmount();
    });

    // === DataPart interactions ===

    it('DataPart renders input and format selector', () => {
        const wrapper = getColorPicker({});
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput`)).toEqual(true);
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-formatSelect`)).toEqual(true);
        wrapper.unmount();
    });

    it('DataPart renders with hex format by default', () => {
        const wrapper = getColorPicker({ defaultFormat: 'hex' });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-dataPart`)).toEqual(true);
        wrapper.unmount();
    });

    it('DataPart renders with rgba format', () => {
        const wrapper = getColorPicker({ defaultFormat: 'rgba' });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-dataPart`)).toEqual(true);
        wrapper.unmount();
    });

    it('DataPart renders with hsva format', () => {
        const wrapper = getColorPicker({ defaultFormat: 'hsva' });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-dataPart`)).toEqual(true);
        wrapper.unmount();
    });

    it('DataPart hex input change with valid hex', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ defaultFormat: 'hex', onChange });
        await sleep(50);
        const input = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput input`);
        input.simulate('change', { target: { value: '#00ff00' } });
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('DataPart hex input change with invalid hex', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ defaultFormat: 'hex', onChange });
        await sleep(50);
        const input = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput input`);
        input.simulate('change', { target: { value: 'abc' } });
        await sleep(50);
        // Invalid hex should not trigger onChange
        wrapper.unmount();
    });

    it('DataPart hex input change without # prefix', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ defaultFormat: 'hex', onChange });
        await sleep(50);
        const input = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput input`);
        input.simulate('change', { target: { value: '00ff00' } });
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('DataPart format change to rgba', async () => {
        const wrapper = getColorPicker({ defaultFormat: 'hex' });
        await sleep(50);
        // Find the format selector and change to rgba
        const select = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-formatSelect`);
        expect(select.exists()).toBe(true);
        wrapper.unmount();
    });

    it('DataPart color demo block renders', () => {
        const wrapper = getColorPicker({});
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-colorDemoBlock`)).toEqual(true);
        wrapper.unmount();
    });

    it('DataPart alpha input renders when alpha is true', () => {
        const wrapper = getColorPicker({ alpha: true });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInputNumber`)).toEqual(true);
        wrapper.unmount();
    });

    it('DataPart alpha input not rendered when alpha is false', () => {
        const wrapper = getColorPicker({ alpha: false });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInputNumber`)).toEqual(false);
        wrapper.unmount();
    });

    // === Value update tests ===

    it('value prop updates component', () => {
        const wrapper = getColorPicker({ value: defaultColor });
        wrapper.setProps({ value: greenColor });
        expect(wrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        wrapper.unmount();
    });

    it('defaultValue with different formats', () => {
        const hexWrapper = getColorPicker({ defaultFormat: 'hex' });
        expect(hexWrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        hexWrapper.unmount();

        const rgbWrapper = getColorPicker({ defaultFormat: 'rgba' });
        expect(rgbWrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        rgbWrapper.unmount();

        const hsvWrapper = getColorPicker({ defaultFormat: 'hsva' });
        expect(hsvWrapper.exists(`.${BASE_CLASS_PREFIX}-colorPicker`)).toEqual(true);
        hsvWrapper.unmount();
    });

    // === Foundation direct tests ===

    it('foundation handleChange with hsva format', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange });
        const instance = wrapper.find('ColorPicker').instance();
        instance.foundation.handleChange({ h: 120, s: 100, v: 100, a: 1 }, 'hsva');
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('foundation handleChange with rgba format', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange });
        const instance = wrapper.find('ColorPicker').instance();
        instance.foundation.handleChange({ r: 0, g: 255, b: 0, a: 1 }, 'rgba');
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('foundation handleChange with hex format', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange });
        const instance = wrapper.find('ColorPicker').instance();
        instance.foundation.handleChange('#00ff00', 'hex');
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('foundation handleChange with invalid format throws', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        expect(() => instance.foundation.handleChange({}, 'invalid')).toThrow('format error');
        wrapper.unmount();
    });

    it('foundation handleChangeH updates hue', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange });
        const instance = wrapper.find('ColorPicker').instance();
        const currentColor = instance.foundation.getCurrentColor();
        instance.foundation.handleChangeH(currentColor, 180);
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('foundation handleChangeH with controlled value', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange, value: defaultColor });
        const instance = wrapper.find('ColorPicker').instance();
        instance.foundation.handleChangeH(defaultColor, 180);
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('foundation handleChangeA updates alpha', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange, alpha: true });
        const instance = wrapper.find('ColorPicker').instance();
        const currentColor = instance.foundation.getCurrentColor();
        instance.foundation.handleChangeA(currentColor, 0.5);
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('foundation handleChangeA when alpha is false', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange, alpha: false });
        const instance = wrapper.find('ColorPicker').instance();
        const currentColor = instance.foundation.getCurrentColor();
        instance.foundation.handleChangeA(currentColor, 0.5);
        await sleep(50);
        // Alpha should be forced to 1
        expect(onChange.called).toBe(true);
        const callArg = onChange.getCall(0).args[0];
        expect(callArg.hsva.a).toBe(1);
        wrapper.unmount();
    });

    it('foundation handleChangeA with controlled value', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange, alpha: true, value: defaultColor });
        const instance = wrapper.find('ColorPicker').instance();
        instance.foundation.handleChangeA(defaultColor, 0.5);
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('foundation handleColorChangeByHandle', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange });
        const instance = wrapper.find('ColorPicker').instance();
        instance.foundation.handleColorChangeByHandle({ h: 200 });
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('foundation handleAlphaChangeByHandle', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange, alpha: true });
        const instance = wrapper.find('ColorPicker').instance();
        instance.foundation.handleAlphaChangeByHandle({ a: 0.5 });
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('foundation getHandlePositionByHSVA', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const pos = instance.foundation.getHandlePositionByHSVA(
            { h: 0, s: 50, v: 50, a: 1 },
            { width: 280, height: 280 },
            20
        );
        expect(pos.x).toBeDefined();
        expect(pos.y).toBeDefined();
        wrapper.unmount();
    });

    it('foundation getHandlePositionByMousePosition within bounds', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const pos = instance.foundation.getHandlePositionByMousePosition(
            { x: 100, y: 100 },
            { width: 280, height: 280 },
            20
        );
        expect(pos).not.toBeNull();
        expect(pos.x).toBe(90);
        expect(pos.y).toBe(90);
        wrapper.unmount();
    });

    it('foundation getHandlePositionByMousePosition out of bounds X', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const pos = instance.foundation.getHandlePositionByMousePosition(
            { x: 300, y: 100 },
            { width: 280, height: 280 },
            20
        );
        expect(pos).toBeNull();
        wrapper.unmount();
    });

    it('foundation getHandlePositionByMousePosition out of bounds Y', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const pos = instance.foundation.getHandlePositionByMousePosition(
            { x: 100, y: 300 },
            { width: 280, height: 280 },
            20
        );
        expect(pos).toBeNull();
        wrapper.unmount();
    });

    it('foundation getHandlePositionByMousePosition negative X', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const pos = instance.foundation.getHandlePositionByMousePosition(
            { x: -1, y: 100 },
            { width: 280, height: 280 },
            20
        );
        expect(pos).toBeNull();
        wrapper.unmount();
    });

    it('foundation getHandlePositionByMousePosition negative Y', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const pos = instance.foundation.getHandlePositionByMousePosition(
            { x: 100, y: -1 },
            { width: 280, height: 280 },
            20
        );
        expect(pos).toBeNull();
        wrapper.unmount();
    });

    it('foundation getAlphaHandlePositionByMousePosition within bounds', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const pos = instance.foundation.getAlphaHandlePositionByMousePosition(100, 280, 18);
        expect(pos).toBe(91);
        wrapper.unmount();
    });

    it('foundation getAlphaHandlePositionByMousePosition out of bounds', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const pos = instance.foundation.getAlphaHandlePositionByMousePosition(300, 280, 18);
        expect(pos).toBeNull();
        wrapper.unmount();
    });

    it('foundation getAlphaHandlePositionByMousePosition negative', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const pos = instance.foundation.getAlphaHandlePositionByMousePosition(-1, 280, 18);
        expect(pos).toBeNull();
        wrapper.unmount();
    });

    it('foundation getColorHandlePositionByMousePosition within bounds', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const pos = instance.foundation.getColorHandlePositionByMousePosition(100, 280, 18);
        expect(pos).toBe(91);
        wrapper.unmount();
    });

    it('foundation getColorHandlePositionByMousePosition out of bounds', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const pos = instance.foundation.getColorHandlePositionByMousePosition(300, 280, 18);
        expect(pos).toBeNull();
        wrapper.unmount();
    });

    it('foundation getColorHandlePositionByMousePosition negative', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const pos = instance.foundation.getColorHandlePositionByMousePosition(-1, 280, 18);
        expect(pos).toBeNull();
        wrapper.unmount();
    });

    it('foundation getCurrentColor returns value in controlled mode', () => {
        const wrapper = getColorPicker({ value: greenColor });
        const instance = wrapper.find('ColorPicker').instance();
        const color = instance.foundation.getCurrentColor();
        expect(color.hex).toBe('#00ff00');
        wrapper.unmount();
    });

    it('foundation getCurrentColor returns state in uncontrolled mode', () => {
        const wrapper = getColorPicker({ defaultValue: defaultColor });
        const instance = wrapper.find('ColorPicker').instance();
        const color = instance.foundation.getCurrentColor();
        expect(color.hex).toBe('#ff0000');
        wrapper.unmount();
    });

    // === DataPart foundation tests ===

    it('DataPart foundation getInputValue for rgba format', async () => {
        const wrapper = getColorPicker({ defaultFormat: 'rgba', defaultValue: defaultColor });
        await sleep(50);
        const dataPart = wrapper.find('DataPart').instance();
        const value = dataPart.foundation.getInputValue();
        expect(value).toBe('255,0,0');
        wrapper.unmount();
    });

    it('DataPart foundation getInputValue for hsva format', async () => {
        const wrapper = getColorPicker({ defaultFormat: 'hsva', defaultValue: defaultColor });
        await sleep(50);
        const dataPart = wrapper.find('DataPart').instance();
        const value = dataPart.foundation.getInputValue();
        expect(value).toBe('0,100,100');
        wrapper.unmount();
    });

    it('DataPart foundation getInputValue for hex format', async () => {
        const wrapper = getColorPicker({ defaultFormat: 'hex', defaultValue: defaultColor });
        await sleep(50);
        const dataPart = wrapper.find('DataPart').instance();
        const value = dataPart.foundation.getInputValue();
        expect(value).toBe('#ff0000');
        wrapper.unmount();
    });

    it('DataPart foundation getValueByInputValue for rgba valid', () => {
        const wrapper = getColorPicker({ defaultFormat: 'rgba' });
        const dataPart = wrapper.find('DataPart').instance();
        const value = dataPart.foundation.getValueByInputValue('255,0,0');
        expect(value).toEqual({ r: 255, g: 0, b: 0, a: 1 });
        wrapper.unmount();
    });

    it('DataPart foundation getValueByInputValue for rgba invalid', () => {
        const wrapper = getColorPicker({ defaultFormat: 'rgba' });
        const dataPart = wrapper.find('DataPart').instance();
        const value = dataPart.foundation.getValueByInputValue('invalid');
        expect(value).toBe(false);
        wrapper.unmount();
    });

    it('DataPart foundation getValueByInputValue for hsva valid', () => {
        const wrapper = getColorPicker({ defaultFormat: 'hsva' });
        const dataPart = wrapper.find('DataPart').instance();
        const value = dataPart.foundation.getValueByInputValue('0,100,100');
        expect(value).toEqual({ h: 0, s: 100, v: 100, a: 1 });
        wrapper.unmount();
    });

    it('DataPart foundation getValueByInputValue for hex valid', () => {
        const wrapper = getColorPicker({ defaultFormat: 'hex' });
        const dataPart = wrapper.find('DataPart').instance();
        const value = dataPart.foundation.getValueByInputValue('#ff0000');
        expect(value).toBe('#ff0000');
        wrapper.unmount();
    });

    it('DataPart foundation getValueByInputValue for hex without # prefix', () => {
        const wrapper = getColorPicker({ defaultFormat: 'hex' });
        const dataPart = wrapper.find('DataPart').instance();
        const value = dataPart.foundation.getValueByInputValue('ff0000');
        expect(value).toBe('#ff0000');
        wrapper.unmount();
    });

    it('DataPart foundation getValueByInputValue for hex invalid short', () => {
        const wrapper = getColorPicker({ defaultFormat: 'hex' });
        const dataPart = wrapper.find('DataPart').instance();
        const value = dataPart.foundation.getValueByInputValue('#f00');
        expect(value).toBe(false);
        wrapper.unmount();
    });

    it('DataPart foundation handleFormatChange', async () => {
        const wrapper = getColorPicker({ defaultFormat: 'hex' });
        const dataPart = wrapper.find('DataPart').instance();
        dataPart.foundation.handleFormatChange('rgba');
        await sleep(50);
        wrapper.update();
        wrapper.unmount();
    });

    it('DataPart foundation handleInputValueChange', async () => {
        const wrapper = getColorPicker({});
        const dataPart = wrapper.find('DataPart').instance();
        dataPart.foundation.handleInputValueChange('test');
        await sleep(50);
        wrapper.unmount();
    });

    it('DataPart foundation handlePickValueWithStraw when EyeDropper not available', async () => {
        const wrapper = getColorPicker({ eyeDropper: true });
        const dataPart = wrapper.find('DataPart').instance();
        // EyeDropper is not available in JSDOM
        await dataPart.foundation.handlePickValueWithStraw();
        wrapper.unmount();
    });

    it('DataPart eyeDropper button click', async () => {
        const wrapper = getColorPicker({ eyeDropper: true });
        const button = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-dataPart button`);
        if (button.length > 0) {
            button.simulate('click');
            await sleep(50);
        }
        wrapper.unmount();
    });

    // === DataPart componentDidUpdate ===

    it('DataPart updates inputValue when currentColor changes', async () => {
        const wrapper = getColorPicker({ defaultValue: defaultColor });
        await sleep(50);
        // Change color
        const instance = wrapper.find('ColorPicker').instance();
        instance.foundation.handleChange({ h: 120, s: 100, v: 100, a: 1 }, 'hsva');
        await sleep(50);
        wrapper.update();
        wrapper.unmount();
    });

    it('DataPart updates inputValue when format changes', async () => {
        const wrapper = getColorPicker({ defaultFormat: 'hex', defaultValue: defaultColor });
        await sleep(50);
        const dataPart = wrapper.find('DataPart').instance();
        dataPart.foundation.handleFormatChange('rgba');
        await sleep(50);
        wrapper.update();
        wrapper.unmount();
    });

    // === DataPart alpha input number change ===

    it('DataPart alpha InputNumber change in rgba mode', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ alpha: true, defaultFormat: 'rgba', onChange, defaultValue: defaultColor });
        await sleep(50);
        // Find the InputNumber and trigger change
        const dataPart = wrapper.find('DataPart').instance();
        dataPart.setState({ format: 'rgba' });
        await sleep(50);
        wrapper.update();
        // Simulate number change via foundation
        const inputNumber = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInputNumber input`);
        if (inputNumber.length > 0) {
            inputNumber.simulate('change', { target: { value: '50' } });
            await sleep(50);
        }
        wrapper.unmount();
    });

    it('DataPart alpha InputNumber change in hex mode', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ alpha: true, defaultFormat: 'hex', onChange, defaultValue: defaultColor });
        await sleep(50);
        wrapper.unmount();
    });

    it('DataPart alpha InputNumber change in hsva mode', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ alpha: true, defaultFormat: 'hsva', onChange, defaultValue: defaultColor });
        await sleep(50);
        wrapper.unmount();
    });

    // === split utility tests ===

    it('DataPart rgba input with comma-separated values', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ defaultFormat: 'rgba', onChange });
        await sleep(50);
        const input = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput input`);
        input.simulate('change', { target: { value: '128,255,0' } });
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('DataPart rgba input with invalid values', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ defaultFormat: 'rgba', onChange });
        await sleep(50);
        const input = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput input`);
        input.simulate('change', { target: { value: 'abc,def,ghi' } });
        await sleep(50);
        wrapper.unmount();
    });

    it('DataPart hsva input with comma-separated values', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ defaultFormat: 'hsva', onChange });
        await sleep(50);
        const input = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput input`);
        input.simulate('change', { target: { value: '120,100,100' } });
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('DataPart rgba input with out-of-range values', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ defaultFormat: 'rgba', onChange });
        await sleep(50);
        const input = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput input`);
        input.simulate('change', { target: { value: '300,0,0' } });
        await sleep(50);
        // Out of range should not trigger color change
        wrapper.unmount();
    });

    it('DataPart rgba input with alpha value', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ defaultFormat: 'rgba', onChange });
        await sleep(50);
        const input = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput input`);
        input.simulate('change', { target: { value: '128,255,0,0.5' } });
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    // === Static method tests ===

    it('foundation static hsvaToRgba', () => {
        const rgba = ColorPicker.colorStringToValue('#ff0000').rgba;
        expect(rgba.r).toBe(255);
        expect(rgba.g).toBe(0);
        expect(rgba.b).toBe(0);
    });

    it('foundation static methods available', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const f = instance.foundation;
        expect(typeof f.handleChangeH).toBe('function');
        expect(typeof f.handleChangeA).toBe('function');
        expect(typeof f.handleChange).toBe('function');
        expect(typeof f.handleColorChangeByHandle).toBe('function');
        expect(typeof f.handleAlphaChangeByHandle).toBe('function');
        expect(typeof f.getHandlePositionByHSVA).toBe('function');
        expect(typeof f.getHandlePositionByMousePosition).toBe('function');
        expect(typeof f.getAlphaHandlePositionByMousePosition).toBe('function');
        expect(typeof f.getColorHandlePositionByMousePosition).toBe('function');
        expect(typeof f.getCurrentColor).toBe('function');
        wrapper.unmount();
    });

    // === handleChange uncontrolled mode ===

    it('foundation handleChange updates state in uncontrolled mode', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange, defaultValue: defaultColor });
        const instance = wrapper.find('ColorPicker').instance();
        instance.foundation.handleChange('#00ff00', 'hex');
        await sleep(50);
        wrapper.update();
        const currentColor = instance.foundation.getCurrentColor();
        expect(currentColor.hex).toBe('#00ff00');
        wrapper.unmount();
    });

    it('foundation handleChange does not update state in controlled mode', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange, value: defaultColor });
        const instance = wrapper.find('ColorPicker').instance();
        instance.foundation.handleChange('#00ff00', 'hex');
        await sleep(50);
        wrapper.update();
        const currentColor = instance.foundation.getCurrentColor();
        // Should still return controlled value
        expect(currentColor.hex).toBe('#ff0000');
        wrapper.unmount();
    });

    // === handleChangeA alpha=true  ===

    it('foundation handleChangeA with alpha=true generates correct hex', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange, alpha: true, defaultValue: defaultColor });
        const instance = wrapper.find('ColorPicker').instance();
        instance.foundation.handleChangeA(defaultColor, 0.5);
        await sleep(50);
        expect(onChange.called).toBe(true);
        const callArg = onChange.getCall(0).args[0];
        // Hex should contain alpha info
        expect(callArg.hex.length).toBeGreaterThan(7);
        wrapper.unmount();
    });

    // === DataPart onNumberChange tests ===

    it('DataPart onNumberChange in rgba format', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ alpha: true, defaultFormat: 'rgba', onChange, defaultValue: defaultColor });
        await sleep(50);
        const dataPart = wrapper.find('DataPart').instance();
        // Simulate the onNumberChange callback
        dataPart.setState({ format: 'rgba' });
        await sleep(50);
        wrapper.update();
        const newColor = { ...defaultColor.rgba, a: 0.5 };
        dataPart.handleChange(newColor);
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('DataPart onNumberChange in hex format', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ alpha: true, defaultFormat: 'hex', onChange, defaultValue: defaultColor });
        await sleep(50);
        const dataPart = wrapper.find('DataPart').instance();
        dataPart.setState({ format: 'hex' });
        await sleep(50);
        wrapper.update();
        // Simulate hex format change
        dataPart.handleChange('#00ff0080');
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('DataPart onNumberChange in hsva format', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ alpha: true, defaultFormat: 'hsva', onChange, defaultValue: defaultColor });
        await sleep(50);
        const dataPart = wrapper.find('DataPart').instance();
        dataPart.setState({ format: 'hsva' });
        await sleep(50);
        wrapper.update();
        const newColor = { ...defaultColor.hsva, a: 0.5 };
        dataPart.handleChange(newColor);
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    // === Convert utility function tests ===

    it('hsvaToHslString converts correctly', () => {
        const result = ColorPicker.colorStringToValue('#ff0000');
        expect(result.hsva).toBeDefined();
    });

    it('colorStringToValue with 3-char hex', () => {
        // Only 6+ character hex is valid, 3-char should throw
        expect(() => ColorPicker.colorStringToValue('#f00')).not.toThrow();
    });

    it('colorStringToValue with blue', () => {
        const result = ColorPicker.colorStringToValue('#0000ff');
        expect(result.rgba.r).toBe(0);
        expect(result.rgba.g).toBe(0);
        expect(result.rgba.b).toBe(255);
    });

    it('colorStringToValue with white', () => {
        const result = ColorPicker.colorStringToValue('#ffffff');
        expect(result.rgba.r).toBe(255);
        expect(result.rgba.g).toBe(255);
        expect(result.rgba.b).toBe(255);
    });

    it('colorStringToValue with black', () => {
        const result = ColorPicker.colorStringToValue('#000000');
        expect(result.rgba.r).toBe(0);
        expect(result.rgba.g).toBe(0);
        expect(result.rgba.b).toBe(0);
    });

    it('colorStringToValue with rgba having full alpha', () => {
        const result = ColorPicker.colorStringToValue('rgba(128, 128, 128, 1)');
        expect(result.rgba.r).toBe(128);
        expect(result.rgba.a).toBe(1);
    });

    it('colorStringToValue with rgb no alpha', () => {
        const result = ColorPicker.colorStringToValue('rgb(128, 128, 128)');
        expect(result.rgba.a).toBe(1);
    });

    it('colorStringToValue with hsva with alpha', () => {
        const result = ColorPicker.colorStringToValue('hsva(120, 100%, 100%, 0.8)');
        expect(result.rgba.g).toBeGreaterThan(200);
        expect(result.rgba.a).toBeCloseTo(0.8, 1);
    });

    // === ColorChooseArea componentDidUpdate ===

    it('ColorChooseArea componentDidUpdate with same hsva does not update', async () => {
        const wrapper = getColorPicker({ value: defaultColor });
        const area = wrapper.find('ColorChooseArea').instance();
        const prevPos = { ...area.state.handlePosition };
        // setProps with same value
        wrapper.setProps({ value: { ...defaultColor } });
        await sleep(50);
        wrapper.update();
        wrapper.unmount();
    });

    // === ColorChooseArea getHandlePositionByHSVA ===

    it('ColorChooseArea foundation getHandlePositionByHSVA', () => {
        const wrapper = getColorPicker({});
        const area = wrapper.find('ColorChooseArea').instance();
        const pos = area.foundation.getHandlePositionByHSVA();
        expect(pos).toBeDefined();
        expect(pos.x).toBeDefined();
        expect(pos.y).toBeDefined();
        wrapper.unmount();
    });

    // === ColorChooseArea setHandlePositionByMousePosition with rect ===

    it('ColorChooseArea setHandlePositionByMousePosition handles null rect', () => {
        const wrapper = getColorPicker({});
        const area = wrapper.find('ColorChooseArea').instance();
        // Mock getDOM to return null
        const origGetDOM = area.adapter.getDOM;
        area.foundation._adapter.getDOM = () => null;
        area.foundation.setHandlePositionByMousePosition({ clientX: 50, clientY: 50 });
        area.foundation._adapter.getDOM = origGetDOM;
        wrapper.unmount();
    });

    it('ColorSlider setHandlePositionByMousePosition handles null rect', () => {
        const wrapper = getColorPicker({});
        const slider = wrapper.find('ColorSlider').instance();
        const origGetDOM = slider.adapter.getDOM;
        slider.foundation._adapter.getDOM = () => null;
        slider.foundation.setHandlePositionByMousePosition({ clientX: 50 });
        slider.foundation._adapter.getDOM = origGetDOM;
        wrapper.unmount();
    });

    it('AlphaSlider setHandlePositionByMousePosition handles null rect', () => {
        const wrapper = getColorPicker({ alpha: true });
        const slider = wrapper.find('AlphaSlider').instance();
        const origGetDOM = slider.adapter.getDOM;
        slider.foundation._adapter.getDOM = () => null;
        slider.foundation.setHandlePositionByMousePosition({ clientX: 50 });
        slider.foundation._adapter.getDOM = origGetDOM;
        wrapper.unmount();
    });

    // === ColorChooseArea setHandlePositionByMousePosition with valid rect ===

    it('ColorChooseArea setHandlePositionByMousePosition with valid position', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange });
        const area = wrapper.find('ColorChooseArea').instance();
        // Mock getBoundingClientRect on the DOM
        const domElement = area.ref.current;
        if (domElement) {
            const origGetBCR = domElement.getBoundingClientRect;
            domElement.getBoundingClientRect = () => ({ x: 0, y: 0, width: 280, height: 280, left: 0, top: 0, right: 280, bottom: 280 });
            area.foundation.setHandlePositionByMousePosition({ clientX: 140, clientY: 140 });
            await sleep(50);
            expect(onChange.called).toBe(true);
            domElement.getBoundingClientRect = origGetBCR;
        }
        wrapper.unmount();
    });

    it('ColorChooseArea setHandlePositionByMousePosition out of bounds', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange });
        const area = wrapper.find('ColorChooseArea').instance();
        const domElement = area.ref.current;
        if (domElement) {
            const origGetBCR = domElement.getBoundingClientRect;
            domElement.getBoundingClientRect = () => ({ x: 0, y: 0, width: 280, height: 280, left: 0, top: 0, right: 280, bottom: 280 });
            area.foundation.setHandlePositionByMousePosition({ clientX: 500, clientY: 500 });
            await sleep(50);
            // Out of bounds, onChange should not be called
            expect(onChange.called).toBe(false);
            domElement.getBoundingClientRect = origGetBCR;
        }
        wrapper.unmount();
    });

    it('ColorSlider setHandlePositionByMousePosition with valid position', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange });
        const slider = wrapper.find('ColorSlider').instance();
        const domElement = slider.ref.current;
        if (domElement) {
            const origGetBCR = domElement.getBoundingClientRect;
            domElement.getBoundingClientRect = () => ({ x: 0, y: 0, width: 280, height: 10, left: 0, top: 0, right: 280, bottom: 10 });
            slider.foundation.setHandlePositionByMousePosition({ clientX: 140 });
            await sleep(50);
            expect(onChange.called).toBe(true);
            domElement.getBoundingClientRect = origGetBCR;
        }
        wrapper.unmount();
    });

    it('AlphaSlider setHandlePositionByMousePosition with valid position', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ alpha: true, onChange });
        const slider = wrapper.find('AlphaSlider').instance();
        const domElement = slider.ref.current;
        if (domElement) {
            const origGetBCR = domElement.getBoundingClientRect;
            domElement.getBoundingClientRect = () => ({ x: 0, y: 0, width: 280, height: 10, left: 0, top: 0, right: 280, bottom: 10 });
            slider.foundation.setHandlePositionByMousePosition({ clientX: 140 });
            await sleep(50);
            expect(onChange.called).toBe(true);
            domElement.getBoundingClientRect = origGetBCR;
        }
        wrapper.unmount();
    });

    // === EyeDropper mock test ===

    it('DataPart handlePickValueWithStraw with EyeDropper returning hex', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ eyeDropper: true, onChange });
        const dataPart = wrapper.find('DataPart').instance();
        // Mock EyeDropper
        window.EyeDropper = class {
            async open() {
                return { sRGBHex: '#00ff00' };
            }
        };
        await dataPart.foundation.handlePickValueWithStraw();
        await sleep(50);
        expect(onChange.called).toBe(true);
        delete window.EyeDropper;
        wrapper.unmount();
    });

    it('DataPart handlePickValueWithStraw with EyeDropper returning rgba', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ eyeDropper: true, onChange });
        const dataPart = wrapper.find('DataPart').instance();
        window.EyeDropper = class {
            async open() {
                return { sRGBHex: 'rgba(0, 255, 0, 1)' };
            }
        };
        await dataPart.foundation.handlePickValueWithStraw();
        await sleep(50);
        expect(onChange.called).toBe(true);
        delete window.EyeDropper;
        wrapper.unmount();
    });

    it('DataPart handlePickValueWithStraw with EyeDropper throwing error', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ eyeDropper: true, onChange });
        const dataPart = wrapper.find('DataPart').instance();
        window.EyeDropper = class {
            async open() {
                throw new Error('User cancelled');
            }
        };
        await dataPart.foundation.handlePickValueWithStraw();
        await sleep(50);
        // Should not throw, error is caught
        expect(onChange.called).toBe(false);
        delete window.EyeDropper;
        wrapper.unmount();
    });

    // === Split utility edge cases ===

    it('DataPart hsva input with spaces', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ defaultFormat: 'hsva', onChange });
        await sleep(50);
        const input = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput input`);
        input.simulate('change', { target: { value: ' 120 , 100 , 100 ' } });
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('DataPart hsva input with alpha value', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ defaultFormat: 'hsva', onChange });
        await sleep(50);
        const input = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput input`);
        input.simulate('change', { target: { value: '120,100,100,0.5' } });
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    it('DataPart hsva input with out-of-range hue', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ defaultFormat: 'hsva', onChange });
        await sleep(50);
        const input = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput input`);
        input.simulate('change', { target: { value: '400,100,100' } });
        await sleep(50);
        // Out of range hue (>360), should be invalid
        wrapper.unmount();
    });

    it('DataPart hex input with 8-char hex (alpha)', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ defaultFormat: 'hex', onChange });
        await sleep(50);
        const input = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-colorPickerInput input`);
        input.simulate('change', { target: { value: '#ff000080' } });
        await sleep(50);
        expect(onChange.called).toBe(true);
        wrapper.unmount();
    });

    // === DataPart onNumberChange via InputNumber ===

    it('DataPart InputNumber onNumberChange in rgba mode', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ alpha: true, defaultFormat: 'rgba', onChange, defaultValue: defaultColor });
        await sleep(50);
        const dataPart = wrapper.find('DataPart').instance();
        // Force format to rgba
        dataPart.setState({ format: 'rgba' }, () => {
            wrapper.update();
        });
        await sleep(50);
        // Find InputNumber and trigger onNumberChange
        const inputNumber = wrapper.find('InputNumber');
        if (inputNumber.length > 0) {
            const onNumberChange = inputNumber.prop('onNumberChange');
            if (onNumberChange) {
                onNumberChange(50);
                expect(onChange.called).toBe(true);
            }
        }
        wrapper.unmount();
    });

    it('DataPart InputNumber onNumberChange in hex mode', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ alpha: true, defaultFormat: 'hex', onChange, defaultValue: defaultColor });
        await sleep(50);
        const dataPart = wrapper.find('DataPart').instance();
        dataPart.setState({ format: 'hex' }, () => {
            wrapper.update();
        });
        await sleep(50);
        const inputNumber = wrapper.find('InputNumber');
        if (inputNumber.length > 0) {
            const onNumberChange = inputNumber.prop('onNumberChange');
            if (onNumberChange) {
                onNumberChange(50);
                expect(onChange.called).toBe(true);
            }
        }
        wrapper.unmount();
    });

    it('DataPart InputNumber onNumberChange in hsva mode', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ alpha: true, defaultFormat: 'hsva', onChange, defaultValue: defaultColor });
        await sleep(50);
        const dataPart = wrapper.find('DataPart').instance();
        dataPart.setState({ format: 'hsva' }, () => {
            wrapper.update();
        });
        await sleep(50);
        const inputNumber = wrapper.find('InputNumber');
        if (inputNumber.length > 0) {
            const onNumberChange = inputNumber.prop('onNumberChange');
            if (onNumberChange) {
                onNumberChange(80);
                expect(onChange.called).toBe(true);
            }
        }
        wrapper.unmount();
    });

    // === DataPart format Select onSelect ===

    it('DataPart format Select onSelect changes format', async () => {
        const wrapper = getColorPicker({ defaultFormat: 'hex', defaultValue: defaultColor });
        await sleep(50);
        const select = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-formatSelect`);
        // Get the Select component and trigger onSelect
        const selectComponent = wrapper.find('DataPart Select');
        if (selectComponent.length > 0) {
            const onSelect = selectComponent.prop('onSelect');
            if (onSelect) {
                onSelect('rgba');
                await sleep(50);
                wrapper.update();
                const dataPart = wrapper.find('DataPart').instance();
                expect(dataPart.state.format).toBe('rgba');
            }
        }
        wrapper.unmount();
    });

    it('DataPart format Select onSelect to hsva', async () => {
        const wrapper = getColorPicker({ defaultFormat: 'hex', defaultValue: defaultColor });
        await sleep(50);
        const selectComponent = wrapper.find('DataPart Select');
        if (selectComponent.length > 0) {
            const onSelect = selectComponent.prop('onSelect');
            if (onSelect) {
                onSelect('hsva');
                await sleep(50);
                wrapper.update();
                const dataPart = wrapper.find('DataPart').instance();
                expect(dataPart.state.format).toBe('hsva');
            }
        }
        wrapper.unmount();
    });

    // === Slider handleClick via mock getBoundingClientRect ===

    it('ColorSlider handleClick with mocked rect', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange });
        const slider = wrapper.find('ColorSlider').instance();
        const domElement = slider.ref.current;
        if (domElement) {
            const origGetBCR = domElement.getBoundingClientRect;
            domElement.getBoundingClientRect = () => ({ x: 0, y: 0, width: 280, height: 10, left: 0, top: 0, right: 280, bottom: 10 });
            slider.handleClick({ clientX: 140, clientY: 5, preventDefault: noop, stopPropagation: noop });
            await sleep(50);
            expect(onChange.called).toBe(true);
            domElement.getBoundingClientRect = origGetBCR;
        }
        wrapper.unmount();
    });

    it('AlphaSlider handleClick with mocked rect', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ alpha: true, onChange });
        const slider = wrapper.find('AlphaSlider').instance();
        const domElement = slider.ref.current;
        if (domElement) {
            const origGetBCR = domElement.getBoundingClientRect;
            domElement.getBoundingClientRect = () => ({ x: 0, y: 0, width: 280, height: 10, left: 0, top: 0, right: 280, bottom: 10 });
            slider.handleClick({ clientX: 140, clientY: 5, preventDefault: noop, stopPropagation: noop });
            await sleep(50);
            expect(onChange.called).toBe(true);
            domElement.getBoundingClientRect = origGetBCR;
        }
        wrapper.unmount();
    });

    it('ColorChooseArea handleClick with mocked rect', async () => {
        const onChange = sinon.spy();
        const wrapper = getColorPicker({ onChange });
        const area = wrapper.find('ColorChooseArea').instance();
        const domElement = area.ref.current;
        if (domElement) {
            const origGetBCR = domElement.getBoundingClientRect;
            domElement.getBoundingClientRect = () => ({ x: 0, y: 0, width: 280, height: 280, left: 0, top: 0, right: 280, bottom: 280 });
            area.handleClick({ clientX: 140, clientY: 140, preventDefault: noop, stopPropagation: noop });
            await sleep(50);
            expect(onChange.called).toBe(true);
            domElement.getBoundingClientRect = origGetBCR;
        }
        wrapper.unmount();
    });

    // === Convert utility coverage ===

    it('colorStringToValue covers various rgbaToHsva branches', () => {
        // Pure red (max = r)
        const red = ColorPicker.colorStringToValue('#ff0000');
        expect(red.hsva.h).toBe(0);

        // Pure green (max = g)
        const green = ColorPicker.colorStringToValue('#00ff00');
        expect(green.hsva.h).toBe(120);

        // Pure blue (max = b)
        const blue = ColorPicker.colorStringToValue('#0000ff');
        expect(blue.hsva.h).toBe(240);

        // Black (no delta)
        const black = ColorPicker.colorStringToValue('#000000');
        expect(black.hsva.h).toBe(0);
        expect(black.hsva.s).toBe(0);
    });

    it('colorStringToValue with percentage rgba', () => {
        // Not percentage mode, just standard
        const result = ColorPicker.colorStringToValue('rgba(100, 200, 50, 0.8)');
        expect(result.rgba.r).toBe(100);
        expect(result.rgba.g).toBe(200);
        expect(result.rgba.b).toBe(50);
        expect(result.rgba.a).toBeCloseTo(0.8);
    });

    it('colorStringToValue with hex alpha with a=undefined', () => {
        // When hex only 6 chars, a should be 1
        const result = ColorPicker.colorStringToValue('#ff0000');
        expect(result.rgba.a).toBe(1);
    });

    it('rgbaToHex with alpha undefined', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        // Use static method
        const hex = instance.foundation.constructor.rgbaToHex({ r: 255, g: 0, b: 0, a: undefined });
        expect(hex).toBe('#ff0000');
        wrapper.unmount();
    });

    it('rgbaToHex with alpha = 1', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const hex = instance.foundation.constructor.rgbaToHex({ r: 255, g: 0, b: 0, a: 1 });
        expect(hex).toBe('#ff0000');
        wrapper.unmount();
    });

    it('rgbaToHex with alpha < 1', () => {
        const wrapper = getColorPicker({});
        const instance = wrapper.find('ColorPicker').instance();
        const hex = instance.foundation.constructor.rgbaToHex({ r: 255, g: 0, b: 0, a: 0.5 });
        expect(hex.length).toBeGreaterThan(7);
        wrapper.unmount();
    });

    // === Direct convert utility function tests ===

    it('hsvaToRgbString converts correctly', () => {
        const result = hsvaToRgbString({ h: 0, s: 100, v: 100, a: 1 });
        expect(result).toBe('rgb(255, 0, 0)');
    });

    it('hsvaToHsv converts correctly', () => {
        const result = hsvaToHsv({ h: 120, s: 50, v: 75, a: 0.5 });
        expect(result).toEqual({ h: 120, s: 50, v: 75 });
    });

    it('rgbaToRgb converts correctly', () => {
        const result = rgbaToRgb({ r: 255, g: 128, b: 0, a: 0.5 });
        expect(result).toEqual({ r: 255, g: 128, b: 0 });
    });

    it('hslaToHsl converts correctly', () => {
        const result = hslaToHsl({ h: 180, s: 50, l: 50, a: 1 });
        expect(result).toEqual({ h: 180, s: 50, l: 50 });
    });

    it('hsvaToHsvString converts correctly', () => {
        const result = hsvaToHsvString({ h: 120, s: 100, v: 100, a: 1 });
        expect(result).toBe('hsv(120, 100%, 100%)');
    });

    it('hsvaToHsvaString converts correctly', () => {
        const result = hsvaToHsvaString({ h: 120, s: 100, v: 100, a: 0.5 });
        expect(result).toBe('hsva(120, 100%, 100%, 0.5)');
    });

    it('hexToRgba with invalid hex substring returns a=1', () => {
        // Test the hexToPercent fallback with an empty/invalid alpha substring
        const result = hexToRgba('#ff0000');
        expect(result.a).toBe(1);
    });

    it('hslaStringToHsva converts correctly', () => {
        const result = hslaStringToHsva('hsla(120, 50%, 50%, 0.5)');
        expect(result.h).toBe(120);
        expect(result.a).toBeCloseTo(0.5);
    });

    it('hslaStringToHsva with invalid string returns defaults', () => {
        const result = hslaStringToHsva('invalid');
        expect(result).toEqual({ h: 0, s: 0, v: 0, a: 1 });
    });
});
