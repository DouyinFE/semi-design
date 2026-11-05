import React from 'react';
import { mount } from 'enzyme';
import copy from 'copy-text-to-clipboard';
import ChatBoxAction from '../chatBox/chatBoxAction';
import Code from '../chatBox/code';

rs.mock('copy-text-to-clipboard', () => ({ default: rs.fn() }));

describe('Chat copy feedback', () => {
    beforeEach(() => { rs.useFakeTimers(); copy.mockReset(); });
    afterEach(() => { rs.clearAllTimers(); rs.useRealTimers(); });

    for (const content of ['hello', [{ text: 'hello' }]]) {
        it.each([false, true])(`only shows success for a successful message copy (${JSON.stringify(content)}), result=%s`, result => {
            copy.mockReturnValue(result);
            const success = rs.fn();
            const onMessageCopy = rs.fn();
            const wrapper = mount(<ChatBoxAction message={{ id: '1', role: 'assistant', content }}
                toast={{ success }} onMessageCopy={onMessageCopy} />);
            try {
                wrapper.find('button.semi-chat-chatBox-action-btn').at(0).simulate('click');
                expect(copy).toHaveBeenCalledWith('hello');
                expect(success).toHaveBeenCalledTimes(result ? 1 : 0);
                expect(onMessageCopy).toHaveBeenCalledTimes(1);
            } finally { wrapper.unmount(); }
        });
    }

    it('does not show success when there is no copyable message content', () => {
        const success = rs.fn();
        const wrapper = mount(<ChatBoxAction message={{ id: '1', role: 'assistant' }} toast={{ success }} />);
        try {
            wrapper.find('button.semi-chat-chatBox-action-btn').at(0).simulate('click');
            expect(copy).not.toHaveBeenCalled();
            expect(success).not.toHaveBeenCalled();
        } finally { wrapper.unmount(); }
    });

    it.each([false, true])('only marks a code block copied on success, result=%s', result => {
        copy.mockReturnValue(result);
        const wrapper = mount(<Code className="language-js">hello</Code>);
        try {
            wrapper.find('button').simulate('click');
            expect(copy).toHaveBeenCalledWith('hello');
            expect(wrapper.find('.semi-icon-tick').exists()).toBe(result);
        } finally { wrapper.unmount(); }
    });
});
