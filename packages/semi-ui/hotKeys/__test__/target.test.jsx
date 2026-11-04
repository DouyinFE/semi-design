import React from 'react';
import { mount } from 'enzyme';
import HotKeys from '../index';

describe('HotKeys listener ownership', () => {
    let a;
    let b;
    beforeEach(() => {
        a = document.createElement('input');
        b = document.createElement('input');
        document.body.append(a, b);
    });
    afterEach(() => { a.remove(); b.remove(); });
    const key = node => node.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', bubbles: true }));

    it('moves a stable target getter to its new element after rendering', () => {
        let target = a;
        const onHotKey = sinon.spy();
        const wrapper = mount(<HotKeys hotKeys={['k']} getListenerTarget={() => target} onHotKey={onHotKey} />);
        try {
            key(a);
            expect(onHotKey.callCount).toBe(1);
            target = b;
            wrapper.setProps({ className: 'updated' });
            key(a);
            expect(onHotKey.callCount).toBe(1);
            key(b);
            expect(onHotKey.callCount).toBe(2);
        } finally { wrapper.unmount(); }
    });

    it('unregisters the element that was bound even if the getter changed without rendering', () => {
        let target = a;
        const onHotKey = sinon.spy();
        const wrapper = mount(<HotKeys hotKeys={['k']} getListenerTarget={() => target} onHotKey={onHotKey} />);
        target = b;
        wrapper.unmount();
        key(a);
        expect(onHotKey.callCount).toBe(0);
    });

    it('keeps one active listener when other props change', () => {
        const onHotKey = sinon.spy();
        const wrapper = mount(<HotKeys hotKeys={['k']} getListenerTarget={() => a} onHotKey={onHotKey} />);
        try {
            wrapper.setProps({ className: 'updated' });
            key(a);
            expect(onHotKey.callCount).toBe(1);
        } finally { wrapper.unmount(); }
        key(a);
        expect(onHotKey.callCount).toBe(1);
    });
});
