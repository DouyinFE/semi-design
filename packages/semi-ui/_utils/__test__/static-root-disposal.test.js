import React, { useEffect, useLayoutEffect } from 'react';
import Toast, { ToastFactory } from '../../toast';
import Notification from '../../notification';
import * as reactRender from '../reactRender';

describe.each([
    ['Toast', Toast, '.semi-toast-wrapper'],
    ['ToastFactory', ToastFactory.create(), '.semi-toast-wrapper'],
    ['Notification', Notification, '.semi-notification-wrapper'],
])('%s root disposal', (name, api, selector) => {
    afterEach(async () => {
        api.destroyAll();
        await Promise.resolve();
        jest.restoreAllMocks();
    });

    it.each([
        ['layout', useLayoutEffect],
        ['passive', useEffect],
    ])('defers root disposal from a %s effect cleanup', async (effect, useCleanupEffect) => {
        const unmountSpy = jest.spyOn(reactRender, 'unmount');
        function Page() {
            useCleanupEffect(() => () => {
                api.destroyAll();
                api.destroyAll();
            }, []);
            return null;
        }
        const page = mount(<Page />);
        api.info({ content: 'old', duration: 0, motion: false });
        const wrapper = document.querySelector(selector);

        page.unmount();

        expect(unmountSpy).not.toHaveBeenCalled();
        expect(wrapper.isConnected).toBe(true);

        await Promise.resolve();

        expect(unmountSpy).toHaveBeenCalledTimes(1);
        expect(unmountSpy).toHaveBeenCalledWith(wrapper);
        expect(wrapper.isConnected).toBe(false);
        expect(document.querySelector(selector)).toBeNull();
    });

    it('keeps a newly opened instance when pending disposal finishes', async () => {
        api.info({ content: 'old', duration: 0, motion: false });
        const oldWrapper = document.querySelector(selector);
        api.destroyAll();
        api.info({ content: 'new', duration: 0, motion: false });
        const newWrapper = [...document.querySelectorAll(selector)].find(wrapper => wrapper !== oldWrapper);

        await Promise.resolve();

        expect(oldWrapper.isConnected).toBe(false);
        expect(newWrapper.isConnected).toBe(true);
        expect(newWrapper.textContent).toContain('new');

        api.destroyAll();
        await Promise.resolve();

        expect(newWrapper.isConnected).toBe(false);
        expect(document.querySelector(selector)).toBeNull();
    });

    it('disposes both instances when a replacement closes before the microtask', async () => {
        api.info({ content: 'old', duration: 0, motion: false });
        api.destroyAll();
        api.info({ content: 'new', duration: 0, motion: false });
        api.destroyAll();

        await Promise.resolve();

        expect(document.querySelector(selector)).toBeNull();
    });
});
