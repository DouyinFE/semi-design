import React from 'react';
import { mount } from 'enzyme';
import ScrollList from '../index';

const list = Array.from({ length: 40 }, (_, value) => ({ value }));

describe('ScrollList hidden layout', () => {
    let wrapper;
    let container;
    let observers;
    let originalObserver;
    let originalWindowObserver;
    let visible;

    beforeEach(() => {
        observers = [];
        visible = false;
        originalObserver = globalThis.ResizeObserver;
        originalWindowObserver = window.ResizeObserver;
        class Observer {
            constructor(callback) { this.callback = callback; observers.push(this); }
            observe(element) { this.element = element; }
            unobserve() { this.element = null; }
            disconnect() { this.element = null; }
        }
        globalThis.ResizeObserver = Observer;
        window.ResizeObserver = Observer;
        container = document.createElement('div');
        document.body.appendChild(container);
        wrapper = mount(<ScrollList bodyHeight={200}><ScrollList.Item list={list} selectedIndex={25} motion={false} /></ScrollList>, { attachTo: container });
        const scroll = container.querySelector('[role="listbox"]').parentElement;
        Object.defineProperty(scroll, 'offsetHeight', { configurable: true, get: () => visible ? 200 : 0 });
        container.querySelectorAll('li').forEach((element, index) => {
            Object.defineProperty(element, 'offsetHeight', { configurable: true, get: () => visible ? 36 : 0 });
            Object.defineProperty(element, 'offsetTop', { configurable: true, get: () => visible ? 132 + index * 36 : 0 });
        });
        scroll.scrollTop = 0;
    });

    afterEach(() => {
        wrapper.unmount();
        container.remove();
        globalThis.ResizeObserver = originalObserver;
        window.ResizeObserver = originalWindowObserver;
    });

    function resize(height) {
        visible = height > 0;
        for (const observer of observers) {
            if (observer.element) {
                observer.callback([{ target: observer.element, contentRect: { width: 300, height } }]);
            }
        }
    }

    it('centers the selected option when a hidden list becomes visible', () => {
        resize(0);
        resize(200);
        expect(container.querySelector('[role="listbox"]').parentElement.scrollTop).toBe(950);
    });

    it('keeps the user scroll position during visible size changes', () => {
        resize(200);
        const scroll = container.querySelector('[role="listbox"]').parentElement;
        scroll.scrollTop = 400;
        resize(220);
        expect(scroll.scrollTop).toBe(400);
    });

    it('uses the latest selectedIndex after being hidden again', () => {
        resize(200);
        resize(0);
        wrapper.setProps({ children: <ScrollList.Item list={list} selectedIndex={10} motion={false} /> });
        const scroll = container.querySelector('[role="listbox"]').parentElement;
        scroll.scrollTop = 0;
        resize(200);
        expect(scroll.scrollTop).toBe(410);
    });
});
