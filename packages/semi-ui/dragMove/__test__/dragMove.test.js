import React from 'react';
import { DragMove } from '../../index';

describe('DragMove', () => {
    const realRequestAnimationFrame = global.requestAnimationFrame;

    beforeEach(() => {
        global.requestAnimationFrame = callback => callback();
    });

    afterEach(() => {
        global.requestAnimationFrame = realRequestAnimationFrame;
        document.body.innerHTML = '';
    });

    it('keeps absolute positioning as the default strategy', () => {
        const wrapper = mount(
            <DragMove>
                <div>Drag me</div>
            </DragMove>
        );

        expect(wrapper.getDOMNode().style.position).toBe('absolute');
        wrapper.unmount();
    });

    it('uses relative offsets without removing the element from layout', () => {
        const wrapper = mount(
            <DragMove positionStrategy="relative">
                <div style={{ left: 12, top: 8 }}>Drag me</div>
            </DragMove>
        );
        const element = wrapper.getDOMNode();

        element.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 100,
        }));
        document.dispatchEvent(new MouseEvent('mousemove', {
            bubbles: true,
            clientX: 130,
            clientY: 140,
        }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        expect(element.style.position).toBe('relative');
        expect(element.style.left).toBe('42px');
        expect(element.style.top).toBe('48px');
        wrapper.unmount();
    });

    it('clamps relative offsets to the constrainer bounds', () => {
        const wrapper = mount(
            <DragMove positionStrategy="relative" constrainer="parent">
                <div style={{ left: 10, top: 5 }}>Drag me</div>
            </DragMove>,
            { attachTo: document.body.appendChild(document.createElement('div')) }
        );
        const element = wrapper.getDOMNode();
        const constrainer = element.parentNode;
        element.getBoundingClientRect = () => ({
            left: 40,
            top: 30,
            right: 140,
            bottom: 80,
            width: 100,
            height: 50,
        });
        constrainer.getBoundingClientRect = () => ({
            left: 0,
            top: 0,
            right: 200,
            bottom: 100,
            width: 200,
            height: 100,
        });

        element.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 100,
        }));
        document.dispatchEvent(new MouseEvent('mousemove', {
            bubbles: true,
            clientX: 300,
            clientY: 300,
        }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        expect(element.style.left).toBe('70px');
        expect(element.style.top).toBe('25px');
        wrapper.unmount();
    });
});
