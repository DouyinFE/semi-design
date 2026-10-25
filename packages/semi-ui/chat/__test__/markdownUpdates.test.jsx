import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Chat from '../index';

async function waitForNode(wrapper, selector) {
    for (let attempt = 0; attempt < 30; attempt++) {
        wrapper.update();
        if (wrapper.exists(selector)) {
            return;
        }
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    }
    wrapper.update();
    expect(wrapper.exists(selector)).toBe(true);
}

const OldStrong = props => <strong {...props} data-version="old" />;
const NewStrong = props => <strong {...props} data-version="new" />;

describe('Chat Markdown configuration updates', () => {
    let wrapper;

    afterEach(() => {
        wrapper?.unmount();
    });

    ['string', 'array'].forEach(contentType => {
        function createChat(extraProps) {
            const text = '**unchanged message**';
            const content = contentType === 'string' ? text : [{ type: 'text', text }];
            return mount(<Chat
                chats={[{ id: 'answer', role: 'assistant', content, status: 'complete' }]}
                roleConfig={{ assistant: { name: 'Assistant' } }}
                hints={[]}
                uploadProps={{ action: '/upload' }}
                renderInputArea={() => null}
                {...extraProps}
            />);
        }

        it(`updates markdownRenderProps without changing ${contentType} content`, async () => {
            wrapper = createChat({ markdownRenderProps: { className: 'old-markdown', style: { color: 'blue' } } });
            await waitForNode(wrapper, '.old-markdown strong');
            const chats = wrapper.props().chats;

            wrapper.setProps({ markdownRenderProps: { className: 'new-markdown', style: { color: 'red' } } });

            expect(wrapper.props().chats).toBe(chats);
            expect(wrapper.exists('.new-markdown strong')).toBe(true);
            expect(wrapper.find('.new-markdown strong').text()).toBe('unchanged message');
            expect(wrapper.find('div.new-markdown').prop('style')).toEqual({ color: 'red' });
            expect(wrapper.exists('.old-markdown')).toBe(false);
        });

        it(`updates custom Markdown components without changing ${contentType} content`, async () => {
            wrapper = createChat({ customMarkDownComponents: { strong: OldStrong } });
            await waitForNode(wrapper, 'strong[data-version="old"]');
            const chats = wrapper.props().chats;

            wrapper.setProps({ customMarkDownComponents: { strong: NewStrong } });

            expect(wrapper.props().chats).toBe(chats);
            expect(wrapper.exists('strong[data-version="new"]')).toBe(true);
            expect(wrapper.find('strong[data-version="new"]').text()).toBe('unchanged message');
            expect(wrapper.exists('strong[data-version="old"]')).toBe(false);
        });

        it(`updates HTML escaping without changing ${contentType} content`, async () => {
            const text = '<b>user text</b>';
            const content = contentType === 'string' ? text : [{ type: 'text', text }];
            const chats = [{ id: 'question', role: 'user', content, status: 'complete' }];
            wrapper = createChat({ chats, escapeHtml: false });
            await waitForNode(wrapper, '.semi-markdownRender p');
            expect(wrapper.find('div.semi-markdownRender').text()).toBe('user text');

            wrapper.setProps({ escapeHtml: true });
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });
            wrapper.update();

            expect(wrapper.props().chats).toBe(chats);
            expect(wrapper.find('div.semi-markdownRender').text()).toBe(text);
        });
    });
});
