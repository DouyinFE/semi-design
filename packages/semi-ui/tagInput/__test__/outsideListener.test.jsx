import React from 'react';
import { mount } from 'enzyme';
import TagInput from '../index';

describe('TagInput outside click listener cleanup', () => {
    let wrappers;
    let handlers;
    let removeListener;

    beforeEach(() => {
        wrappers = [];
        handlers = [];
        removeListener = rstest.spyOn(document, 'removeEventListener');
    });

    afterEach(() => {
        wrappers.forEach(wrapper => wrapper.length && wrapper.unmount());
        handlers.forEach(handler => document.removeEventListener('click', handler, false));
        rstest.restoreAllMocks();
    });

    const render = () => {
        const wrapper = mount(<TagInput />);
        wrappers.push(wrapper);
        return wrapper;
    };

    const activate = wrapper => {
        wrapper.simulate('click');
        const handler = wrapper.instance().clickOutsideHandler;
        expect(typeof handler).toBe('function');
        handlers.push(handler);
        return handler;
    };

    it('removes the active listener on unmount', () => {
        const wrapper = render();
        const handler = activate(wrapper);
        wrapper.unmount();
        expect(removeListener).toHaveBeenCalledWith('click', handler, false);
    });

    it('cleans every listener across repeated mounts', () => {
        for (let i = 0; i < 3; i++) {
            const wrapper = render();
            const handler = activate(wrapper);
            wrapper.unmount();
            expect(removeListener).toHaveBeenCalledWith('click', handler, false);
        }
    });

    it('can unmount before activation', () => {
        const wrapper = render();
        expect(() => wrapper.unmount()).not.toThrow();
    });

    it('can unmount after an outside click already removed the listener', () => {
        const wrapper = render();
        const handler = activate(wrapper);
        document.body.click();
        expect(removeListener).toHaveBeenCalledWith('click', handler, false);
        expect(wrapper.instance().clickOutsideHandler).toBeNull();
        expect(() => wrapper.unmount()).not.toThrow();
    });
});
