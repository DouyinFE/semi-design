import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { spy, useFakeTimers } from 'sinon';
import Anchor from '../index';

describe('Anchor pending scroll work', () => {
    it('does not measure the scroll container after unmount', () => {
        const clock = useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
        const container = document.createElement('div');
        const wrapper = mount(<Anchor getContainer={() => container}><Anchor.Link href="#first" title="first" /></Anchor>);
        const measure = spy(container, 'getBoundingClientRect');
        try {
            act(() => { container.dispatchEvent(new Event('scroll')); });
            act(() => { clock.tick(20); container.dispatchEvent(new Event('scroll')); });
            wrapper.unmount();
            measure.resetHistory();
            act(() => { clock.tick(150); });
            expect(measure.called).toBe(false);
        } finally { measure.restore(); clock.restore(); }
    });

    it('keeps processing pending scrolling while mounted', () => {
        const clock = useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
        const container = document.createElement('div');
        const wrapper = mount(<Anchor getContainer={() => container}><Anchor.Link href="#first" title="first" /></Anchor>);
        const measure = spy(container, 'getBoundingClientRect');
        try {
            act(() => { container.dispatchEvent(new Event('scroll')); });
            act(() => { clock.tick(20); container.dispatchEvent(new Event('scroll')); });
            measure.resetHistory();
            act(() => { clock.tick(150); });
            expect(measure.called).toBe(true);
        } finally { wrapper.unmount(); measure.restore(); clock.restore(); }
    });
});
