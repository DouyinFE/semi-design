import { AIChatDialogue } from '../../index';

describe('AIChatDialogue reference keyboard activation', () => {
    let host;
    let wrapper;
    beforeEach(() => {
        host = document.createElement('div');
        document.body.appendChild(host);
    });
    afterEach(() => {
        wrapper.unmount();
        host.remove();
    });
    const roleConfig = { user: { name: 'User' } };
    const cases = [
        ['plain text', 'Text', { type: 'text', content: 'Text' }],
        ['nested text', [{ type: 'message', content: [{ type: 'input_text', text: 'Nested text' }] }], { type: 'text', content: 'Nested text' }],
        ['file', [{ type: 'message', content: [{ type: 'input_file', filename: 'file.txt', file_url: 'https://example.com/file.txt' }] }], { name: 'file.txt', url: 'https://example.com/file.txt' }],
    ];

    cases.forEach(([name, content, expected]) => {
        it(`activates the ${name} reference with Enter and Space`, () => {
            const onReferenceClick = jest.fn();
            wrapper = mount(<AIChatDialogue roleConfig={roleConfig} chats={[{ id: 'message', role: 'user', content }]} showReference onReferenceClick={onReferenceClick} />, { attachTo: host });
            const reference = wrapper.find('.semi-ai-chat-dialogue-content-icon-reference').getDOMNode();
            reference.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
            reference.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
            expect(onReferenceClick.mock.calls).toEqual([[expected], [expected]]);
        });
    });

    it('keeps mouse activation and ignores unrelated keys', () => {
        const onReferenceClick = jest.fn();
        wrapper = mount(<AIChatDialogue roleConfig={roleConfig} chats={[{ id: 'message', role: 'user', content: 'Text' }]} showReference onReferenceClick={onReferenceClick} />, { attachTo: host });
        const reference = wrapper.find('.semi-ai-chat-dialogue-content-icon-reference');
        reference.simulate('keydown', { key: 'ArrowRight' });
        expect(onReferenceClick).not.toHaveBeenCalled();
        reference.simulate('click');
        expect(onReferenceClick).toHaveBeenCalledTimes(1);
    });
});
