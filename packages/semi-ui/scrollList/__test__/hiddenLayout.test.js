import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { stub } from 'sinon';
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

describe('ScrollList cycled wheel with ResizeObserver', () => {
    const cycledList = Array.from({ length: 12 }, (_, value) => ({ value, text: String(value) }));
    const outerSelector = '.semi-scrolllist-list-outer';
    const rowHeight = 36;
    const wrapperHeight = 247;
    const selectedTop = (wrapperHeight - rowHeight) / 2;
    let observers;
    let originalObserver;
    let originalWindowObserver;
    let visible;
    const restores = [];

    beforeEach(() => {
        visible = true;
        observers = [];
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
        const itemTop = element => Array.from(element.parentElement.children).indexOf(element) * rowHeight;
        const originalRect = HTMLElement.prototype.getBoundingClientRect;
        restores.push(stub(HTMLElement.prototype, 'offsetHeight').get(function () {
            if (!visible) {
                return 0;
            }
            return this.matches(outerSelector) ? wrapperHeight : this.tagName === 'LI' ? rowHeight : 0;
        }));
        restores.push(stub(HTMLElement.prototype, 'offsetTop').get(function () {
            return visible && this.tagName === 'LI' ? itemTop(this) : 0;
        }));
        restores.push(stub(HTMLElement.prototype, 'getBoundingClientRect').callsFake(function () {
            if (!visible) {
                return { top: 0, bottom: 0, height: 0 };
            }
            if (this.matches(outerSelector)) {
                return { top: 0, bottom: wrapperHeight, height: wrapperHeight };
            }
            if (this.classList.contains('semi-scrolllist-selector')) {
                return { top: selectedTop, height: rowHeight };
            }
            if (this.tagName === 'LI') {
                const outer = this.closest('.semi-scrolllist-item-wheel').querySelector(outerSelector);
                const top = itemTop(this) - outer.scrollTop;
                return { top, bottom: top + rowHeight, height: rowHeight };
            }
            return originalRect.call(this);
        }));
    });

    afterEach(() => {
        restores.splice(0).reverse().forEach(restore => restore.restore());
        globalThis.ResizeObserver = originalObserver;
        window.ResizeObserver = originalWindowObserver;
    });

    function resize(height) {
        act(() => {
            observers.forEach(observer => observer.element && observer.callback([{ target: observer.element, contentRect: { width: 100, height } }]));
        });
    }

    function mountCycled() {
        return mount(<ScrollList><ScrollList.Item cycled list={cycledList} selectedIndex={5} motion={false} /></ScrollList>);
    }

    it('keeps the middle copy after the first resize of a visible mount', () => {
        const wrapper = mountCycled();
        const outer = wrapper.find(outerSelector).getDOMNode();
        const before = outer.scrollTop;
        expect(wrapper.find('li').length).toBeGreaterThan(cycledList.length);
        expect(before).toBeGreaterThan(cycledList.length * rowHeight);
        resize(wrapperHeight);
        expect(outer.scrollTop).toBe(before);
        wrapper.unmount();
    });

    it('builds the prepended copies when a hidden cycled list becomes visible', () => {
        visible = false;
        const wrapper = mountCycled();
        resize(0);
        expect(wrapper.find('li').length).toBe(cycledList.length);
        visible = true;
        resize(wrapperHeight);
        wrapper.update();
        expect(wrapper.find('li').length).toBeGreaterThan(cycledList.length);
        const outer = wrapper.find(outerSelector).getDOMNode();
        expect(outer.scrollTop).toBeGreaterThan(cycledList.length * rowHeight);
        wrapper.unmount();
    });
});
