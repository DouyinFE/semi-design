import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Typography from '../index';

rs.mock('copy-text-to-clipboard', () => ({ default: () => true }));

describe('Typography repeated copy feedback', () => {
    beforeEach(() => { rs.useFakeTimers(); });
    afterEach(() => { rs.useRealTimers(); });

    const create = () => mount(<Typography.Paragraph copyable={{ duration: 3,
        render: (copied, doCopy) => <button onClick={doCopy}>{copied ? 'copied' : 'copy'}</button> }}>text</Typography.Paragraph>);
    const advance = (wrapper, ms) => { act(() => { rs.advanceTimersByTime(ms); }); wrapper.update(); };

    it('keeps feedback until the most recent copy duration expires', () => {
        const wrapper = create();
        try {
            wrapper.find('button').simulate('click');
            advance(wrapper, 2000);
            wrapper.find('button').simulate('click');
            advance(wrapper, 1000);
            expect(wrapper.find('button').text()).toBe('copied');
            advance(wrapper, 1999);
            expect(wrapper.find('button').text()).toBe('copied');
            advance(wrapper, 1);
            expect(wrapper.find('button').text()).toBe('copy');
        } finally { wrapper.unmount(); }
    });

    it('does not leave the earlier copy timer pending after unmount', () => {
        const wrapper = create();
        wrapper.find('button').simulate('click');
        advance(wrapper, 1000);
        wrapper.find('button').simulate('click');
        wrapper.unmount();
        expect(rs.getTimerCount()).toBe(0);
    });
});
