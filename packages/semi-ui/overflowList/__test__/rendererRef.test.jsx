import React from 'react';
import { mount } from 'enzyme';
import OverflowList from '../index';

describe('OverflowList scroll item refs', () => {
    it('preserves callback refs on mount and clears them on unmount', () => {
        let node;
        const ref = value => { node = value; };
        const wrapper = mount(<OverflowList items={[{ key: 'a' }]} renderMode="scroll" overflowRenderer={() => [null, null]} visibleItemRenderer={item => <span key={item.key} ref={ref}>Item</span>} />);
        try { expect(node).toBe(wrapper.find('span').getDOMNode()); }
        finally { wrapper.unmount(); }
        expect(node).toBe(null);
    });
    it('preserves object refs', () => {
        const ref = React.createRef();
        const wrapper = mount(<OverflowList items={[{ key: 'a' }]} renderMode="scroll" overflowRenderer={() => [null, null]} visibleItemRenderer={item => <span key={item.key} ref={ref}>Item</span>} />);
        try { expect(ref.current).toBe(wrapper.find('span').getDOMNode()); }
        finally { wrapper.unmount(); }
        expect(ref.current).toBe(null);
    });
    it('supports elements without caller refs', () => {
        const wrapper = mount(<OverflowList items={[{ key: 'a' }]} renderMode="scroll" overflowRenderer={() => [null, null]} visibleItemRenderer={item => <span key={item.key}>Item</span>} />);
        try { expect(wrapper.find('span').text()).toBe('Item'); }
        finally { wrapper.unmount(); }
    });
});
