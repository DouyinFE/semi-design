import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Tree from '../index';

const original = [{ key: 'old', label: 'old parent', children: [{ key: 'old-child', label: 'old child' }] }];
const replacement = [{ key: 'new', label: 'new node' }];
describe('Tree data updates during motion', () => {
    [false, true].forEach(expanded => {
        it('renders new treeData while ' + (expanded ? 'collapsing' : 'expanding'), async () => {
            let wrapper;
            wrapper = mount(<Tree treeData={original} defaultExpandedKeys={expanded ? ['old'] : []} motion onExpand={() => setTimeout(() => wrapper.setProps({ treeData: replacement }), 20)} />);
            try {
                await act(async () => {
                    wrapper.find('.semi-tree-option-expand-icon').first().simulate('click', { nativeEvent: new MouseEvent('click') });
                    await new Promise(resolve => setTimeout(resolve, 40));
                });
                wrapper.update();
                expect(wrapper.find('li').text()).toBe('new node');
            } finally { wrapper.unmount(); }
        });
    });
    it('finishes a normal expansion', async () => {
        const wrapper = mount(<Tree treeData={original} motion />);
        try {
            await act(async () => {
                wrapper.find('.semi-tree-option-expand-icon').first().simulate('click', { nativeEvent: new MouseEvent('click') });
                await new Promise(resolve => setTimeout(resolve, 300));
            });
            wrapper.update();
            expect(wrapper.text()).toContain('old child');
        } finally { wrapper.unmount(); }
    });
    it('updates without motion', () => {
        const wrapper = mount(<Tree treeData={original} motion={false} />);
        try { wrapper.setProps({ treeData: replacement }); expect(wrapper.find('li').text()).toBe('new node'); }
        finally { wrapper.unmount(); }
    });
});
