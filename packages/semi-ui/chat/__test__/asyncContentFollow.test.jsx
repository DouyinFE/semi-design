import React from 'react';
import { shallow } from 'enzyme';
import Chat from '../index';
import AIChatDialogue from '../../aiChatDialogue';
import ResizeObserver from '../../resizeObserver';

[Chat, AIChatDialogue].forEach(Component => {
    describe(`${Component.name} async content growth`, () => {
        const render = () => shallow(<Component chats={[]} />, { disableLifecycleMethods: true });
        const contentObserver = wrapper => wrapper.find(ResizeObserver).filterWhere(node =>
            node.children().findWhere(child => child.type() === 'div' && child.prop('onScroll')).length === 0).last();

        it('follows content growth while automatic following is enabled', () => {
            const wrapper = render();
            const scroll = jest.spyOn(wrapper.instance().foundation, 'scrollToBottomImmediately');
            wrapper.setState({ wheelScroll: false });
            contentObserver(wrapper).prop('onResize')([]);
            expect(scroll).toHaveBeenCalledTimes(1);
        });

        it('preserves the scroll position after the user pauses following', () => {
            const wrapper = render();
            const scroll = jest.spyOn(wrapper.instance().foundation, 'scrollToBottomImmediately');
            wrapper.setState({ wheelScroll: true });
            contentObserver(wrapper).prop('onResize')([]);
            expect(scroll).not.toHaveBeenCalled();
        });
    });
});
