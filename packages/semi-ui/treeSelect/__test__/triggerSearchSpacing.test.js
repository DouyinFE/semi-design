import React from 'react';
import TreeSelect from '../index';

const treeData = [{ key: 'a', value: 'a', label: 'Alpha' }];
const props = { treeData, multiple: true, filterTreeNode: true, searchPosition: 'trigger', motion: false };

describe('TreeSelect trigger search spacing', () => {
    it.each(['related', 'unRelated'])('uses selected spacing for %s default values', checkRelation => {
        const wrapper = mount(<TreeSelect {...props} checkRelation={checkRelation} defaultValue={['a']} />);
        try {
            expect(wrapper.find('.semi-tree-select').first().hasClass('semi-tree-select-multiple-tagInput-notEmpty')).toEqual(true);
            expect(wrapper.find('.semi-tag-content').text()).toEqual('Alpha');
        } finally {
            wrapper.unmount();
        }
    });

    it.each(['related', 'unRelated'])('switches to empty spacing when the %s value is cleared', checkRelation => {
        const wrapper = mount(<TreeSelect {...props} checkRelation={checkRelation} value={['a']} />);
        try {
            expect(wrapper.find('.semi-tree-select').first().hasClass('semi-tree-select-multiple-tagInput-notEmpty')).toEqual(true);
            wrapper.setProps({ value: [] });
            expect(wrapper.find('.semi-tree-select').first().hasClass('semi-tree-select-multiple-tagInput-empty')).toEqual(true);
            expect(wrapper.find('.semi-tag-content').length).toEqual(0);
        } finally {
            wrapper.unmount();
        }
    });
});
