import React from 'react';
import { mount } from 'enzyme';
import ColorPicker from '../index';

describe('ColorPicker touch dragging', () => {
    let wrapper;
    let onChange;

    beforeEach(() => {
        onChange = rstest.fn();
        rstest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ x: 0, y: 0, width: 280, height: 280 });
        wrapper = mount(<ColorPicker alpha usePopover={false} onChange={onChange} />);
    });

    afterEach(() => {
        if (wrapper.length) wrapper.unmount();
        rstest.restoreAllMocks();
    });

    const touch = (node, type, clientX = 40, clientY = 50) => {
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperty(event, 'touches', { value: type === 'touchend' || type === 'touchcancel' ? [] : [{ clientX, clientY }] });
        node.dispatchEvent(event);
        return event;
    };

    ['colorChooseArea', 'colorSlider', 'alphaSlider'].forEach(area => {
        const selector = '.semi-colorPicker-' + area;

        it(`${area} updates continuously while dragging by touch`, () => {
            const node = wrapper.find(selector).getDOMNode();
            const start = touch(node, 'touchstart');
            touch(node, 'touchmove', 210, 180);
            touch(node, 'touchend');
            expect(onChange.mock.calls.length).toBeGreaterThanOrEqual(2);
            expect(start.defaultPrevented).toBe(true);
            const hsva = onChange.mock.calls[onChange.mock.calls.length - 1][0].hsva;
            expect(hsva[area === 'colorChooseArea' ? 's' : area === 'colorSlider' ? 'h' : 'a']).toBe(area === 'colorChooseArea' ? 75 : area === 'colorSlider' ? 270 : 0.75);
        });

        it(`${area} stops on cancellation and removes listeners on unmount`, () => {
            const node = wrapper.find(selector).getDOMNode();
            touch(node, 'touchstart');
            expect(onChange.mock.calls.length).toBe(1);
            touch(node, 'touchcancel');
            touch(node, 'touchmove', 210, 180);
            expect(onChange.mock.calls.length).toBe(1);
            wrapper.unmount();
            touch(node, 'touchstart');
            touch(node, 'touchmove', 100, 100);
            expect(onChange.mock.calls.length).toBe(1);
        });

        it(`${area} keeps mouse dragging working`, () => {
            const node = wrapper.find(selector).getDOMNode();
            wrapper.find(selector).simulate('mousedown', { clientX: 40, clientY: 50 });
            (area === 'colorChooseArea' ? node : window).dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 210, clientY: 180 }));
            window.dispatchEvent(new MouseEvent('mouseup'));
            expect(onChange.mock.calls.length).toBeGreaterThanOrEqual(2);
        });
    });
});
