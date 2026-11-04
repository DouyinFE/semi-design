import React from 'react';
import { mount } from 'enzyme';
import Pagination from '../index';
import Select from '../../select';

describe('Pagination page-size insertion', () => {
    it.each([
        [200, [10, 20, 50], [10, 20, 50, 200]],
        [5, [10, 20, 50], [5, 10, 20, 50]],
        [15, [10, 20, 50], [10, 15, 20, 50]],
        [20, [10, 20, 50], [10, 20, 50]],
        [200, [], [200]],
    ])('inserts %s into the displayed size options %j', (pageSize, pageSizeOpts, expected) => {
        const original = [...pageSizeOpts];
        const wrapper = mount(<Pagination total={2000} pageSize={pageSize} pageSizeOpts={pageSizeOpts} showSizeChanger />);
        try {
            const options = React.Children.toArray(wrapper.find(Select).prop('children')).map(node => node.props.value);
            expect(options).toEqual(expected);
            expect(pageSizeOpts).toEqual(original);
        } finally { wrapper.unmount(); }
    });
});
