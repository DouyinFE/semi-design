import React from 'react';
import { mount } from 'enzyme';
import ScrollList from '../index';

describe('ScrollList root className', () => {
    it('applies caller classes only to the root while preserving inner selectors', () => {
        const wrapper = mount(<ScrollList className="custom-a custom-b" header="Header" footer="Footer"><span>content</span></ScrollList>);
        try {
            expect(wrapper.find('div.custom-a')).toHaveLength(1);
            expect(wrapper.find('div.custom-b')).toHaveLength(1);
            expect(wrapper.find('div.semi-scrolllist-line')).toHaveLength(1);
            expect(wrapper.find('div.semi-scrolllist-body')).toHaveLength(1);
            expect(wrapper.find('div.semi-scrolllist-footer')).toHaveLength(1);
        } finally { wrapper.unmount(); }
    });
    it('keeps custom prefix selectors', () => {
        const wrapper = mount(<ScrollList prefixCls="custom-prefix" className="outer" header="Header" footer="Footer">content</ScrollList>);
        try {
            expect(wrapper.find('div.custom-prefix-line')).toHaveLength(1);
            expect(wrapper.find('div.custom-prefix-body')).toHaveLength(1);
            expect(wrapper.find('div.custom-prefix-footer')).toHaveLength(1);
        } finally { wrapper.unmount(); }
    });
});
