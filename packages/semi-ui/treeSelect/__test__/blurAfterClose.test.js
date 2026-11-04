import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import TreeSelect from '../index';

describe('TreeSelect blur after closing the dropdown', () => {
    it.each([false, true])('blurs on an outside click after dropdown removal with multiple=%s', multiple => {
        const container = document.createElement('div');
        const outside = document.createElement('button');
        document.body.append(container, outside);
        const onBlur = rs.fn();
        const wrapper = mount(<TreeSelect multiple={multiple} motion={false} onBlur={onBlur}
            treeData={[{ label: 'Asia', value: 'Asia', key: '0' }]} />, { attachTo: container });
        try {
            wrapper.find('.semi-tree-select').simulate('click');
            expect(document.querySelector('.semi-tree-select-popover')).not.toBe(null);
            wrapper.find('.semi-tree-select').simulate('click');
            expect(document.querySelector('.semi-tree-select-popover')).toBe(null);
            expect(onBlur).not.toHaveBeenCalled();
            act(() => { outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); });
            wrapper.update();
            expect(onBlur).toHaveBeenCalledTimes(1);
            expect(wrapper.find('.semi-tree-select').hasClass('semi-tree-select-focus')).toBe(false);
            outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(onBlur).toHaveBeenCalledTimes(1);
        } finally { wrapper.unmount(); container.remove(); outside.remove(); }
    });

    it('keeps focus on trigger and dropdown clicks, then blurs on an outside click', () => {
        const container = document.createElement('div');
        const outside = document.createElement('button');
        document.body.append(container, outside);
        const onBlur = rs.fn();
        const wrapper = mount(<TreeSelect motion={false} onBlur={onBlur}
            treeData={[{ label: 'Asia', value: 'Asia', key: '0' }]} />, { attachTo: container });
        try {
            wrapper.find('.semi-tree-select').simulate('click');
            container.querySelector('.semi-tree-select').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            document.querySelector('.semi-tree-select-popover').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(onBlur).not.toHaveBeenCalled();
            act(() => { outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); });
            wrapper.update();
            expect(onBlur).toHaveBeenCalledTimes(1);
            expect(document.querySelector('.semi-tree-select-popover')).toBe(null);
        } finally { wrapper.unmount(); container.remove(); outside.remove(); }
    });
});
