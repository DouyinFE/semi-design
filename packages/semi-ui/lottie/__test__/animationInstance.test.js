import React from 'react';
import { mount } from 'enzyme';
import lottie from 'lottie-web';
import Lottie from '../index';

const params = () => ({ animationData: { v: '5.7.4', fr: 30, ip: 0, op: 60, w: 240, h: 120, layers: [] }, autoplay: false });

describe('Lottie animation instance callback', () => {
    afterEach(() => rs.restoreAllMocks());

    it('reports the loaded animation once on a normal mount', () => {
        const load = rs.spyOn(lottie, 'loadAnimation');
        const receive = rs.fn();
        const wrapper = mount(<Lottie params={params()} getAnimationInstance={receive} />);
        try {
            expect(load).toHaveBeenCalledTimes(1);
            expect(receive).toHaveBeenCalledTimes(1);
            expect(receive.mock.calls[0][0]).toBe(load.mock.results[0].value);
        } finally {
            wrapper.unmount();
        }
    });

    it('reports one new instance when animation parameters change', () => {
        const receive = rs.fn();
        const initialParams = params();
        const wrapper = mount(<Lottie params={initialParams} getAnimationInstance={receive} />);
        const first = receive.mock.calls[0][0];
        const destroy = rs.spyOn(first, 'destroy');
        try {
            wrapper.setProps({ params: { ...initialParams, loop: false } });
            expect(destroy).toHaveBeenCalledTimes(1);
            expect(receive).toHaveBeenCalledTimes(2);
            expect(receive.mock.calls[1][0]).not.toBe(first);
        } finally {
            wrapper.unmount();
        }
    });

    it('destroys the instance without notifying it again on unmount', () => {
        const receive = rs.fn();
        const wrapper = mount(<Lottie params={params()} getAnimationInstance={receive} />);
        const destroy = rs.spyOn(receive.mock.calls[0][0], 'destroy');
        wrapper.unmount();
        expect(destroy).toHaveBeenCalledTimes(1);
        expect(receive).toHaveBeenCalledTimes(1);
    });

    it('loads normally when no instance callback is provided', () => {
        const load = rs.spyOn(lottie, 'loadAnimation');
        const wrapper = mount(<Lottie params={params()} />);
        expect(load).toHaveBeenCalledTimes(1);
        wrapper.unmount();
    });
});
