import React from 'react';
import { mount } from 'enzyme';
import Transfer from '../index';

describe('Transfer tree search data updates', () => {
    const getData = version => [{ key: 'root', label: 'Documents', children: [{ key: 'target', value: 'target', label: `Alpha ${version}` }, { key: 'other', value: 'other', label: `Beta ${version}` }] }];

    it.each([false, true])('keeps custom tree search results when data changes with selection %s', selected => {
        const wrapper = mount(<Transfer type="treeList" dataSource={getData(0)} defaultValue={selected ? ['target'] : []}
            treeProps={{ filterTreeNode: (input, label, data) => data.key.includes(input), showFilteredOnly: true }} />);
        try {
            wrapper.find('input').at(0).simulate('change', { target: { value: 'target' } });
            expect(wrapper.find('.semi-tree-option-label').map(node => node.text())).toContain('Alpha 0');
            wrapper.setProps({ dataSource: getData(1) });
            wrapper.update();
            expect(wrapper.find('.semi-tree-option-label').map(node => node.text())).toContain('Alpha 1');
            expect(wrapper.state('searchResult').size).toBe(3);
            if (selected) expect(wrapper.state('selectedItems').has('target')).toBe(true);
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps filtering ordinary list data after an update', () => {
        const wrapper = mount(<Transfer dataSource={[{ key: 'a', value: 'a', label: 'Alpha' }]} />);
        try {
            wrapper.find('input').at(0).simulate('change', { target: { value: 'Beta' } });
            wrapper.setProps({ dataSource: [{ key: 'a', value: 'a', label: 'Alpha' }, { key: 'b', value: 'b', label: 'Beta' }] });
            expect([...wrapper.state('searchResult')]).toEqual(['b']);
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps custom search results when overridden tree data changes', () => {
        const treeProps = { treeData: getData(0), filterTreeNode: (input, label, data) => data.key.includes(input), showFilteredOnly: true };
        const wrapper = mount(<Transfer type="treeList" dataSource={[]} treeProps={treeProps} />);
        try {
            wrapper.find('input').at(0).simulate('change', { target: { value: 'target' } });
            expect(wrapper.find('.semi-tree-option-label').map(node => node.text())).toContain('Alpha 0');
            wrapper.setProps({ treeProps: { ...treeProps, treeData: getData(1) } });
            wrapper.update();
            expect(wrapper.find('.semi-tree-option-label').map(node => node.text())).toContain('Alpha 1');
        } finally {
            wrapper.unmount();
        }
    });
});
