import React from 'react';
import { mount } from 'enzyme';
import Breadcrumb from '../index';

describe('Breadcrumb.Item caller styles', () => {
    it('applies className and style to the item wrapper', () => {
        const wrapper = mount(<Breadcrumb><Breadcrumb.Item className="caller" style={{ padding: 12 }}>first</Breadcrumb.Item><Breadcrumb.Item>last</Breadcrumb.Item></Breadcrumb>);
        try {
            const node = wrapper.find('.semi-breadcrumb-item-wrap').first().getDOMNode();
            expect(node.classList.contains('caller')).toBe(true);
            expect(node.style.padding).toBe('12px');
            expect(node.classList.contains('semi-breadcrumb-item-wrap')).toBe(true);
        } finally { wrapper.unmount(); }
    });
    it('updates and removes styles without remounting the item', () => {
        const wrapper = mount(<Breadcrumb><Breadcrumb.Item itemKey="first" className="old" style={{ padding: 12 }}>first</Breadcrumb.Item></Breadcrumb>);
        try {
            const node = wrapper.find('.semi-breadcrumb-item-wrap').getDOMNode();
            wrapper.setProps({ children: <Breadcrumb.Item itemKey="first" className="new" style={{ padding: 24 }}>first</Breadcrumb.Item> });
            const updated = wrapper.find('.semi-breadcrumb-item-wrap').getDOMNode();
            expect(updated).toBe(node);
            expect(updated.classList.contains('new')).toBe(true);
            expect(updated.classList.contains('old')).toBe(false);
            expect(updated.style.padding).toBe('24px');
            wrapper.setProps({ children: <Breadcrumb.Item itemKey="first">first</Breadcrumb.Item> });
            expect(node.style.padding).toBe('');
        } finally { wrapper.unmount(); }
    });
    it('preserves active semantics, data attributes and click callbacks', () => {
        const click = rs.fn();
        const wrapper = mount(<Breadcrumb onClick={click}><Breadcrumb.Item className="caller" data-audit="item">only</Breadcrumb.Item></Breadcrumb>);
        try {
            expect(wrapper.find('[data-audit="item"]').hostNodes().prop('aria-current')).toBe('page');
            wrapper.find('.semi-breadcrumb-item').simulate('click');
            expect(click).toHaveBeenCalledTimes(1);
        } finally { wrapper.unmount(); }
    });
});
