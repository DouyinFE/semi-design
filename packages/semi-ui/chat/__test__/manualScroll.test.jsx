import React from 'react';
import { shallow } from 'enzyme';
import Chat from '../index';
import AIChatDialogue from '../../aiChatDialogue';
import ChatFoundation from '@douyinfe/semi-foundation/chat/foundation';
import DialogueFoundation from '@douyinfe/semi-foundation/aiChatDialogue/foundation';

[[ChatFoundation, Chat, '.semi-chat-container-scroll-hidden'], [DialogueFoundation, AIChatDialogue, '.semi-ai-chat-dialogue-list-scroll-hidden']].forEach(([Foundation, Component, hiddenClass]) => {
    describe(`${Component.name} manual scrolling`, () => {
        let foundation;
        let container;
        let state;

        beforeEach(() => {
            let top = 0;
            container = {
                scrollHeight: 1000, clientHeight: 300,
                get scrollTop() { return top; },
                set scrollTop(value) { top = Math.max(0, Math.min(value, this.scrollHeight - this.clientHeight)); },
            };
            state = { wheelScroll: false };
            foundation = new Foundation({
                getContainerRef: () => container,
                getStates: () => state,
                setWheelScroll: value => { state.wheelScroll = value; },
            });
            rstest.stubGlobal('requestAnimationFrame', () => 1);
            foundation.scrollToBottomImmediately();
        });

        afterEach(() => rstest.unstubAllGlobals());

        const scroll = top => {
            container.scrollTop = top;
            foundation.containerScroll({ target: container, persist() {} });
        };

        it('pauses following when scrolling upward without a wheel event', () => {
            scroll(200);
            expect(state.wheelScroll).toBe(true);
        });

        it('resumes following when returning to the bottom', () => {
            state.wheelScroll = true;
            scroll(700);
            expect(state.wheelScroll).toBe(false);
        });

        it('keeps following paused while browsing downward away from the bottom', () => {
            scroll(200);
            state.wheelScroll = true;
            scroll(300);
            expect(state.wheelScroll).toBe(true);
        });

        it('does not mistake content growth for an upward user scroll', () => {
            container.scrollHeight = 1200;
            scroll(700);
            expect(state.wheelScroll).toBe(false);
        });

        it('stops an ongoing scroll animation when the user scrolls upward', () => {
            const destroy = rstest.fn();
            foundation.animation = { destroy };
            scroll(200);
            expect(destroy).toHaveBeenCalledTimes(1);
        });

        it('does not hide the initial scrollbar', () => {
            const wrapper = shallow(<Component chats={[]} roleConfig={{}} />, { disableLifecycleMethods: true });
            expect(wrapper.find(hiddenClass).length).toBe(0);
            wrapper.unmount();
        });
    });
});
