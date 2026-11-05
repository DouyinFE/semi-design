import * as React from 'react';
import ReactDOM from 'react-dom';
import { AIChatDialogue } from '../../index';

describe('AIChatDialogue list keys', () => {
    it('does not trigger missing key warning', () => {
        const spy = rs.spyOn(console, 'error').mockImplementation(() => {});
        const div = document.createElement('div');
        document.body.appendChild(div);
        const roleConfig = {
            user: { name: 'User', avatar: 'a.png' },
            assistant: { name: 'AI', avatar: 'b.png' },
        };
        const simple = [
            { id: '1', role: 'user', content: 'hi' },
            { id: '2', role: 'assistant', content: 'hello', status: 'completed' },
        ];
        const cases = [
            <AIChatDialogue key="references" chats={[{ id: '1', role: 'user', content: 'x', references: [{ name: 'a' }, { name: 'b' }] }]} roleConfig={roleConfig} />,
            <AIChatDialogue key="actions" chats={simple} roleConfig={roleConfig}
                dialogueRenderConfig={{ renderDialogueAction: ({ defaultActions, className }) => <div className={className}>{defaultActions}</div> }} />,
            <AIChatDialogue key="hints" chats={simple} roleConfig={roleConfig} hints={['h1', 'h2']}
                renderHintBox={({ content }) => <button>{content}</button>} />,
        ];
        cases.forEach(el => {
            ReactDOM.render(el, div);
            ReactDOM.unmountComponentAtNode(div);
        });
        const keyWarnings = spy.mock.calls.filter(c => String(c[0]).includes('unique "key" prop'));
        spy.mockRestore();
        expect(keyWarnings.length).toBe(0);
    });
});
