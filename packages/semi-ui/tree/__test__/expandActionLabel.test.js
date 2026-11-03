import React from 'react';
import { mount } from 'enzyme';
import Tree from '../index';

describe('Tree expand action name', () => {
    it('names the action for the current expanded state', () => {
        const wrapper = mount(<Tree motion={false} treeData={[{ key: 'parent', label: 'Parent', children: [{ key: 'child', label: 'Child' }] }]} />);
        expect(wrapper.find('[role="button"]').first().prop('aria-label')).toBe('Expand the tree item');
        wrapper.find('[role="button"]').first().simulate('click', { nativeEvent: new MouseEvent('click') });
        expect(wrapper.find('[role="button"]').first().prop('aria-label')).toBe('Collapse the tree item');
        wrapper.unmount();
    });

    it('names the collapse action for an initially expanded node', () => {
        const wrapper = mount(<Tree motion={false} defaultExpandedKeys={['parent']} treeData={[{ key: 'parent', label: 'Parent', children: [{ key: 'child', label: 'Child' }] }]} />);
        expect(wrapper.find('[role="button"]').first().prop('aria-label')).toBe('Collapse the tree item');
        wrapper.unmount();
    });
});
