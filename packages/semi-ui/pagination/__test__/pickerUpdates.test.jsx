import React from 'react';
import { mount } from 'enzyme';
import Pagination from '../index';

describe('Pagination mini picker property updates', () => {
    it.each([
        [{ size: 'default', hoverShowPageSelect: false }, { size: 'small', hoverShowPageSelect: true }],
        [{ size: 'small', hoverShowPageSelect: false }, { hoverShowPageSelect: true }],
        [{ size: 'small', hoverShowPageSelect: true, disabled: true }, { disabled: false }],
    ])('fills the newly available picker: %j', (initial, next) => {
        const wrapper = mount(<Pagination total={90} pageSize={10} {...initial} />);
        try {
            wrapper.setProps(next);
            expect(wrapper.state('allPageNumbers')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        } finally { wrapper.unmount(); }
    });
    it('uses the latest total when re-enabling a disabled picker', () => {
        const wrapper = mount(<Pagination total={90} pageSize={10} size="small" hoverShowPageSelect disabled />);
        try {
            wrapper.setProps({ total: 40 });
            wrapper.setProps({ disabled: false });
            expect(wrapper.state('allPageNumbers')).toEqual([1, 2, 3, 4]);
        } finally { wrapper.unmount(); }
    });
    it('retains the existing effective page-size fallback', () => {
        const wrapper = mount(<Pagination total={30} size="small" hoverShowPageSelect />);
        try {
            wrapper.setProps({ total: 40 });
            expect(wrapper.state('allPageNumbers')).toEqual([1, 2, 3, 4]);
        } finally { wrapper.unmount(); }
    });
});
