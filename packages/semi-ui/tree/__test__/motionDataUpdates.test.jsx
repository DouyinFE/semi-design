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
    [false, true].forEach(expanded => {
        it('renders same-key content updates while ' + (expanded ? 'collapsing' : 'expanding'), async () => {
            const oldData = [{ key: 'p', label: 'parent-old', children: [{ key: 'c', label: 'child-old' }] }];
            const newData = [{ key: 'p', label: 'parent-new', children: [{ key: 'c', label: 'child-new' }] }];
            let wrapper;
            wrapper = mount(<Tree treeData={oldData} defaultExpandedKeys={expanded ? ['p'] : []} motion onExpand={() => setTimeout(() => wrapper.setProps({ treeData: newData }), 20)} />);
            try {
                let childDom;
                await act(async () => {
                    wrapper.find('.semi-tree-option-expand-icon').first().simulate('click', { nativeEvent: new MouseEvent('click') });
                    await new Promise(resolve => setTimeout(resolve, 5));
                });
                wrapper.update();
                childDom = wrapper.find('li').filterWhere(n => n.text() === 'child-old').getDOMNode();
                await act(async () => {
                    await new Promise(resolve => setTimeout(resolve, 40));
                });
                wrapper.update();
                expect(wrapper.text()).toContain('parent-new');
                expect(wrapper.text()).toContain('child-new');
                expect(wrapper.text()).not.toContain('-old');
                // The same DOM node means the running motion was kept instead of remounted
                expect(wrapper.find('li').filterWhere(n => n.text() === 'child-new').getDOMNode()).toBe(childDom);
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
