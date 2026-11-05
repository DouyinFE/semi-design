import React from 'react';
import { mount } from 'enzyme';
import { Resizable, ResizeGroup, ResizeItem, ResizeHandler } from '../index';

const touchEvent = (type, target, x) => {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'targetTouches', { value: type === 'touchend' ? [] : [{ clientX: x, clientY: 50, target }] });
    return event;
};

describe('Resizable touch callback events', () => {
    let wrapper;
    let host;

    beforeEach(() => {
        host = document.createElement('div');
        document.body.appendChild(host);
        jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(200);
        jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(100);
    });

    afterEach(() => {
        wrapper?.unmount();
        host.remove();
        jest.restoreAllMocks();
    });

    for (const grouped of [false, true]) {
        const label = grouped ? 'ResizeGroup' : 'Resizable';
        const render = callbacks => {
            const component = grouped
                ? <ResizeGroup><ResizeItem {...callbacks}/><ResizeHandler/><ResizeItem/></ResizeGroup>
                : <Resizable defaultSize={{ width: 200, height: 100 }} {...callbacks}/>;
            wrapper = mount(component, { attachTo: host });
            return host.querySelector(grouped ? '.semi-resizable-handler' : '.semi-resizable-resizableHandler-right');
        };

        it(`${label} passes the original touch events through all callbacks`, () => {
            const onResizeStart = jest.fn();
            const onChange = jest.fn();
            const onResizeEnd = jest.fn();
            const handle = render({ onResizeStart, onChange, onResizeEnd });
            const start = touchEvent('touchstart', handle, 100);
            const move = touchEvent('touchmove', handle, 120);
            const end = touchEvent('touchend', handle, 120);

            handle.dispatchEvent(start);
            window.dispatchEvent(move);
            window.dispatchEvent(end);

            expect(onResizeStart.mock.calls[0][0]).toBe(start);
            expect(onChange.mock.calls[0][1]).toBe(move);
            expect(onResizeEnd.mock.calls[0][1]).toBe(end);
            expect(move.defaultPrevented).toBe(true);
            if (!grouped) {
                expect(onChange.mock.calls[0][0].width).toBe(220);
            }
        });

        it(`${label} preserves mouse event callbacks`, () => {
            const onResizeStart = jest.fn();
            const onChange = jest.fn();
            const onResizeEnd = jest.fn();
            const handle = render({ onResizeStart, onChange, onResizeEnd });
            const start = new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 50 });
            const move = new MouseEvent('mousemove', { clientX: 120, clientY: 50 });
            const end = new MouseEvent('mouseup');
            handle.dispatchEvent(start);
            window.dispatchEvent(move);
            window.dispatchEvent(end);
            expect(onResizeStart.mock.calls[0][0]).toBe(start);
            expect(onChange.mock.calls[0][1]).toBe(move);
            expect(onResizeEnd.mock.calls[0][1]).toBe(end);
        });
    }
});
