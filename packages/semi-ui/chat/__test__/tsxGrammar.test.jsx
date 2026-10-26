import React from 'react';
import { render, waitFor, cleanup } from '@testing-library/react';
import Chat from '../index';
import AIChatDialogue from '../../aiChatDialogue';

const roles = { assistant: { name: 'Assistant' }, user: { name: 'User' } };
const views = [['Chat', Chat], ['AIChatDialogue', AIChatDialogue]];

describe.each(views)('%s code block language registration', (name, View) => {
    afterEach(cleanup);

    async function codeBlock(language, source) {
        const message = { id: 'code', role: 'assistant', status: 'completed', createdAt: 1700000000000, content: '```' + language + '\n' + source + '\n```' };
        const { container } = render(<View chats={[message]} roleConfig={roles} />);
        await waitFor(() => expect(container.querySelector('code')?.textContent.trim()).toBe(source));
        return container.querySelector('code');
    }

    it('highlights TypeScript syntax and JSX tags in a normal TSX message', async () => {
        const code = await codeBlock('tsx', 'type Props = { readonly name: string };\nconst count: number = 1;\nconst View = (props: Props) => <div>{props.name}</div>;');
        const values = selector => [...code.querySelectorAll(selector)].map(node => node.textContent);
        expect(values('.token.keyword')).toContain('type');
        expect(values('.token.keyword')).toContain('readonly');
        expect(values('.token.builtin')).toContain('string');
        expect(values('.token.builtin')).toContain('number');
        expect(values('.token.tag')).toContain('<div>');
    });

    it('preserves JSX highlighting in a normal JSX message', async () => {
        const code = await codeBlock('jsx', 'const View = () => <div>hello</div>;');
        expect([...code.querySelectorAll('.token.keyword')].map(node => node.textContent)).toContain('const');
        expect([...code.querySelectorAll('.token.tag')].map(node => node.textContent)).toContain('<div>');
    });
});
