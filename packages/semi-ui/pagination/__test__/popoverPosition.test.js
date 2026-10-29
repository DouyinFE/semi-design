import React from 'react';
import sinon from 'sinon';
import Pagination from '../index';
import Tooltip from '../../tooltip';

describe('Pagination retained popover positioning', () => {
    it('repositions retained page popovers when an uncontrolled page changes', () => {
        const wrapper = mount(<Pagination total={10000000} defaultCurrentPage={9999} />);
        const reposition = sinon.spy(Tooltip.prototype, 'rePosition');
        const anchor = wrapper.find('[aria-label="More"]').first().getDOMNode();
        try {
            wrapper.find('[aria-label="Page 10000"]').simulate('click');
            expect(wrapper.find('[aria-label="More"]').first().getDOMNode()).toBe(anchor);
            expect(reposition.callCount).toBe(2);
        } finally {
            reposition.restore();
            wrapper.unmount();
        }
    });

    it.each([
        [{ currentPage: 8 }, { currentPage: 9 }],
        [{ currentPage: 8, showTotal: true }, { total: 10000000 }],
        [{ currentPage: 8 }, { showTotal: true }],
        [{ currentPage: 8 }, { pageSize: 20 }],
    ])('repositions retained popovers for relevant controlled layout changes: %j', (props, nextProps) => {
        const wrapper = mount(<Pagination total={1000} {...props} />);
        const reposition = sinon.spy(Tooltip.prototype, 'rePosition');
        try {
            wrapper.setProps(nextProps);
            expect(reposition.callCount).toBeGreaterThan(0);
        } finally {
            reposition.restore();
            wrapper.unmount();
        }
    });
});
