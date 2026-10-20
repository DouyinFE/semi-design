import React from 'react';
import { act } from 'react-dom/test-utils';
import Spin from '../index';

describe('Spin delay lifecycle', () => {
    let clock;
    let wrapper;
    beforeEach(() => { clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }); });
    afterEach(() => {
        if (wrapper) { wrapper.unmount(); }
        wrapper = null;
        clock.restore();
        sinon.restore();
    });

    it('waits before showing the initial spinner', () => {
        wrapper = mount(<Spin spinning delay={1000} />);
        expect(wrapper.find('.semi-spin-wrapper').exists()).toBe(false);
        act(() => { clock.tick(999); });
        wrapper.update();
        expect(wrapper.find('.semi-spin-wrapper').exists()).toBe(false);
        act(() => { clock.tick(1); });
        wrapper.update();
        expect(wrapper.find('.semi-spin-wrapper').exists()).toBe(true);
    });

    it('does not restart the delay or keep updating after it finishes', () => {
        wrapper = mount(<Spin spinning={false} delay={1000} />);
        const update = sinon.spy(wrapper.instance(), 'setState');
        wrapper.setProps({ spinning: true });
        act(() => { clock.tick(500); });
        wrapper.setProps({ tip: 'new tip' });
        act(() => { clock.tick(500); });
        wrapper.update();
        expect(wrapper.find('.semi-spin-wrapper').exists()).toBe(true);
        expect(update.callCount).toBe(1);
        act(() => { clock.tick(3000); });
        expect(update.callCount).toBe(1);
    });

    it('clears pending work after rerenders and unmount', () => {
        wrapper = mount(<Spin spinning delay={1000} />);
        const update = sinon.spy(wrapper.instance(), 'setState');
        wrapper.setProps({ tip: 'first' });
        wrapper.setProps({ tip: 'second' });
        wrapper.unmount();
        wrapper = null;
        clock.tick(2000);
        expect(update.called).toBe(false);
    });

    it('cancels a stopped cycle and waits for the next one', () => {
        wrapper = mount(<Spin spinning={false} delay={1000} />);
        wrapper.setProps({ spinning: true });
        act(() => { clock.tick(500); });
        wrapper.setProps({ spinning: false });
        wrapper.setProps({ spinning: true });
        act(() => { clock.tick(500); });
        wrapper.update();
        expect(wrapper.find('.semi-spin-wrapper').exists()).toBe(false);
        act(() => { clock.tick(500); });
        wrapper.update();
        expect(wrapper.find('.semi-spin-wrapper').exists()).toBe(true);
    });

    it('uses the latest delay and supports removing it', () => {
        wrapper = mount(<Spin spinning={false} delay={1000} />);
        wrapper.setProps({ spinning: true });
        act(() => { clock.tick(500); });
        wrapper.setProps({ delay: 2000 });
        act(() => { clock.tick(1000); });
        wrapper.update();
        expect(wrapper.find('.semi-spin-wrapper').exists()).toBe(false);
        wrapper.setProps({ delay: 0 });
        expect(wrapper.find('.semi-spin-wrapper').exists()).toBe(true);
        const update = sinon.spy(wrapper.instance(), 'setState');
        act(() => { clock.tick(3000); });
        expect(update.called).toBe(false);
    });
});
