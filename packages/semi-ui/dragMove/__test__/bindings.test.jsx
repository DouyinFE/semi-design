import React from 'react';
import { mount } from 'enzyme';
import DragMove from '../index';

describe('DragMove DOM ownership', () => {
    const originalRequest = global.requestAnimationFrame;
    const originalCancel = global.cancelAnimationFrame;
    const originalWindowRequest = window.requestAnimationFrame;
    const originalWindowCancel = window.cancelAnimationFrame;
    beforeEach(() => {
        global.requestAnimationFrame = () => 1;
        global.cancelAnimationFrame = () => {};
    });
    afterEach(() => {
        global.requestAnimationFrame = originalRequest;
        global.cancelAnimationFrame = originalCancel;
        window.requestAnimationFrame = originalWindowRequest;
        window.cancelAnimationFrame = originalWindowCancel;
    });
    const down = node => node.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }));
    const up = () => document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    it('binds a replacement child and releases the old child', () => {
        const onMouseDown = sinon.spy();
        const wrapper = mount(<DragMove onMouseDown={onMouseDown}><div key="a">A</div></DragMove>);
        const oldNode = wrapper.getDOMNode();
        try {
            wrapper.setProps({ children: <div key="b">B</div> });
            const newNode = wrapper.getDOMNode();
            expect(newNode.style.position).toBe('absolute');
            down(newNode);
            up();
            expect(onMouseDown.callCount).toBe(1);
            down(oldNode);
            up();
            expect(onMouseDown.callCount).toBe(1);
        } finally { wrapper.unmount(); }
    });

    it('rebinds an external handler and restores owned cursor styles', () => {
        const a = document.createElement('div');
        const b = document.createElement('div');
        a.style.cursor = 'crosshair';
        let handler = a;
        const onMouseDown = sinon.spy();
        const wrapper = mount(<DragMove handler={() => handler} onMouseDown={onMouseDown}><div>A</div></DragMove>);
        try {
            handler = b;
            wrapper.setProps({ positionStrategy: 'relative' });
            expect(a.style.cursor).toBe('crosshair');
            down(a);
            up();
            expect(onMouseDown.callCount).toBe(0);
            down(b);
            up();
            expect(onMouseDown.callCount).toBe(1);
        } finally { wrapper.unmount(); }
        down(a);
        down(b);
        up();
        expect(onMouseDown.callCount).toBe(1);
        expect(b.style.cursor).toBe('');
    });

    it('keeps an in-progress drag alive when the handler changes', () => {
        const a = document.createElement('div');
        const b = document.createElement('div');
        let handler = a;
        const onMouseMove = sinon.spy();
        const onMouseUp = sinon.spy();
        const onMouseDown = sinon.spy();
        const wrapper = mount(<DragMove handler={() => handler} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}><div>A</div></DragMove>);
        try {
            down(a);
            handler = b;
            wrapper.setProps({ positionStrategy: 'relative' });
            document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 20, clientY: 20 }));
            up();
            expect(onMouseMove.callCount).toBe(1);
            expect(onMouseUp.callCount).toBe(1);
            down(a);
            up();
            expect(onMouseDown.callCount).toBe(1);
            down(b);
            up();
            expect(onMouseDown.callCount).toBe(2);
        } finally { wrapper.unmount(); }
    });

    it('unbinds without throwing when the handler becomes null and rebinds when it returns', () => {
        const a = document.createElement('div');
        let handler = a;
        const onMouseDown = sinon.spy();
        const wrapper = mount(<DragMove handler={() => handler} onMouseDown={onMouseDown}><div>A</div></DragMove>);
        try {
            handler = null;
            wrapper.setProps({ positionStrategy: 'relative' });
            expect(a.style.cursor).toBe('');
            down(a);
            up();
            expect(onMouseDown.callCount).toBe(0);
            handler = a;
            wrapper.setProps({ positionStrategy: 'absolute' });
            down(a);
            up();
            expect(onMouseDown.callCount).toBe(1);
        } finally { wrapper.unmount(); }
    });

    it('does not throw when the child stops rendering an element', () => {
        class Empty extends React.Component {
            render() { return null; }
        }
        const wrapper = mount(<DragMove><div>A</div></DragMove>);
        try {
            expect(() => wrapper.setProps({ children: <Empty /> })).not.toThrow();
        } finally { wrapper.unmount(); }
    });

    it('does not schedule custom movement after onMouseMove unmounts the component', () => {
        const customMove = sinon.spy();
        let wrapper;
        wrapper = mount(<DragMove customMove={customMove} onMouseMove={() => wrapper.unmount()}><div>A</div></DragMove>);
        const request = sinon.spy(() => 1);
        global.requestAnimationFrame = request;
        window.requestAnimationFrame = request;
        try {
            down(wrapper.getDOMNode());
            document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 20, clientY: 30 }));
            expect(request.callCount).toBe(0);
            expect(customMove.callCount).toBe(0);
        } finally { up(); }
    });

    it('cancels all pending movement frames when unmounted', () => {
        const customMove = sinon.spy();
        let nextId = 1;
        const frames = new Map();
        const request = sinon.stub().callsFake(callback => {
            const id = nextId++;
            frames.set(id, callback);
            return id;
        });
        const cancel = sinon.stub().callsFake(id => frames.delete(id));
        const wrapper = mount(<DragMove customMove={customMove}><div>A</div></DragMove>);
        global.requestAnimationFrame = request;
        window.requestAnimationFrame = request;
        global.cancelAnimationFrame = cancel;
        window.cancelAnimationFrame = cancel;
        try {
            down(wrapper.getDOMNode());
            document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 20, clientY: 30 }));
            document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 30, clientY: 40 }));
            wrapper.unmount();
            expect(frames.size).toBe(0);
            expect(cancel.callCount).toBe(2);
            frames.forEach(callback => callback());
            expect(customMove.callCount).toBe(0);
        } finally { up(); }
    });

    ['mouse', 'touch'].forEach(kind => {
        it(`does not bind document events after on${kind === 'mouse' ? 'MouseDown' : 'TouchStart'} unmounts the component`, () => {
            let wrapper;
            const props = { [kind === 'mouse' ? 'onMouseDown' : 'onTouchStart']: () => wrapper.unmount() };
            wrapper = mount(<DragMove {...props}><div>A</div></DragMove>);
            const foundation = wrapper.instance().foundation;
            const node = wrapper.getDOMNode();
            const add = sinon.spy(document, 'addEventListener');
            try {
                if (kind === 'mouse') {
                    down(node);
                } else {
                    const event = new Event('touchstart', { bubbles: true, cancelable: true });
                    Object.defineProperty(event, 'targetTouches', { value: [{ clientX: 10, clientY: 10 }] });
                    node.dispatchEvent(event);
                }
                expect(add.args.some(([name]) => name === `${kind}move`)).toBe(false);
            } finally {
                add.restore();
                foundation._unRegisterDocMouseEvent();
                foundation._unRegisterDocTouchEvent();
            }
        });
    });

    it('does not bind document events after allowMove unmounts the component', () => {
        let wrapper;
        wrapper = mount(<DragMove allowMove={() => { wrapper.unmount(); return true; }}><div>A</div></DragMove>);
        const node = wrapper.getDOMNode();
        const add = sinon.spy(document, 'addEventListener');
        try {
            down(node);
            expect(add.args.some(([name]) => name === 'mousemove')).toBe(false);
        } finally { add.restore(); up(); }
    });
});
