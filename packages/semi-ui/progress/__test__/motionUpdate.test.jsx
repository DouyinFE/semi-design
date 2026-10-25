import React from 'react';
import Progress from '..';

describe('Progress interrupted motion', () => {
    let clock;
    let sandbox;
    let frames;
    let wrapper;
    beforeEach(() => {
        frames = new Map();
        let nextId = 0;
        sandbox = sinon.createSandbox();
        clock = sinon.useFakeTimers({ now: 1700000000000, toFake: ['Date', 'setTimeout', 'clearTimeout'] });
        sandbox.stub(window, 'requestAnimationFrame').callsFake(callback => { frames.set(++nextId, callback); return nextId; });
        sandbox.stub(window, 'cancelAnimationFrame').callsFake(id => frames.delete(id));
    });
    afterEach(() => { wrapper?.unmount(); sandbox.restore(); clock.restore(); });
    function frame() {
        clock.tick(16);
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach(callback => callback(clock.now));
        wrapper.update();
    }

    ['line', 'circle'].forEach(type => {
        it(`keeps the latest ${type} value after motion is disabled`, () => {
            wrapper = mount(<Progress type={type} percent={0} motion />);
            wrapper.setProps({ percent: 90 });
            for (let i = 0; i < 5; i++) frame();
            wrapper.setProps({ percent: 10, motion: false });
            expect(wrapper.state('percentNumber')).toBe(10);
            for (let i = 0; i < 30; i++) {
                frame();
                expect(wrapper.state('percentNumber')).toBe(10);
            }
        });
    });

    it('still animates a replacement target when motion stays enabled', () => {
        wrapper = mount(<Progress percent={0} motion />);
        wrapper.setProps({ percent: 90 });
        for (let i = 0; i < 5; i++) frame();
        wrapper.setProps({ percent: 60 });
        for (let i = 0; i < 30; i++) frame();
        expect(wrapper.state('percentNumber')).toBe(60);
    });

    it('updates without scheduling frames when motion is already disabled', () => {
        wrapper = mount(<Progress percent={0} motion={false} />);
        wrapper.setProps({ percent: 50 });
        expect(wrapper.state('percentNumber')).toBe(50);
        expect(frames.size).toBe(0);
    });
});
