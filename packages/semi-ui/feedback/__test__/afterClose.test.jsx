import React from 'react';
import { mount } from 'enzyme';
import Feedback from '../index';
describe('Feedback afterClose', () => {
    it('runs afterClose when a popup finishes closing and preserves afterVisibleChange', async () => {
        const afterClose = sinon.spy(), afterVisibleChange = sinon.spy();
        const wrapper = mount(<Feedback visible motion={false} afterClose={afterClose} afterVisibleChange={afterVisibleChange} />);
        try {
            wrapper.setProps({ visible: false });
            await new Promise(resolve => setTimeout(resolve, 10));
            expect(afterClose.calledOnce).toBe(true);
            expect(afterVisibleChange.calledWith(false)).toBe(true);
            wrapper.setProps({ visible: true });
            await new Promise(resolve => setTimeout(resolve, 10));
            expect(afterClose.calledOnce).toBe(true);
        } finally { wrapper.unmount(); }
    });
});
