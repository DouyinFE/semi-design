import React from 'react';
import { mount } from 'enzyme';
import copy from 'copy-text-to-clipboard';
import DialogueAction from '../widgets/dialogueAction';
import Code from '../widgets/contentItem/code';
import Toast from '../../toast';

rs.mock('copy-text-to-clipboard', () => ({ default: rs.fn() }));

describe('AIChatDialogue copy feedback', () => {
    beforeEach(() => { rs.useFakeTimers(); copy.mockReset(); });
    afterEach(() => { rs.restoreAllMocks(); rs.clearAllTimers(); rs.useRealTimers(); });

    for (const content of ['hello', [{ content: 'hello' }], [{ content: [{ text: 'hello' }] }]]) {
        it.each([false, true])(`only shows success for a successful message copy (${JSON.stringify(content)}), result=%s`, result => {
            copy.mockReturnValue(result);
            const success = rs.spyOn(Toast, 'success').mockImplementation(() => {});
            const onMessageCopy = rs.fn();
            const wrapper = mount(<DialogueAction message={{ id: '1', role: 'assistant', content }} onMessageCopy={onMessageCopy} />);
            try {
                wrapper.find('button.semi-ai-chat-dialogue-action-btn').at(0).simulate('click');
                expect(copy).toHaveBeenCalledWith('hello');
                expect(success).toHaveBeenCalledTimes(result ? 1 : 0);
                expect(onMessageCopy).toHaveBeenCalledTimes(1);
            } finally { wrapper.unmount(); }
        });
    }

    it('does not show success when there is no copyable message content', () => {
        const success = rs.spyOn(Toast, 'success').mockImplementation(() => {});
        const wrapper = mount(<DialogueAction message={{ id: '1', role: 'assistant' }} />);
        try {
            wrapper.find('button.semi-ai-chat-dialogue-action-btn').at(0).simulate('click');
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
