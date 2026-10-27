import React from 'react';
import Cascader from '../index';

describe('Cascader disabled initial dropdown', () => {
    const treeData = [{ label: 'A', value: 'a' }];

    it('does not show the default dropdown while disabled', () => {
        const onDropdownVisibleChange = sinon.spy();
        const wrapper = mount(<Cascader disabled defaultOpen treeData={treeData} motion={false} onDropdownVisibleChange={onDropdownVisibleChange} />);
        try {
            expect(wrapper.state('isOpen')).toBe(false);
            expect(document.querySelector('.semi-cascader-option-list')).toBeNull();
            expect(onDropdownVisibleChange.callCount).toBe(0);
        } finally { wrapper.unmount(); }
    });

    it('allows normal opening after the disabled component is enabled', () => {
        const wrapper = mount(<Cascader disabled defaultOpen treeData={treeData} motion={false} />);
        try {
            wrapper.setProps({ disabled: false });
            expect(wrapper.state('isOpen')).toBe(false);
            wrapper.find('.semi-cascader-selection').simulate('click');
            expect(wrapper.state('isOpen')).toBe(true);
        } finally { wrapper.unmount(); }
    });

    it('keeps defaultOpen working for an enabled component', () => {
        const wrapper = mount(<Cascader defaultOpen treeData={treeData} motion={false} />);
        try { expect(wrapper.state('isOpen')).toBe(true); } finally { wrapper.unmount(); }
    });
});
