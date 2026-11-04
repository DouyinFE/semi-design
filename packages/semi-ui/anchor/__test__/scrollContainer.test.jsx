import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { spy, useFakeTimers } from 'sinon';
import Anchor from '../index';

describe('Anchor scroll container lifecycle', () => {
    it('cancels work queued by the old container before binding the new one', () => {
        const clock = useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
        const first = document.createElement('div'), second = document.createElement('div');
        const wrapper = mount(<Anchor getContainer={() => first}><Anchor.Link href="#first" title="first" /></Anchor>);
        const measure = spy(second, 'getBoundingClientRect');
        try {
            act(() => { first.dispatchEvent(new Event('scroll')); });
            act(() => { clock.tick(20); first.dispatchEvent(new Event('scroll')); });
            wrapper.setProps({ getContainer: () => second });
            measure.resetHistory();
            act(() => { clock.tick(150); });
            expect(measure.called).toBe(false);
        } finally { wrapper.unmount(); measure.restore(); clock.restore(); }
    });

    it('binds the new scroll container after getContainer changes', () => {
        const first = document.createElement('div'), second = document.createElement('div');
        const add = spy(second, 'addEventListener'), remove = spy(first, 'removeEventListener');
        const wrapper = mount(<Anchor getContainer={() => first}><Anchor.Link href="#first" title="first" /></Anchor>);
        try {
            wrapper.setProps({ getContainer: () => second });
            expect(add.getCalls().filter(call => call.args[0] === 'scroll').length).toBe(2);
            expect(remove.getCalls().filter(call => call.args[0] === 'scroll').length).toBe(2);
        } finally { wrapper.unmount(); add.restore(); remove.restore(); }
    });

    it('keeps the current listeners when only the callback identity changes', () => {
        const container = document.createElement('div');
        const wrapper = mount(<Anchor getContainer={() => container}><Anchor.Link href="#first" title="first" /></Anchor>);
        const add = spy(container, 'addEventListener'), remove = spy(container, 'removeEventListener');
        try {
            wrapper.setProps({ getContainer: () => container });
            expect(add.getCalls().filter(call => call.args[0] === 'scroll').length).toBe(0);
            expect(remove.getCalls().filter(call => call.args[0] === 'scroll').length).toBe(0);
        } finally { wrapper.unmount(); add.restore(); remove.restore(); }
    });

});
