import React from 'react';
import Portal from '../index';

describe('Portal prop updates', () => {
    let wrapper;
    let first;
    let second;
    beforeEach(() => {
        first = document.createElement('div');
        second = document.createElement('div');
        document.body.append(first, second);
    });
    afterEach(() => { wrapper?.unmount(); first.remove(); second.remove(); });
    it('updates styles and removes properties that are no longer present', () => {
        wrapper = mount(<Portal style={{ zIndex: 1200, color: 'red' }}>Content</Portal>);
        const el = wrapper.instance().el;
        wrapper.setProps({ style: { zIndex: 2400 } });
        expect(el.style.zIndex).toBe('2400');
        expect(el.style.color).toBe('');
    });
    it('moves the existing portal into a new container without remounting children', () => {
        const mountChild = sinon.spy();
        class Child extends React.Component {
            componentDidMount() { mountChild(); }
            render() { return <input defaultValue="kept" />; }
        }
        let current = first;
        const getPopupContainer = () => current;
        wrapper = mount(<Portal getPopupContainer={getPopupContainer}><Child /></Portal>);
        const el = wrapper.instance().el;
        const input = el.querySelector('input');
        current = second;
        wrapper.setProps({ className: 'updated' });
        expect(el.parentElement).toBe(second);
        expect(el.querySelector('input')).toBe(input);
        expect(mountChild.callCount).toBe(1);
        wrapper.unmount();
        wrapper = null;
        expect(second.children.length).toBe(0);
    });
    it('updates class names on the existing portal', () => {
        wrapper = mount(<Portal className="first">Content</Portal>);
        const el = wrapper.instance().el;
        wrapper.setProps({ className: 'second', prefixCls: 'custom-portal' });
        expect(el.className).toBe('custom-portal second');
    });
});
