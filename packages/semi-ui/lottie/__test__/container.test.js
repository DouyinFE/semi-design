import React from 'react';
import { mount } from 'enzyme';
import lottie from 'lottie-web';
import Lottie from '../index';

const animationData = { v: '5.7.4', fr: 30, ip: 0, op: 60, w: 240, h: 120, layers: [] };

describe('Lottie animation container', () => {
    afterEach(() => rs.restoreAllMocks());

    it('uses its wrapper when the optional container is explicitly undefined', () => {
        const load = rs.spyOn(lottie, 'loadAnimation');
        const wrapper = mount(<Lottie params={{ animationData, container: undefined, autoplay: false, loop: false }} />);
        try {
            expect(load.mock.calls[0][0]).toMatchObject({
                container: wrapper.find('.semi-lottie').getDOMNode(),
                renderer: 'svg',
                autoplay: false,
                loop: false,
            });
        } finally {
            wrapper.unmount();
        }
    });

    it('uses its wrapper when no container property is provided', () => {
        const load = rs.spyOn(lottie, 'loadAnimation');
        const wrapper = mount(<Lottie params={{ animationData }} />);
        try {
            expect(load.mock.calls[0][0].container).toBe(wrapper.find('.semi-lottie').getDOMNode());
        } finally {
            wrapper.unmount();
        }
    });

    it('preserves an explicit external container', () => {
        const external = document.createElement('div');
        const load = rs.spyOn(lottie, 'loadAnimation');
        const wrapper = mount(<Lottie params={{ animationData, container: external }} />);
        try {
            expect(wrapper.isEmptyRender()).toBe(true);
            expect(load.mock.calls[0][0].container).toBe(external);
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps the wrapper target and caller options when parameters update', () => {
        const load = rs.spyOn(lottie, 'loadAnimation');
        const wrapper = mount(<Lottie params={{ animationData }} />);
        const container = wrapper.find('.semi-lottie').getDOMNode();
        try {
            wrapper.setProps({ params: { animationData, container: undefined, renderer: 'canvas', autoplay: false } });
            expect(load).toHaveBeenCalledTimes(2);
            expect(load.mock.calls[1][0]).toMatchObject({ container, renderer: 'canvas', autoplay: false });
        } finally {
            wrapper.unmount();
        }
    });
});
