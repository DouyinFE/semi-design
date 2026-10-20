import ColorPicker from '../index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

describe('ColorPicker slider dragging', () => {
    it.each([
        ['colorSlider', 280, 'handle', 'h', 360],
        ['alphaSlider', 280, 'alphaHandle', 'a', 1],
        ['colorSlider', 180, 'handle', 'h', 360],
        ['alphaSlider', 180, 'alphaHandle', 'a', 1],
    ])('keeps %s handle at the boundary during repeated out-of-bounds dragging (width %s)',
        (sliderClass, width, handleClass, channel, maximum) => {
            const onChange = sinon.spy();
            const wrapper = mount(<ColorPicker alpha width={width} onChange={onChange} />);
            const slider = wrapper.find(`.${BASE_CLASS_PREFIX}-colorPicker-${sliderClass}`);
            const handle = slider.getDOMNode().querySelector(`.${BASE_CLASS_PREFIX}-colorPicker-${handleClass}`);
            const rect = sinon.stub(slider.getDOMNode(), 'getBoundingClientRect').returns({ x: 100, width });

            try {
                slider.simulate('mousedown', { clientX: 100 + width / 2 });
                for (const [offset, position, value] of [
                    [width, width - 9, maximum],
                    [width + 20, width - 9, maximum],
                    [width + 40, width - 9, maximum],
                    [0, -9, 0],
                    [-20, -9, 0],
                    [-40, -9, 0],
                    [width / 2, width / 2 - 9, maximum / 2],
                ]) {
                    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100 + offset }));
                    expect(handle.style.left).toBe(`${position}px`);
                    expect(onChange.lastCall.args[0].hsva[channel]).toBe(value);
                }
            } finally {
                window.dispatchEvent(new MouseEvent('mouseup'));
                rect.restore();
                wrapper.unmount();
            }
        });
});
