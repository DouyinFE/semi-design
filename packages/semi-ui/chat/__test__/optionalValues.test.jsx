import React from 'react';
import { mount } from 'enzyme';
import Chat from '../index';
import AIChatDialogue from '../../aiChatDialogue';

describe.each([['Chat', Chat, 'complete'], ['AIChatDialogue', AIChatDialogue, 'completed']])('%s optional hints', (name, Component, status) => {
    let wrapper;
    const makeProps = hints => ({
        chats: [{ id: 'answer', role: 'assistant', content: 'Welcome', status }],
        roleConfig: { assistant: { name: 'Assistant', avatar: 'A' } },
        hints,
        renderInputArea: () => null,
        chatBoxRenderConfig: { renderChatBoxContent: () => <p>Welcome</p> },
        dialogueRenderConfig: { renderDialogueContent: () => <p>Welcome</p> },
    });
    afterEach(() => wrapper?.unmount());

    it('accepts hints added after mounting without hints', () => {
        wrapper = mount(<Component {...makeProps(undefined)} />);
        expect(() => wrapper.setProps({ hints: ['Continue'] })).not.toThrow();
        expect(wrapper.text()).toContain('Continue');
    });

    it('accepts hints removed after mounting with hints', () => {
        wrapper = mount(<Component {...makeProps(['Continue'])} />);
        expect(() => wrapper.setProps({ hints: undefined })).not.toThrow();
        expect(wrapper.text()).not.toContain('Continue');
    });

    it('still scrolls when a hint is added to an existing array', () => {
        wrapper = mount(<Component {...makeProps(['First'])} />);
        const scroll = rstest.spyOn(wrapper.instance().foundation, 'scrollToBottomImmediately');
        wrapper.setProps({ hints: ['First', 'Second'] });
        expect(scroll).toHaveBeenCalledOnce();
    });
});

describe('AIChatDialogue optional chats', () => {
    let wrapper;
    afterEach(() => wrapper?.unmount());

    it('accepts unrelated updates when chats is omitted', () => {
        wrapper = mount(<AIChatDialogue />);
        expect(() => wrapper.setProps({ className: 'updated' })).not.toThrow();
    });

    it('accepts removing chats after mounting', () => {
        wrapper = mount(<AIChatDialogue chats={[]} />);
        expect(() => wrapper.setProps({ chats: undefined })).not.toThrow();
    });
});
