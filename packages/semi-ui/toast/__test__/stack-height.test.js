import React from 'react';
import { mount } from 'enzyme';
import Toast from '../toast';

describe('Toast stack content height', () => {
    const NativeResizeObserver = global.ResizeObserver;
    let observers;
    beforeEach(() => {
        observers = [];
        global.ResizeObserver = class {
            constructor(callback) {
                this.callback = callback;
                observers.push(this);
            }
            observe(target) { this.target = target; }
            disconnect() {}
            unobserve() {}
        };
    });
    afterEach(() => { global.ResizeObserver = NativeResizeObserver; });

    function resize(wrapper, height) {
        const node = wrapper.find('.semi-toast').getDOMNode();
        node.style.height = height + 'px';
        const observer = observers.find(item => item.target === node);
        expect(observer).toBeDefined();
        observer.callback([{ target: node, contentRect: { height } }]);
        wrapper.update();
    }

    it('updates the expanded wrapper after content grows and shrinks', () => {
        const wrapper = mount(<Toast content="Content" duration={0} stack stackExpanded />);
        resize(wrapper, 60);
        expect(wrapper.find('.semi-toast-zero-height-wrapper').prop('style').height).toEqual('60px');
        resize(wrapper, 180);
        expect(wrapper.find('.semi-toast-zero-height-wrapper').prop('style').height).toEqual('180px');
        resize(wrapper, 40);
        expect(wrapper.find('.semi-toast-zero-height-wrapper').prop('style').height).toEqual('40px');
        wrapper.unmount();
    });

    it('keeps a collapsed stack closed and uses the latest height when expanded', () => {
        const wrapper = mount(<Toast content="Content" duration={0} stack />);
        resize(wrapper, 180);
        expect(wrapper.find('.semi-toast-zero-height-wrapper').prop('style').height).toEqual(0);
        wrapper.setProps({ stackExpanded: true });
        expect(wrapper.find('.semi-toast-zero-height-wrapper').prop('style').height).toEqual('180px');
        wrapper.unmount();
    });

    it('does not observe a toast outside a stack', () => {
        const wrapper = mount(<Toast content="Content" duration={0} />);
        expect(observers).toHaveLength(0);
        expect(wrapper.find('.semi-toast-zero-height-wrapper')).toHaveLength(0);
        wrapper.unmount();
    });
});
