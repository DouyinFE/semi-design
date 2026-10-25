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

    it('allows a new notice to reuse an id that is leaving', () => {
        list.remove('a');
        list.add({ id: 'a', title: 'new a', duration: 0 });
        expect(notice('a')).toBeUndefined();
        expect(notice('new a').className).toContain('animation-show');
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
