import React from 'react';
import { mount } from 'enzyme';
import Modal from '../Modal';

describe('Modal remount lifecycle', () => {
    let wrapper;
    let host;

    beforeEach(() => {
        host = document.createElement('div');
        document.body.appendChild(host);
        document.body.style.overflow = '';
        document.body.style.width = '';
    });

    afterEach(async () => {
        wrapper?.unmount();
        await Promise.resolve();
        host.remove();
        document.body.style.overflow = '';
        document.body.style.width = '';
    });

    it('does not notify afterClose for a cleanup immediately followed by remount', async () => {
        const afterClose = jest.fn();
        wrapper = mount(<Modal visible motion={false} afterClose={afterClose}/>, { attachTo: host });
        const instance = wrapper.instance();
        instance.componentWillUnmount();
        instance.componentDidMount();
        await Promise.resolve();
        expect(afterClose).not.toHaveBeenCalled();
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('still notifies once when the visible modal is actually unmounted', async () => {
        const afterClose = jest.fn();
        wrapper = mount(<Modal visible motion={false} afterClose={afterClose}/>, { attachTo: host });
        wrapper.unmount();
        wrapper = null;
        expect(document.body.style.overflow).toBe('');
        await Promise.resolve();
        expect(afterClose).toHaveBeenCalledTimes(1);
    });

    it('ignores simulated cleanup and retains the subsequent real unmount notification', async () => {
        const afterClose = jest.fn();
        wrapper = mount(<Modal visible motion={false} afterClose={afterClose}/>, { attachTo: host });
        const instance = wrapper.instance();
        instance.componentWillUnmount();
        instance.componentDidMount();
        wrapper.unmount();
        wrapper = null;
        await Promise.resolve();
        expect(afterClose).toHaveBeenCalledTimes(1);
    });

    it('preserves the close notification and avoids repeating it on hidden unmount', async () => {
        const afterClose = jest.fn();
        wrapper = mount(<Modal visible motion={false} afterClose={afterClose}/>, { attachTo: host });
        wrapper.setProps({ visible: false });
        expect(afterClose).toHaveBeenCalledTimes(1);
        wrapper.unmount();
        wrapper = null;
        await Promise.resolve();
        expect(afterClose).toHaveBeenCalledTimes(1);
    });
});
