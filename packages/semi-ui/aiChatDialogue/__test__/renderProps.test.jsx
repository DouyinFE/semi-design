import React from 'react';
import { mount } from 'enzyme';
import AIChatDialogue from '../index';

describe('AIChatDialogue render props', () => {
    let wrapper;
    const metadata = { name: 'Assistant', badge: 'beta' };
    const chats = [{ id: 'answer', role: 'assistant', name: 'helper', content: 'Welcome', status: 'completed' }];
    const baseProps = {
        chats,
        hints: [],
        roleConfig: { assistant: metadata, user: { name: 'User' } },
        dialogueRenderConfig: { renderDialogueContent: () => <p>Welcome</p> },
    };
    afterEach(() => wrapper?.unmount());

    it('passes object role metadata to the content renderer', () => {
        const render = rstest.fn(({ role }) => <p>{role?.name}</p>);
        wrapper = mount(<AIChatDialogue {...baseProps} dialogueRenderConfig={{ renderDialogueContent: render }} />);
        expect(render.mock.calls[0][0].role).toBe(metadata);
    });

    it('resolves named roles before passing metadata to the content renderer', () => {
        const render = rstest.fn(({ role }) => <p>{role?.name}</p>);
        wrapper = mount(<AIChatDialogue {...baseProps} roleConfig={{ assistant: new Map([['helper', metadata]]) }} dialogueRenderConfig={{ renderDialogueContent: render }} />);
        expect(render.mock.calls[0][0].role).toBe(metadata);
    });

    it('hides the default reset button when showReset is false', () => {
        wrapper = mount(<AIChatDialogue {...baseProps} showReset={false} />);
        expect(wrapper.find('.semi-icon-redo_stroked')).toHaveLength(0);
        expect(wrapper.find('div.semi-ai-chat-dialogue-action-show')).toHaveLength(1);
    });

    it('keeps the reset button enabled by default', () => {
        wrapper = mount(<AIChatDialogue {...baseProps} />);
        expect(wrapper.find('.semi-icon-redo_stroked')).toHaveLength(1);
    });

    it('updates the default reset button when showReset changes', () => {
        wrapper = mount(<AIChatDialogue {...baseProps} showReset />);
        wrapper.setProps({ showReset: false });
        expect(wrapper.find('.semi-icon-redo_stroked')).toHaveLength(0);
        wrapper.setProps({ showReset: true });
        expect(wrapper.find('.semi-icon-redo_stroked')).toHaveLength(1);
    });

    it('applies showReset to the actions supplied to a custom renderer', () => {
        const render = rstest.fn(({ defaultActionsObj }) => <div>{defaultActionsObj.resetNode}</div>);
        wrapper = mount(<AIChatDialogue {...baseProps} showReset={false} dialogueRenderConfig={{ ...baseProps.dialogueRenderConfig, renderDialogueAction: render }} />);
        expect(render.mock.calls[0][0].defaultActionsObj.resetNode).toBeUndefined();
        wrapper.setProps({ showReset: true });
        expect(wrapper.find('.semi-icon-redo_stroked')).toHaveLength(1);
    });

    it('does not add reset actions to an earlier assistant message', () => {
        wrapper = mount(<AIChatDialogue {...baseProps} chats={[...chats, { id: 'user', role: 'user', content: 'Follow up', status: 'completed' }]} />);
        expect(wrapper.find('.semi-icon-redo_stroked')).toHaveLength(0);
    });
});
