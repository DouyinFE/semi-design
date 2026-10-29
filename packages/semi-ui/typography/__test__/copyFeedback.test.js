import React from 'react';
import { mount } from 'enzyme';
import copy from 'copy-text-to-clipboard';
import Typography from '../index';

rs.mock('copy-text-to-clipboard', () => ({ default: rs.fn() }));

describe('Typography copy feedback', () => {
    beforeEach(() => { rs.useFakeTimers(); });
    afterEach(() => { rs.clearAllTimers(); rs.useRealTimers(); });

    it.each([false, true])('only shows copied feedback on success and reports the result, result=%s', result => {
        copy.mockReturnValue(result);
        const onCopy = rs.fn();
        const wrapper = mount(<Typography.Paragraph copyable={{ onCopy }}>hello</Typography.Paragraph>);
        try {
            wrapper.find('span[role="button"]').simulate('click');
            expect(copy).toHaveBeenCalledWith('hello');
            expect(onCopy).toHaveBeenCalledTimes(1);
            expect(onCopy.mock.calls[0][2]).toBe(result);
            expect(wrapper.find('.semi-typography-action-copied').exists()).toBe(result);
        } finally { wrapper.unmount(); }
    });
});
