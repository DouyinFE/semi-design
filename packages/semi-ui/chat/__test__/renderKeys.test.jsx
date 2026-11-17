import * as React from 'react';
import ReactDOM from 'react-dom';
import { Chat } from '../../index';

describe('Chat list keys', () => {
    it('does not trigger missing or duplicate key warning', () => {
        const spy = rs.spyOn(console, 'error').mockImplementation(() => {});
        const div = document.createElement('div');
        document.body.appendChild(div);
        const roleConfig = { user: { name: 'U', avatar: 'a.png' }, assistant: { name: 'A', avatar: 'b.png' } };
        const chats = [
            { id: '1', role: 'user', content: 'hi', createAt: 1 },
            { id: '2', role: 'assistant', content: 'yo', createAt: 2, status: 'complete' },
        ];
        const multi = [{ id: 'm1', role: 'user', content: [{ type: 'text', text: 'a' }, { type: 'text', text: 'b' }, { type: 'image_url', image_url: { url: 'x.png' } }] }];
        const cases = [
            <Chat key="hints" chats={chats} roleConfig={roleConfig} hints={['h1', 'h2']}
                renderHintBox={({ content }) => <button>{content}</button>} onChatsChange={() => {}} />,
            <Chat key="divider" chats={[{ id: 'd1', role: 'divider' }, ...chats, { id: 'd2', role: 'divider' }]} roleConfig={roleConfig}
                renderDivider={() => <hr />} onChatsChange={() => {}} />,
            <Chat key="multi" chats={multi} roleConfig={roleConfig} onChatsChange={() => {}} />,
        ];
        cases.forEach(el => {
            ReactDOM.render(el, div);
            ReactDOM.unmountComponentAtNode(div);
        });
        const keyWarnings = spy.mock.calls.filter(c => /unique "key" prop|two children with the same key/.test(String(c[0])));
        spy.mockRestore();
        expect(keyWarnings.length).toBe(0);
    });
});
