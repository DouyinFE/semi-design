import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import ReactIntersectionObserver from '../intersectionObserver';

describe('OverflowList observer threshold updates', () => {
    let NativeObserver, observers;
    beforeEach(() => {
        NativeObserver = global.IntersectionObserver;
        observers = [];
        global.IntersectionObserver = class {
            constructor(callback, options) {
                this.callback = callback;
                this.root = options.root || null;
                this.rootMargin = options.rootMargin;
                this.thresholds = [options.threshold];
                this.observe = spy();
                this.disconnect = spy();
                observers.push(this);
            }
        };
    });
    afterEach(() => { global.IntersectionObserver = NativeObserver; });

    it('uses the updated threshold while preserving the registered root', () => {
        const node = document.createElement('div');
        const wrapper = mount(<ReactIntersectionObserver items={{ first: node }} threshold={0.75} rootMargin="4px"><div /></ReactIntersectionObserver>);
        try {
            wrapper.setProps({ threshold: 0.25, root: document.createElement('div') });
            expect(observers).toHaveLength(2);
            expect(observers[0].disconnect.calledOnce).toBe(true);
            expect(observers[1].root).toBe(null);
            expect(observers[1].rootMargin).toBe('4px');
            expect(observers[1].thresholds).toEqual([0.25]);
            expect(observers[1].observe.calledWith(node)).toBe(true);
        } finally { wrapper.unmount(); }
    });

    it('keeps option.threshold precedence and responds to its updates', () => {
        const node = document.createElement('div');
        const wrapper = mount(<ReactIntersectionObserver items={{ first: node }} threshold={0.75} option={{ threshold: 0.5 }}><div /></ReactIntersectionObserver>);
        try {
            wrapper.setProps({ threshold: 0.25 });
            expect(observers).toHaveLength(1);
            wrapper.setProps({ option: { threshold: 0.1 } });
            expect(observers).toHaveLength(2);
            expect(observers[1].thresholds).toEqual([0.1]);
        } finally { wrapper.unmount(); }
    });

    it('continues observing changed items without rebuilding unchanged thresholds', () => {
        const first = document.createElement('div'), second = document.createElement('div');
        const wrapper = mount(<ReactIntersectionObserver items={{ first }} threshold={0.75}><div /></ReactIntersectionObserver>);
        try {
            wrapper.setProps({ items: { second } });
            expect(observers).toHaveLength(1);
            expect(observers[0].disconnect.calledOnce).toBe(true);
            expect(observers[0].observe.calledWith(second)).toBe(true);
        } finally { wrapper.unmount(); }
    });
});
