import React from 'react';
import { mount } from 'enzyme';
import DragMove from '../index';

class Block extends React.Component {
    render() { return <div>Block</div>; }
}

describe('DragMove parent constraint', () => {
    it.each([false, true])('keeps the resolved element within its parent with a class child %s', classChild => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const wrapper = mount(<DragMove constrainer="parent">{classChild ? <Block /> : <div>Block</div>}</DragMove>, { attachTo: container });
        const element = wrapper.getDOMNode();
        const originalRequest = global.requestAnimationFrame;
        const originalWindowRequest = window.requestAnimationFrame;
        global.requestAnimationFrame = window.requestAnimationFrame = callback => { callback(); return 1; };
        try {
            Object.defineProperties(container, { offsetWidth: { value: 200 }, offsetHeight: { value: 200 } });
            Object.defineProperties(element, { offsetWidth: { value: 50 }, offsetHeight: { value: 50 } });
            element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0, clientY: 0 }));
            document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 500, clientY: 500 }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            expect(element.style.left).toBe('150px');
            expect(element.style.top).toBe('150px');
        } finally {
            wrapper.unmount();
            global.requestAnimationFrame = originalRequest;
            window.requestAnimationFrame = originalWindowRequest;
            container.remove();
        }
    });
});
