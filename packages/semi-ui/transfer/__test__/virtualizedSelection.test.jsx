import React from 'react';
import { mount } from 'enzyme';
import { FixedSizeList } from 'react-window';
import Transfer from '../index';
import AutoSizer from '../../tree/autoSizer';

describe.each([220, '100%'])('Transfer selected list with height %s', height => {
    let wrapper;
    const data = Array.from({ length: 120 }, (_, i) => ({ key: String(i), value: String(i), label: 'Item ' + i }));
    const selected = data.slice(0, 90).map(item => item.value);

    beforeEach(() => {
        wrapper = mount(<Transfer dataSource={data} value={selected}
            virtualize={{ height, width: 300, itemSize: 32 }} />);
        if (typeof height !== 'number') {
            const parent = wrapper.find('.semi-tree-auto-wrapper').getDOMNode().parentElement;
            Object.defineProperty(parent, 'offsetHeight', { configurable: true, value: 220 });
            wrapper.find(AutoSizer).instance()._onResize([{}, { target: parent }]);
            wrapper.update();
        }
        wrapper.find(FixedSizeList).instance().scrollTo(900);
        wrapper.update();
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it.each([
        ['parent render', () => ({ className: 'updated' })],
        ['adding a selection', () => ({ value: [...selected, '90'] })],
        ['removing a selection', () => ({ value: selected.slice(1) })],
    ])('keeps the scroll container after %s', (name, update) => {
        const outer = wrapper.find('.semi-transfer-right-virtual-list').hostNodes().getDOMNode();
        const scrollOffset = wrapper.find(FixedSizeList).state('scrollOffset');
        wrapper.setProps(update());
        expect(wrapper.find('.semi-transfer-right-virtual-list').hostNodes().getDOMNode()).toBe(outer);
        expect(wrapper.find(FixedSizeList).state('scrollOffset')).toBe(scrollOffset);
    });

    it('keeps row nodes while rendering updated selected content', () => {
        const outer = wrapper.find('.semi-transfer-right-virtual-list').hostNodes().getDOMNode();
        const row = outer.querySelector('[role="presentation"]');
        wrapper.setProps({ renderSelectedItem: item => <span className="updated-label">Updated {item.label}</span> });
        expect(wrapper.find('.semi-transfer-right-virtual-list').hostNodes().getDOMNode()).toBe(outer);
        expect(outer.querySelector('[role="presentation"]')).toBe(row);
        expect(wrapper.find('.updated-label').length).toBeGreaterThan(0);
        expect(wrapper.find('.updated-label').first().text()).toContain('Updated Item');
    });
});
