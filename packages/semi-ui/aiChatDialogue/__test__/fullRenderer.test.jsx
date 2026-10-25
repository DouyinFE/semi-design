import React from 'react';
import { mount } from 'enzyme';
import AIChatDialogue from '../index';
import Dialogue from '../Dialogue';

describe('AIChatDialogue full renderer', () => {
    let wrapper;
    const message = { id: 'answer', role: 'assistant', name: 'helper', content: 'Welcome', status: 'completed' };
    const metadata = { name: 'Assistant' };
    const baseProps = {
        chats: [message], hints: [], roleConfig: { assistant: metadata },
        dialogueRenderConfig: { renderDialogueContent: () => <p className="default-content">Welcome</p> },
    };
    afterEach(() => wrapper?.unmount());

    it('keeps the default layout when no full renderer is provided', () => {
        wrapper = mount(<AIChatDialogue {...baseProps} />);
        expect(wrapper.find('div.semi-ai-chat-dialogue-container')).toHaveLength(1);
        expect(wrapper.find('.default-content').text()).toBe('Welcome');
        expect(wrapper.find('.semi-ai-chat-dialogue-title').hostNodes()).toHaveLength(1);
    });

    [false, true].forEach(useMap => {
        it(`passes the declared arguments and resolved ${useMap ? 'Map' : 'object'} role to the full renderer`, () => {
            const render = rstest.fn(({ message, className, defaultNodes }) => <article className={className}>
                <header>{message.id}</header>{defaultNodes.avatar}{defaultNodes.title}{defaultNodes.content}{defaultNodes.action}
            </article>);
            wrapper = mount(<AIChatDialogue {...baseProps}
                roleConfig={{ assistant: useMap ? new Map([['helper', metadata]]) : metadata }}
                dialogueRenderConfig={{ ...baseProps.dialogueRenderConfig, renderFullDialogue: render }}
            />);
            expect(render).toHaveBeenCalled();
            const args = render.mock.calls[0][0];
            expect(args.message).toBe(message);
            expect(args.role).toBe(metadata);
            expect(args.className).toBe('semi-ai-chat-dialogue-container');
            expect(Object.keys(args.defaultNodes)).toEqual(['avatar', 'title', 'content', 'action']);
            Object.values(args.defaultNodes).forEach(node => expect(React.isValidElement(node)).toBe(true));
            expect(wrapper.find('article.semi-ai-chat-dialogue-container')).toHaveLength(1);
            expect(wrapper.find('.default-content').text()).toBe('Welcome');
        });
    });

    it('keeps the selection shell and selection callback around custom content', () => {
        const onSelect = rstest.fn();
        wrapper = mount(<AIChatDialogue {...baseProps} selecting onSelect={onSelect}
            dialogueRenderConfig={{ renderFullDialogue: () => <article className="custom-full">Custom content</article> }}
        />);
        expect(wrapper.find('.custom-full')).toHaveLength(1);
        wrapper.find('span.semi-checkbox').simulate('click', {});
        expect(onSelect).toHaveBeenLastCalledWith(['answer']);
        expect(wrapper.find('div.semi-ai-chat-dialogue-wrapper-selected')).toHaveLength(1);
        wrapper.find('span.semi-checkbox').simulate('click', {});
        expect(onSelect).toHaveBeenLastCalledWith([]);
    });

    it('accepts null from a full renderer without restoring default content', () => {
        wrapper = mount(<AIChatDialogue {...baseProps} selecting
            dialogueRenderConfig={{ ...baseProps.dialogueRenderConfig, renderFullDialogue: () => null }}
        />);
        expect(wrapper.exists('.default-content')).toBe(false);
        expect(wrapper.find('input[type="checkbox"]')).toHaveLength(1);
        expect(wrapper.find('div.semi-ai-chat-dialogue-wrapper')).toHaveLength(1);
    });

    it('switches to the full renderer and back when the configuration changes', () => {
        wrapper = mount(<AIChatDialogue {...baseProps} />);
        wrapper.setProps({ dialogueRenderConfig: { renderFullDialogue: () => <article className="custom-full">Custom</article> } });
        expect(wrapper.exists('.custom-full')).toBe(true);
        expect(wrapper.exists('.default-content')).toBe(false);
        wrapper.setProps({ dialogueRenderConfig: baseProps.dialogueRenderConfig });
        expect(wrapper.exists('.custom-full')).toBe(false);
        expect(wrapper.exists('.default-content')).toBe(true);
    });

    it('preserves continuation layout and exposes all default nodes', () => {
        const render = rstest.fn(({ defaultNodes }) => <article>{defaultNodes.content}</article>);
        wrapper = mount(<Dialogue message={message} role={metadata} continueSend
            dialogueRenderConfig={{ ...baseProps.dialogueRenderConfig, renderFullDialogue: render }}
        />);
        expect(render).toHaveBeenCalled();
        expect(React.isValidElement(render.mock.calls[0][0].defaultNodes.title)).toBe(true);
        expect(wrapper.find('div.semi-ai-chat-dialogue-wrapper-continue-send')).toHaveLength(1);
        expect(wrapper.find('.semi-ai-chat-dialogue-title').hostNodes()).toHaveLength(0);
    });
});
