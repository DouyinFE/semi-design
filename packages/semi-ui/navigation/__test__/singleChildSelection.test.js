import React from 'react';
import { mount } from 'enzyme';
import Nav from '../index';

const submenu = <Nav.Sub itemKey="group" text="Group"><Nav.Item itemKey="leaf" text="Leaf" /></Nav.Sub>;

describe('Navigation selected ancestors', () => {
    for (const [label, children] of [['single child', submenu], ['array', [React.cloneElement(submenu, { key: 'group' })]]]) {
        it(`opens the selected ancestor with ${label}`, () => {
            const wrapper = mount(<Nav defaultSelectedKeys={['leaf']}>{children}</Nav>);
            expect(wrapper.find('[aria-expanded=true]').length).toBe(1);
            expect(wrapper.find(Nav.Item).someWhere(item => item.prop('itemKey') === 'leaf')).toBe(true);
            wrapper.unmount();
        });
    }

    it('opens all selected ancestors under a single root', () => {
        const wrapper = mount(<Nav defaultSelectedKeys={['leaf']}><Nav.Sub itemKey="root" text="Root">{submenu}</Nav.Sub></Nav>);
        expect(wrapper.find('[aria-expanded=true]').length).toBe(2);
        wrapper.unmount();
    });

    it('keeps an explicit empty openKeys controlled', () => {
        const wrapper = mount(<Nav defaultSelectedKeys={['leaf']} openKeys={[]}>{submenu}</Nav>);
        expect(wrapper.find('[aria-expanded=true]').length).toBe(0);
        wrapper.unmount();
    });

    it('continues to open selected ancestors from items', () => {
        const wrapper = mount(<Nav defaultSelectedKeys={['leaf']} items={[{ itemKey: 'group', text: 'Group', items: [{ itemKey: 'leaf', text: 'Leaf' }] }]} />);
        expect(wrapper.find('[aria-expanded=true]').length).toBe(1);
        wrapper.unmount();
    });
});
