import React from 'react';
import DragMove from '../index';

describe('DragMove pending movement at the end of a drag', () => {
    let frames;
    let nextFrame;
    let wrapper;
    let request;
    let cancel;
    let windowRequest;
    let windowCancel;

    beforeEach(() => {
        frames = new Map();
        nextFrame = 0;
        request = global.requestAnimationFrame;
        cancel = global.cancelAnimationFrame;
        windowRequest = window.requestAnimationFrame;
        windowCancel = window.cancelAnimationFrame;
        global.requestAnimationFrame = window.requestAnimationFrame = callback => {
            frames.set(++nextFrame, callback);
            return nextFrame;
        };
        global.cancelAnimationFrame = window.cancelAnimationFrame = id => frames.delete(id);
    });

    afterEach(() => {
        if (wrapper) wrapper.unmount();
        wrapper = null;
        global.requestAnimationFrame = request;
        global.cancelAnimationFrame = cancel;
        window.requestAnimationFrame = windowRequest;
        window.cancelAnimationFrame = windowCancel;
    });

    function flushFrames() {
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach(callback => callback());
    }

    function touch(type, x, y) {
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.assign(event, { targetTouches: [{ clientX: x, clientY: y }] });
        return event;
    }

    function moveAndEnd(type) {
        const element = wrapper.getDOMNode();
        if (type === 'mouseup') {
            element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 10, clientY: 10 }));
            document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 50, clientY: 30 }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 50, clientY: 30 }));
        } else {
            element.dispatchEvent(touch('touchstart', 10, 10));
            document.dispatchEvent(touch('touchmove', 50, 30));
            document.dispatchEvent(touch(type, 50, 30));
        }
    }

    it.each(['mouseup', 'touchend', 'touchcancel'])('finishes movement before %s can reset the position', type => {
        const positions = [];
        const onEnd = () => {
            const element = wrapper.getDOMNode();
            positions.push([element.style.left, element.style.top]);
            element.style.left = '0px';
            element.style.top = '0px';
        };
        wrapper = mount(<DragMove onMouseUp={onEnd} onTouchEnd={onEnd} onTouchCancel={onEnd}><div /></DragMove>);
        moveAndEnd(type);
        expect(positions).toEqual([['40px', '20px']]);
        flushFrames();
        expect(wrapper.getDOMNode().style.left).toBe('0px');
        expect(wrapper.getDOMNode().style.top).toBe('0px');
    });

    it.each(['mouseup', 'touchend', 'touchcancel'])('delivers customMove once before %s', type => {
        const calls = [];
        const onEnd = () => calls.push('end');
        wrapper = mount(<DragMove customMove={(element, top, left) => calls.push([top, left])}
            onMouseUp={onEnd} onTouchEnd={onEnd} onTouchCancel={onEnd}><div /></DragMove>);
        moveAndEnd(type);
        flushFrames();
        expect(calls).toEqual([[20, 40], 'end']);
    });

    it('keeps the final position when the caller does not reset it', () => {
        wrapper = mount(<DragMove><div /></DragMove>);
        moveAndEnd('mouseup');
        flushFrames();
        expect(wrapper.getDOMNode().style.left).toBe('40px');
        expect(wrapper.getDOMNode().style.top).toBe('20px');
    });

    it('does not notify a removed component after customMove unmounts it', () => {
        const onEnd = sinon.spy();
        wrapper = mount(<DragMove customMove={() => { wrapper.unmount(); wrapper = null; }} onMouseUp={onEnd}><div /></DragMove>);
        moveAndEnd('mouseup');
        flushFrames();
        expect(onEnd.callCount).toBe(0);
    });
});
