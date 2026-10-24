import React from 'react';
import { mount } from 'enzyme';
import TreeSelect from '../index';

const treeData = [{
    label: 'Asia', value: 'Asia', key: '0', children: [
        { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
        { label: 'Shanghai', value: 'Shanghai', key: '0-1' },
    ],
}];
const initialValue = ['Beijing', 'Shanghai'];
const closeTag = wrapper => wrapper.find('.semi-tag-close').simulate('click', {
    nativeEvent: { stopImmediatePropagation() {} },
});

describe('TreeSelect tag removal with disabled descendants', () => {
    it.each([false, true])('preserves disabled selections with controlled=%s', controlled => {
        const onChange = rs.fn();
        const valueProps = controlled ? { value: initialValue } : { defaultValue: initialValue };
        const wrapper = mount(<TreeSelect multiple disableStrictly treeData={treeData} {...valueProps} onChange={onChange} />);
        try {
            expect(wrapper.find('.semi-tag-content').text()).toBe('Asia');
            closeTag(wrapper);
            expect(onChange.mock.calls[0][0]).toEqual(['Beijing']);
            if (controlled) {
                expect(wrapper.find('.semi-tag-content').text()).toBe('Asia');
                wrapper.setProps({ value: onChange.mock.calls[0][0] });
            }
            expect(wrapper.find('.semi-tag-content').text()).toBe('Beijing');
            expect(wrapper.find('.semi-tag-close')).toHaveLength(0);
        } finally { wrapper.unmount(); }
    });

    it('still removes all descendants without disableStrictly', () => {
        const onChange = rs.fn();
        const wrapper = mount(<TreeSelect multiple treeData={treeData} defaultValue={initialValue} onChange={onChange} />);
        try {
            closeTag(wrapper);
            expect(onChange.mock.calls[0][0]).toEqual([]);
            expect(wrapper.find('.semi-tag')).toHaveLength(0);
        } finally { wrapper.unmount(); }
    });

    it('preserves unrelated selections in unRelated mode', () => {
        const onChange = rs.fn();
        const wrapper = mount(<TreeSelect multiple disableStrictly checkRelation="unRelated"
            treeData={treeData} defaultValue={initialValue} onChange={onChange} />);
        try {
            closeTag(wrapper);
            expect(onChange.mock.calls[0][0]).toEqual(['Beijing']);
            expect(wrapper.find('.semi-tag-content').text()).toBe('Beijing');
        } finally { wrapper.unmount(); }
    });
});
