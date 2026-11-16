import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import Notification from '../index';

describe('Notification leaving notices', () => {
    let wrapper;
    let host;
    let list;
    const add = id => list.add({ id, title: id, duration: 0 });
    const notice = id => [...host.querySelectorAll('.semi-notification-notice')].find(node => node.textContent === id);
    const expectLeaving = id => {
        expect(notice(id)).toBeTruthy();
        expect(notice(id).className).toContain('animation-hide');
    };

    beforeEach(() => {
        host = document.createElement('div');
        document.body.appendChild(host);
        wrapper = mount(<Notification/>, { attachTo: host });
        list = wrapper.instance();
        add('a');
        add('b');
    });

    afterEach(() => {
        wrapper.unmount();
        host.remove();
    });

    describe('activating the close button again while leaving', () => {
        const callbacks = () => ({ onClose: sinon.spy(), onCloseClick: sinon.spy(), onClick: sinon.spy() });
        const clickClose = id => notice(id).querySelector('.semi-notification-notice-icon-close').click();
        const open = (id, spies) => list.add({ id, title: id, duration: 0, ...spies });

        it('notifies once when clicked twice', () => {
            const spies = callbacks();
            open('c', spies);
            clickClose('c');
            expectLeaving('c');
            clickClose('c');
            expectLeaving('c');
            expect(spies.onClose.callCount).toBe(1);
            expect(spies.onCloseClick.callCount).toBe(1);
            expect(spies.onClick.called).toBe(false);
        });

        it('stays silent after Notification.close', () => {
            const spies = callbacks();
            open('c', spies);
            list.remove('c');
            clickClose('c');
            expectLeaving('c');
            expect(spies.onClose.called).toBe(false);
            expect(spies.onCloseClick.called).toBe(false);
            expect(spies.onClick.called).toBe(false);
        });

        it('notifies a notice reopened with the same id', () => {
            const spies = callbacks();
            open('c', spies);
            clickClose('c');
            clickClose('c');
            open('c', spies);
            clickClose('c');
            expect(spies.onClose.callCount).toBe(2);
            expect(spies.onCloseClick.callCount).toBe(2);
        });
    });

    it('keeps every notice when closing two in one React batch', () => {
        ReactDOM.unstable_batchedUpdates(() => {
            list.remove('a');
            list.remove('b');
        });
        expectLeaving('a');
        expectLeaving('b');
    });

    it('keeps a leaving notice when adding another', () => {
        list.remove('a');
        add('c');
        expectLeaving('a');
        expect(notice('c')).toBeTruthy();
    });

    it('keeps a leaving notice when updating another', () => {
        list.remove('a');
        list.update('b', { title: 'updated b' });
        expectLeaving('a');
    });

    it('releases each removed notice after its animation ends', () => {
        list.remove('a');
        notice('a').dispatchEvent(new Event('animationend', { bubbles: true }));
        expect(notice('a')).toBeUndefined();
        expect(list.removeItemStorage).toHaveLength(0);
        expect(list.state.removedItems).toHaveLength(0);
    });

    it('releases a removed notice without animationend after the hide duration', () => {
        jest.useFakeTimers();
        try {
            list.remove('a');
            expectLeaving('a');
            jest.advanceTimersByTime(1000);
            expect(notice('a')).toBeUndefined();
            expect(list.removeItemStorage).toHaveLength(0);
            expect(list.state.removedItems).toHaveLength(0);
        } finally {
            jest.useRealTimers();
        }
    });

    it('releases a removed notice immediately when motion is false', () => {
        list.add({ id: 'm', title: 'm', duration: 0, motion: false });
        list.remove('m');
        expect(notice('m')).toBeUndefined();
        expect(list.removeItemStorage).toHaveLength(0);
    });

    it('clears pending fallback timers on unmount', () => {
        jest.useFakeTimers();
        try {
            list.remove('a');
            wrapper.unmount();
            expect(jest.getTimerCount()).toBe(0);
            wrapper = mount(<Notification/>, { attachTo: host });
            list = wrapper.instance();
        } finally {
            jest.useRealTimers();
        }
    });

    it('allows a new notice to reuse an id that is leaving', () => {
        list.remove('a');
        list.add({ id: 'a', title: 'new a', duration: 0 });
        expect(notice('a')).toBeUndefined();
        expect(notice('new a').className).toContain('animation-show');
    });

    it('releases a reopened notice by its own fallback when an older leave timer is pending', () => {
        jest.useFakeTimers();
        try {
            list.remove('a');
            jest.advanceTimersByTime(100);
            list.add({ id: 'a', title: 'reopened', duration: 0 });
            jest.advanceTimersByTime(100);
            list.remove('a');
            expectLeaving('reopened');
            jest.advanceTimersByTime(350);
            expect(notice('reopened')).toBeUndefined();
            expect(list.removeItemStorage).toHaveLength(0);
        } finally {
            jest.useRealTimers();
        }
    });

    it('keeps pending animations when closing an unknown id', () => {
        list.remove('a');
        list.remove('unknown');
        expectLeaving('a');
    });

    it('preserves an existing leave animation when destroying the remaining notices', () => {
        list.remove('a');
        list.destroyAll();
        expectLeaving('a');
        expectLeaving('b');
    });
});
